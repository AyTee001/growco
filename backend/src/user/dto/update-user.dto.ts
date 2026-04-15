import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Length, Matches } from 'class-validator';
import { VALIDATION_PATTERNS } from 'src/shared/validation.constants';

export class UpdateUserDto {
  @ApiProperty({ example: 'Іван Петренко', required: false })
  @IsOptional()
  @IsString()
  @Length(2, 100, { message: 'Ім\'я має містити від 2 до 100 символів' })
  @Matches(VALIDATION_PATTERNS.NAME, { 
    message: 'Ім\'я може містити лише літери' 
  })
  name?: string;

  @ApiProperty({ example: '+380991234567', required: false })
  @IsOptional()
  @IsString()
  @Matches(VALIDATION_PATTERNS.PHONE_UA, { 
    message: 'Телефон має бути у форматі: +380XXXXXXXXX' 
  })
  phoneNumber?: string;
}