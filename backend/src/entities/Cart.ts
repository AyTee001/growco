import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Users } from './Users';
import { CartItems } from './CartItems';
import { ApiProperty } from '@nestjs/swagger';

@Index('Cart_pkey', ['cartId'], { unique: true })
@Index('Cart_guest_session_id_key', ['guestSessionId'], { unique: true })
@Index('IX_Cart_User_Id', ['userId'], {})
@Entity('Cart', { schema: 'public' })
export class Cart {
  @ApiProperty({ type: 'integer', description: 'Unique identifier for the cart' })
  @PrimaryGeneratedColumn({ type: 'integer', name: 'cart_id' })
  cartId: number;

  @ApiProperty({ type: 'integer', nullable: true, required: false })
  @Column('integer', { name: 'user id', nullable: true })
  userId: number | null;

  @ApiProperty({ type: 'string', nullable: true, required: false })
  @Column('character varying', {
    name: 'guest_session_id',
    nullable: true,
    unique: true,
    length: 255,
  })
  guestSessionId: string | null;

  @ApiProperty({ type: () => Users, nullable: true })
  @ManyToOne(() => Users, (users) => users.carts, { onDelete: 'CASCADE' })
  @JoinColumn([{ name: 'user id', referencedColumnName: 'userId' }])
  user: Users;

  @ApiProperty({ type: () => [CartItems], description: 'List of items in the cart' })
  @OneToMany(() => CartItems, (cartItems) => cartItems.cart)
  cartItems: CartItems[];
}
