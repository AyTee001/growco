import {
  Controller,
  Get,
} from '@nestjs/common';
import { DeliverySlotsService } from './delivery-slots.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DeliverySlots } from 'src/entities/DeliverySlots';

@ApiTags('delivery-slots')
@Controller('delivery-slots')
export class DeliverySlotsController {
  constructor(private readonly deliverySlotsService: DeliverySlotsService) { }

  @Get('today')
  @ApiOperation({ summary: 'Get available delivery slots for today' })
  @ApiResponse({ status: 200, type: [DeliverySlots] })
  findToday(): Promise<DeliverySlots[]> {
    return this.deliverySlotsService.findToday();
  }
}