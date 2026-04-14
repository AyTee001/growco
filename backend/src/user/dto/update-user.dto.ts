import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ example: 'Іван Петренко', required: false })
  @IsOptional()
  @IsString()
  @Length(2, 100)
  name?: string;

  @ApiProperty({ example: '+380991234567', required: false })
  @IsOptional()
  @IsString()
  phoneNumber?: string;
}