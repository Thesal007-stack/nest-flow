import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Post } from '../post.entity';
import {
  IPostCountResult,
  IPostSearchBody,
  IPostSearchResult,
} from '../types/post.types';
import type { CountResponse } from '@elastic/elasticsearch/lib/api/types';
@Injectable()
export class PostSearchService {
  private readonly _index = 'posts';
  constructor(private readonly esService: ElasticsearchService) {}

  public async indexPost(post: Post) {
    try {
      return await this.esService.index<IPostSearchBody>({
        index: this._index,
        id: post.id, // optional ES _id; omit if not needed
        document: {
          id: post?.id ?? null,
          title: post.title,
          content: post.content,
          authorId: post.author?.id ?? null,
        },
        refresh: 'wait_for', // this stays inside params, not as 2nd arg
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async count(query: string, fields: string[]): Promise<number> {
    const result: CountResponse = await this.esService.count({
      index: this._index,
      query: {
        multi_match: {
          query,
          fields,
        },
      },
    });

    return result.count;
  }

  public async search(
    text: string,
    offset?: number,
    limit?: number,
    startId?: string,
  ) {
    try {
      let separateCount = 0;
      if (startId) {
        // assuming your count() uses v8 style too
        separateCount = await this.count(text, ['title', 'paragraphs']);
      }

      const res = await this.esService.search<IPostSearchResult>({
        index: this._index,
        from: offset,
        size: limit,
        query: {
          bool: {
            should: [
              {
                multi_match: {
                  query: text,
                  fields: ['title', 'paragraphs'],
                },
              },
            ],
            filter: startId
              ? [
                  {
                    range: {
                      id: { gt: startId },
                    },
                  },
                ]
              : [],
          },
        },
        sort: [{ createdAt: { order: 'asc' } }],
        // track_total_hits: true, // optional: ensures accurate total for large result sets
      });

      const total =
        typeof res.hits.total === 'number'
          ? res.hits.total
          : (res.hits.total?.value ?? 0);

      const results = res.hits.hits.map((h) => h._source!).filter(Boolean);

      return {
        count: startId ? separateCount : total,
        results,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async remove(postId: string) {
    try {
      await this.esService.deleteByQuery({
        index: this._index,
        query: {
          match: { id: postId },
        },
        // refresh: true, // optional: to make deletions immediately visible
      });

      return { deleted: true };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  public async update(post: Post) {
    try {
      const newBody: IPostSearchBody = {
        id: post.id,
        title: post.title,
        content: post.content,
        authorId: post.author.id as string,
      };

      // Build a painless script that uses params (safe and robust)
      const source = Object.keys(newBody)
        .map((k) => `ctx._source.${k} = params.${k};`)
        .join(' ');

      const result = await this.esService.updateByQuery({
        index: this._index,
        // Prefer term/ids for exact matching; use match only for analyzed text.
        query: {
          term: { id: post.id }, // or: ids: { values: [post.id] } if using _id
        },
        script: {
          lang: 'painless',
          source,
          params: newBody,
        },
        // optional: refresh: true,
      });

      return result;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // public async update(post: Post) {
  //   await this.remove(post.id);
  //   await this.indexPost(post);
  // }
}
