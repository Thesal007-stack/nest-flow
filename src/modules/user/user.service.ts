import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterUserDto } from '../auth/dto/register-user.dto';
import User from './entities/user.entity';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public async getUsers(): Promise<User[]> {
    return await this.userRepository.find();
  }
  public async getUserById(id: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { id: id } });
  }
  public async getUserByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email: email } });
  }
  public async create(userDto: RegisterUserDto): Promise<User | null> {
    const user = this.userRepository.create(userDto);
    await this.userRepository.save(user);
    return user;
  }
}
