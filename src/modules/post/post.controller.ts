import { Body, Controller, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto, UpdatePostDto } from './dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Post')
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  @ApiOperation({description: 'Get All Posts'})
  public async getPost() {
    return await this.postService.getPosts();
  }

  @ApiOperation({description: 'Get Specific Post By UUID'})
  @Get('/:id')
  public async getPostId(@Param('id') id: string) {
    return await this.postService.getPostById(id);
  }

  @ApiOperation({description: 'Sync New Post'})
  @Post('/')
  public async createPost(@Body() postDto: CreatePostDto) {
    return await this.postService.createPost(postDto);
  }

  @ApiOperation({description: 'Update Specific Post By UUID'})
  @Put('/:id')
  public async updatePost(
    @Param('id') id: string,
    @Body() postDto: UpdatePostDto,
  ) {
    return await this.postService.updatePost(id, postDto);
  }

  @ApiOperation({description: 'Delete Specific Post by UUID'})
  @Patch('/:id')
  public async deletePost(@Param('id') id: string) {
    return await this.postService.deletePost(id);
  }
}
