import { Address } from '@modules/address/address.entity';
import { Category } from '@modules/category/category.entity';
import { Comment } from '@modules/comment/comment.entity';
import { Post } from '@modules/post/post.entity';
import { User } from '@modules/user/user.entity';
import { join } from 'path';

export function ormConfig(): any {
  const envMode = process.env.NODE_ENV || 'development';
  switch (envMode) {
    case 'development':
      return configForDevelopment();
    case 'test':
      return configForTesting();
    case 'production':
      return configForProduction();
    default:
      return configForDevelopment();
  }
}

const configForTesting = () => {
  return {
    type: 'postgres',
    database: 'src/common/databases/test.db',
    entities: [join(__dirname, '**', '*.entity.{ts,js}')],
    synchronize: true,
  };
};
const configForDevelopment = () => {
  return {
    type: process.env.TYPEORM_CONNECTION,
    host: process.env.TYPEORM_HOST,
    port: Number(process.env.TYPEORM_PORT),
    username: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE,
    autoLoadEntities: true,
    entities: [join(__dirname, '**', '*.entity.{ts,js}')],
    logging: false,
    synchronize: true,
  };
};
const configForProduction = () => {
  return {
    type: process.env.TYPEORM_CONNECTION,
    host: process.env.TYPEORM_HOST,
    port: Number(process.env.TYPEORM_PORT),
    username: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE,
    autoLoadEntities: true,
    entities: [join(__dirname, '**', '*.entity.{ts,js}')],
    logging: false,
    synchronize: true,
  };
};
