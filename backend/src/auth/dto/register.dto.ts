import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';
import { VALIDATION_PATTERNS } from 'src/shared/validation.constants';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2, { message: 'Ім\'я має містити мінімум 2 символи' })
  @Matches(VALIDATION_PATTERNS.NAME, { 
    message: 'Ім\'я може містити лише літери' 
  })
  name: string;

  @IsString()
  @IsNotEmpty()
  @Matches(VALIDATION_PATTERNS.PHONE_UA, { 
    message: 'Телефон має бути у форматі: +380XXXXXXXXX' 
  })
  phoneNumber: string;

  @IsEmail({}, { message: 'Некоректний формат email' })
  @IsNotEmpty()
  @Matches(VALIDATION_PATTERNS.EMAIL, {
    message: 'Некоректний формат email'
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'Пароль має містити щонайменше 6 символів' })
  password: string;
}