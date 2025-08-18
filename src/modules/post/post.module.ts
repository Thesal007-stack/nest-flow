import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostController } from './post.controller';
import { PostRepository } from './post.repository';
import { PostSearchService } from './services/post-search.service';
import { PostService } from './services/post.service';
import * as redisStore from 'cache-manager-redis-store';
import { CacheModule } from '@nestjs/cache-manager';
import { SearchModule } from 'src/search/search.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CacheModule.registerAsync({
      useFactory: () => ({
        store: redisStore,
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        ttl: 120,
      }),
    }),
    TypeOrmModule.forFeature([PostRepository]),
    SearchModule,
  ],
  controllers: [PostController],
  providers: [PostService, PostSearchService],
})
export class PostModule {}
