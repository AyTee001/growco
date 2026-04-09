import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Users } from '../entities/Users';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (user && (await bcrypt.compare(pass, user.passwordHash))) {
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.userId, role: user.role || 'user' };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(registerDto: RegisterDto) {
    const { email, password, name, phoneNumber } = registerDto;
    const existing = await this.usersRepository.findOne({ where: { email } });
    if (existing) {
      throw new UnauthorizedException('User already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({
      email,
      passwordHash: hashedPassword,
      name,
      phoneNumber,
    });
    await this.usersRepository.save(user);
    return this.login(user);
  }
}