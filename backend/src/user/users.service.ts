import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '../entities/Users';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  async findOneById(userId: number): Promise<Users | null> {
    return this.usersRepository.findOne({
      where: { userId },
      relations: ['addresses'],
    });
  }

  async updateProfile(userId: number, updateDto: UpdateUserDto): Promise<Users> {
    const user = await this.usersRepository.preload({
      userId: userId,
      ...updateDto,
    });

    if (!user) {
      throw new NotFoundException(`User #${userId} not found`);
    }

    return this.usersRepository.save(user);
  }
}