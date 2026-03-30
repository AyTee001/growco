import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Orders } from '../entities/Orders';
import { Users } from '../entities/Users';
import { Stores } from '../entities/Stores';
import { DeliverySlots } from '../entities/DeliverySlots';
import { OrderItems } from '../entities/OrderItems';
import { LoyaltyTransactions } from '../entities/LoyaltyTransactions';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Orders,
      Users,
      OrderItems,
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}