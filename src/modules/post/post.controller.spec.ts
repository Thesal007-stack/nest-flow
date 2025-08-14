import { Test, TestingModule } from '@nestjs/testing';
import { PostService } from './post.service';
import { Post } from './entities/post.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto, UpdatePostDto } from './dto';
import { NotFoundException } from '@nestjs/common';

describe('PostService', () => {
  let postService: PostService;
  let postRepository: Repository<Post>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        {
          provide: getRepositoryToken(Post),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            delete: jest.fn()
          },
        },
      ],
    }).compile();

    postService = module.get<PostService>(PostService);
    postRepository = module.get<Repository<Post>>(getRepositoryToken(Post));
  });

  describe('createPost', () => {
    it('should create and return a post', async () => {
      const dto: CreatePostDto = {
        title: 'Hello TORN',
        content: 'This is your post.',
      };

      const mockPost = { id: '1', ...dto };

      postRepository.create = jest.fn().mockReturnValue(mockPost);
      postRepository.save = jest.fn().mockResolvedValue(mockPost);

      const result = await postService.createPost(dto);

      expect(result).toEqual(mockPost);
    });
  });
  
  describe('getPosts', () => {
    it('should be return all post', async () => {
      const mockPosts = [
        { id: '1', title: 'Post 1', content: 'Content 1' },
        { id: '2', title: 'Post 2', content: 'Content 2' },
      ];
      postRepository.find = jest.fn().mockResolvedValue(mockPosts);
      const result = await postService.getPosts();
      expect(result).toEqual(mockPosts);
      expect(postRepository);
    });
  });

  describe('getPostById', () => {
    it('should return post by id', async () => {
      const mockPost = { id: '1', title: 'Post 1', content: 'Content 1' };
      postRepository.findOne = jest.fn().mockResolvedValue(mockPost);

      const result = await postService.getPostById('1');

      expect(result).toEqual({
        id: '1',
        title: 'Post 1',
        content: 'Content 1',
      });
    });
  });

  describe('updatePost', () => {
    const postId = '123';
    const existing: Post = {
      id: postId,
      title: 'abc',
      content: 'alphabet',
    } as Post;
    const updateDto: UpdatePostDto = {
      title: 'ABCD',
      content: 'This is alphabet',
    };

    it('should be update and return the post if found', async () => {
      postRepository.findOne = jest.fn().mockResolvedValue(existing);
      postRepository.save = jest.fn().mockResolvedValue({
        id: postId,
        ...updateDto
      })
      const result = await postService.updatePost(postId, updateDto);
      expect(postRepository.findOne).toHaveBeenCalledWith({
        where: { id: postId },
      });
      expect(postRepository.save).toHaveBeenCalledWith(
        expect.objectContaining(updateDto),
      );
      expect(result.title).toBe(updateDto.title);
      expect(result.content).toBe(updateDto.content);
    });
    it('should throw NotFoundException if post not found', async () => {
      postRepository.findOne = jest.fn().mockResolvedValue(null);
      await expect(postService.updatePost(postId, updateDto)).rejects.toThrow(
        new NotFoundException(`Post with id ${postId} not found`),
      );

      expect(postRepository.findOne).toHaveBeenCalledWith({
        where: { id: postId },
      });
      expect(postRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('deletePost', () => {
    it('should delete data by id', async () => {
      const postId ='123';
      postRepository.delete = jest.fn().mockResolvedValue(postId);
      await postService.deletePost(postId);

      expect(postRepository.delete).toHaveBeenCalledWith(postId);
    })
  })
});
