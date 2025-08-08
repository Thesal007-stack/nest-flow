import { IsString, IsOptional } from 'class-validator';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
// import * as moment from 'moment-timezone';

@Entity()
export class Post extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @IsOptional()
  @IsString()
  title: string;

  @Column()
  @IsOptional()
  @IsString()
  content: string;

  @CreateDateColumn({ type: 'timestamp' })
  createAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updateAt: Date;

  // @Column({
  //   type: Date,
  //   default: moment(new Date()).format('YYYY-MM-DD-HH:ss'),
  // })
  // createAt;

  // @Column({
  //   type: Date,
  //   default: moment(new Date()).format('YYYY-MM-DD-HH:ss'),
  // })
  // updateAt;
}
