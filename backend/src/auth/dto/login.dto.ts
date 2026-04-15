import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';
import { VALIDATION_PATTERNS } from 'src/shared/validation.constants';

export class LoginDto {
  @IsEmail({}, { message: 'Некоректний формат email' })
  @IsNotEmpty()
  @Matches(VALIDATION_PATTERNS.EMAIL, {
    message: 'Некоректний формат email'
  })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Пароль обов\'язковий' })
  password: string;
}