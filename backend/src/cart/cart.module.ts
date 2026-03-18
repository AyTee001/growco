import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { Cart } from '../entities/Cart';
import { Users } from '../entities/Users';
import { CartItems } from '../entities/CartItems';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, Users, CartItems])],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
