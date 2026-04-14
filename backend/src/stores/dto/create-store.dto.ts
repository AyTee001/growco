import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStoreDto {
  @ApiProperty({ example: 'Сільпо', description: 'Назва магазину' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: 'Київ', description: 'Місто' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  city: string;

  @ApiProperty({ example: 'вул. Хрещатик', description: 'Вулиця' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  street: string;

  @ApiProperty({ example: '22', description: 'Номер будинку' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  houseNumber: string;

  @ApiProperty({ example: '08:00 - 23:00', description: 'Години роботи' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  workingHours: string;
}
