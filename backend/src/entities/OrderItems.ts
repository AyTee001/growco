import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Orders } from './Orders';
import { Products } from './Products';
import { ColumnNumericTransformer } from 'src/shared/column-numeric-transformer';

@Index('OrderItems_pkey', ['itemId'], { unique: true })
@Index('IX_OrderItems_Order_Id', ['orderId'], {})
@Index('IX_OrderItems_Product_Id', ['productId'], {})
@Entity('OrderItems', { schema: 'public' })
export class OrderItems {
  @ApiProperty({ type: 'integer', description: 'Unique identifier for the order item' })
  @PrimaryGeneratedColumn({ type: 'integer', name: 'item_id' })
  itemId: number;

  @ApiProperty({ type: 'integer' })
  @Column('integer', { name: 'order id' })
  orderId: number;

  @ApiProperty({ type: 'integer' })
  @Column('integer', { name: 'product id' })
  productId: number;

  @ApiProperty({ type: 'integer', example: 2 })
  @Column('integer', { name: 'quantity' })
  quantity: number;

  @ApiProperty({
    type: 'number',
    example: 150.50,
    description: 'Price captured at the exact moment of purchase'
  })
  @Column('numeric', {
    name: 'price at purchase',
    precision: 10,
    scale: 2,
    transformer: new ColumnNumericTransformer()
  })
  priceAtPurchase: number;

  @ApiProperty({ type: () => Orders, required: false })
  @ManyToOne(() => Orders, (orders) => orders.orderItems, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'order id', referencedColumnName: 'orderId' }])
  order: Orders;

  @ApiProperty({ type: () => Products, required: false })
  @ManyToOne(() => Products, (products) => products.orderItems)
  @JoinColumn([{ name: 'product id', referencedColumnName: 'productId' }])
  product: Products;
}