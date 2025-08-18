import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './comment.entity';
import { CqrsModule } from '@nestjs/cqrs';
import CommentController from './comment.controller';
// import { CreateCommentHandler } from './commands/handlers/create-command.handler';
import { GetCommentsHandler } from './queries/handlers/get-comments.handler';
import { Post } from '@modules/post/post.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Comment, Post]), CqrsModule],
  controllers: [CommentController],
  providers: [ GetCommentsHandler],
})
export class  CommentModule {}
