import { Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto, UpdatePostDto } from './dto';
import { Post } from './entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  public async getPosts(): Promise<Post[]> {
    return this.postRepository.find();
  }

  public async getPostById(id: string): Promise<Post | null> {
    const post = this.postRepository.findOne({ where: { id: id } });
    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }
    return post;
  }

  public async createPost(postDto: CreatePostDto): Promise<Post> {
    const post = this.postRepository.create(postDto);
    await this.postRepository.save(post);
    return post;
  }

  public async updatePost(id: string, updateDto: UpdatePostDto): Promise<Post> {
    const post = await this.postRepository.findOne({ where: { id } });
    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }
    Object.assign(post, updateDto);
    return await this.postRepository.save(post);
  }

  public async deletePost(id: string): Promise<void> {
    await this.postRepository.delete(id);
  }
}
