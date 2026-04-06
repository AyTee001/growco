import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Orders } from '../entities/Orders';
import { Users } from '../entities/Users';
import { OrderItems } from '../entities/OrderItems';

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