import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { Cart } from '../entities/Cart';
import { Users } from '../entities/Users';
import { CartItems } from '../entities/CartItems';
import { Products } from 'src/entities/Products';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, Users, CartItems, Products]),],
  controllers: [CartController,],
  providers: [CartService,],
  exports: [CartService,],
})
export class CartModule {}