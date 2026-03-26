import {
  Column,
  Entity,
  Index,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CartItems } from './CartItems';
import { OrderItems } from './OrderItems';
import { Categories } from './Categories';
import { ApiProperty } from '@nestjs/swagger';

@Index('ix_products_name', ['name'], {})
@Index('products_pkey', ['productId'], { unique: true })
@Entity('products', { schema: 'public' })
export class Products {
  @ApiProperty()
  @PrimaryGeneratedColumn({ type: 'integer', name: 'product_id' })
  productId: number;

  @ApiProperty()
  @Column('character varying', { name: 'name', length: 255 })
  name: string;

  @ApiProperty({
    type: 'string',
    nullable: true,
    required: false,
  })
  @Column('text', { name: 'description', nullable: true })
  description: string | null;

  @ApiProperty()
  @Column('numeric', { name: 'price', precision: 10, scale: 2 })
  price: string;

  @ApiProperty()
  @Column('integer', { name: 'qty_in_stock', default: () => '0' })
  qtyInStock: number;

  @ApiProperty({
    type: 'string',
    nullable: true,
    required: false,
  })
  @Column('character varying', { name: 'img_url', nullable: true, length: 500 })
  imgUrl: string | null;

  @ApiProperty()
  @OneToMany(() => CartItems, (cartItems) => cartItems.product)
  cartItems: CartItems[];

  @ApiProperty()
  @OneToMany(() => OrderItems, (orderItems) => orderItems.product)
  orderItems: OrderItems[];

  @ApiProperty()
  @ManyToMany(() => Categories, (categories) => categories.products)
  categories: Categories[];
}
