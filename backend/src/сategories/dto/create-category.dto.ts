import { Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  Min,
} from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @Length(1, 100)
  name!: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  parentCategoryId?: number | null;

  @IsOptional()
  @IsString()
  @Length(1, 500)
  imgUrl?: string | null;
}
