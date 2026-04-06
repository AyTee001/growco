import {
  Controller,
  Get,
  Query,
} from '@nestjs/common';
import { DeliverySlotsService } from './delivery-slots.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DeliverySlots } from 'src/entities/DeliverySlots';

@ApiTags('delivery-slots')
@Controller('delivery-slots')
export class DeliverySlotsController {
  constructor(private readonly deliverySlotsService: DeliverySlotsService) { }

  @Get()
  @ApiOperation({ summary: 'Get available delivery slots by date' })
  @ApiResponse({ status: 200, type: [DeliverySlots] })
  async findByDate(@Query('date') date: string) {
    return this.deliverySlotsService.findByDate(date);
  }
}