import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliverySlots } from '../entities/DeliverySlots';
import { Orders } from '../entities/Orders';
import { DeliverySlotsController } from './delivery-slots.controller';
import { DeliverySlotsService } from './delivery-slots.service';
import { IsAfterDateConstraint } from './validators/is-after-date.validator';

@Module({
  imports: [TypeOrmModule.forFeature([DeliverySlots, Orders])],
  controllers: [DeliverySlotsController],
  providers: [DeliverySlotsService, IsAfterDateConstraint],
})
export class DeliverySlotsModule {}
