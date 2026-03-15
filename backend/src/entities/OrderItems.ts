import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Orders } from './Orders';
import { Products } from './Products';

@Index('OrderItems_pkey', ['itemId'], { unique: true })
@Index('IX_OrderItems_Order_Id', ['orderId'], {})
@Index('IX_OrderItems_Product_Id', ['productId'], {})
@Entity('OrderItems', { schema: 'public' })
export class OrderItems {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'item_id' })
  itemId: number;

  @Column('integer', { name: 'order id' })
  orderId: number;

  @Column('integer', { name: 'product id' })
  productId: number;

  @Column('integer', { name: 'quantity' })
  quantity: number;

  @Column('numeric', { name: 'price at purchase', precision: 10, scale: 2 })
  priceAtPurchase: string;

  @ManyToOne(() => Orders, (orders) => orders.orderItems, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'order id', referencedColumnName: 'orderId' }])
  order: Orders;

  @ManyToOne(() => Products, (products) => products.orderItems)
  @JoinColumn([{ name: 'product id', referencedColumnName: 'productId' }])
  product: Products;
}
