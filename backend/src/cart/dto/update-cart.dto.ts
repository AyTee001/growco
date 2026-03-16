import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Length, Min } from 'class-validator';

export class UpdateCartDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  userId?: number | null;

  @IsOptional()
  @IsString()
  @Length(1, 255)
  guestSessionId?: string | null;
}
