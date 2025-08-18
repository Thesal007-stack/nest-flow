import { User } from '@modules/user/user.entity';
import { Repository, EntityRepository } from 'typeorm';
import { RegisterUserDto } from './dto';
import * as bcrypt from 'bcrypt';
import { NotFoundException } from '@nestjs/common';

@EntityRepository(User)
export class AuthRepository extends Repository<User> {
  public async createUser(userDto: RegisterUserDto): Promise<User> {
    const user = this.create(userDto);
    await this.save(user);
    return user;
  }
  public async getUserById(id: string): Promise<User> {
    const user = await this.findOne({ where: { id: id } });
    if (!user) {
      throw new NotFoundException(`User ${user} not match`);
    }

    return user;
  }
  public async getUserByEmail(email: string): Promise<User> {
    const user = await this.findOne({ where: { email: email } });
    if (!user) {
      throw new NotFoundException(`User ${user} not match`);
    }

    return user;
  }

  public async updateRefreshToken(
    user: User,
    currentHashedRefreshToken: string,
  ) {
    await this.save({
      ...user,
      currentHashedRefreshToken: currentHashedRefreshToken,
    });
    return user;
  }

  public async clearRefreshToken(user: User) {
    await this.save({
      ...user,
      currentHashedRefreshToken: null,
    });
    return user;
  }

  // Get user with from refresh token
  public async getUserIfRefreshTokenMatches(
    refreshToken: string,
    userId: string,
  ) {
    const user = await this.getUserById(userId);

    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken,
    );
    if (isRefreshTokenMatching) return user;
    return null;
  }
}
