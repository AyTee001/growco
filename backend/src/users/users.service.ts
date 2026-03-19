import {
  ConflictException,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError } from 'typeorm';
import { Users } from '../entities/Users';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<Users> {
    const { email, phoneNumber, name, passwordHash } = createUserDto;

    // Manual check for uniqueness for better error messages
    const existingEmail = await this.usersRepository.findOne({ where: { email: email.trim() } });
    if (existingEmail) {
      throw new ConflictException(`User with email ${email} already exists`);
    }

    const existingPhone = await this.usersRepository.findOne({ where: { phoneNumber: phoneNumber.trim() } });
    if (existingPhone) {
      throw new ConflictException(`User with phone number ${phoneNumber} already exists`);
    }

    const user = this.usersRepository.create({
      email: email.trim(),
      phoneNumber: phoneNumber.trim(),
      name: name.trim(),
      passwordHash,
    });

    try {
      return await this.usersRepository.save(user);
    } catch (error) {
      if (error instanceof QueryFailedError && error.message.includes('unique')) {
        throw new ConflictException('Email or phone number already exists');
      }
      throw error;
    }
  }

  async findAll(): Promise<Users[]> {
    return await this.usersRepository.find();
  }

  async findOne(userId: number): Promise<Users> {
    const user = await this.usersRepository.findOne({ where: { userId } });
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }
    return user;
  }

  async update(userId: number, updateUserDto: UpdateUserDto): Promise<Users> {
    const user = await this.findOne(userId);

    const { email, phoneNumber, name, passwordHash } = updateUserDto;

    if (email) {
      const trimmedEmail = email.trim();
      const existingEmail = await this.usersRepository.findOne({ where: { email: trimmedEmail } });
      if (existingEmail && existingEmail.userId !== userId) {
        throw new ConflictException(`User with email ${trimmedEmail} already exists`);
      }
      user.email = trimmedEmail;
    }

    if (phoneNumber) {
      const trimmedPhone = phoneNumber.trim();
      const existingPhone = await this.usersRepository.findOne({ where: { phoneNumber: trimmedPhone } });
      if (existingPhone && existingPhone.userId !== userId) {
        throw new ConflictException(`User with phone number ${trimmedPhone} already exists`);
      }
      user.phoneNumber = trimmedPhone;
    }

    if (name) {
      const trimmedName = name.trim();
      if (!trimmedName) {
        throw new BadRequestException('Name cannot be empty');
      }
      user.name = trimmedName;
    }

    if (passwordHash !== undefined) {
      if (passwordHash === '') {
        throw new BadRequestException('Password cannot be empty');
      }
      user.passwordHash = passwordHash;
    }

    try {
      return await this.usersRepository.save(user);
    } catch (error) {
       if (error instanceof QueryFailedError && error.message.includes('unique')) {
        throw new ConflictException('Email or phone number already exists');
      }
      throw error;
    }
  }

  async remove(userId: number): Promise<{ message: string }> {
    const user = await this.usersRepository.findOne({
      where: { userId },
      relations: ['carts', 'orders', 'addresses', 'loyaltyTransactions', 'loyaltyTransactions2'],
    });

    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    const hasRelations = 
      user.carts.length > 0 || 
      user.orders.length > 0 || 
      user.addresses.length > 0 || 
      user.loyaltyTransactions.length > 0 ||
      user.loyaltyTransactions2.length > 0;

    if (hasRelations) {
      throw new BadRequestException(
        `Cannot delete user with id ${userId} because they have associated records (carts, orders, addresses, or loyalty transactions).`,
      );
    }

    await this.usersRepository.remove(user);
    return { message: `User with id ${userId} deleted successfully` };
  }
}
