import { PartialType } from '@nestjs/mapped-types';
import { CreateDeliverySlotDto } from './create-delivery-slot.dto';

export class UpdateDeliverySlotDto extends PartialType(CreateDeliverySlotDto) {}
