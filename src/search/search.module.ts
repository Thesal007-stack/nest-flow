import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ElasticsearchModule } from '@nestjs/elasticsearch';

@Module({
  imports: [
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async () => ({
        node: process.env.ELASTICSEARCH_NODE,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [],
})
export class SearchModule {}
