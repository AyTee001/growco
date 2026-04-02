import {
  Controller,
  Get,
} from '@nestjs/common';
import { DeliverySlotsService } from './delivery-slots.service';

@Controller('delivery-slots')
export class DeliverySlotsController {
  constructor(private readonly deliverySlotsService: DeliverySlotsService) {}

  @Get()
  findAll() {
    return this.deliverySlotsService.findAll();
  }
}
