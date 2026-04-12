import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '../entities/Users';

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
}