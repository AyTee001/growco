import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsOptional, Validate } from 'class-validator';
import { IsAfterDate } from '../validators/is-after-date.validator';

export class CreateDeliverySlotDto {
  @Type(() => Date)
  @IsDate()
  startTime!: Date;

  @Type(() => Date)
  @IsDate()
  @Validate(IsAfterDate, ['startTime'])
  endTime!: Date;

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;
}
