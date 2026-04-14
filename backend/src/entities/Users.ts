import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Cart } from './Cart';
import { LoyaltyTransactions } from './LoyaltyTransactions';
import { Orders } from './Orders';
import { Addresses } from './Addresses';
import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';

@Index('unique_email', ['email'], { unique: true })
@Index('users_email_key', ['email'], { unique: true })
@Index('users_phone_number_key', ['phoneNumber'], { unique: true })
@Index('unique_phone', ['phoneNumber'], { unique: true })
@Index('users_pkey', ['userId'], { unique: true })
@Entity('users', { schema: 'public' })
export class Users {
  @ApiProperty({ type: 'integer' })
  @PrimaryGeneratedColumn({ type: 'integer', name: 'user_id' })
  userId: number;

  @ApiProperty({ type: 'string', example: '+380991234567' })
  @Column('character varying', { name: 'phone_number', length: 20 })
  phoneNumber: string;

  @ApiProperty({ type: 'string', example: 'user@example.com' })
  @Column('character varying', { name: 'email', length: 255 })
  email: string;

  @ApiProperty({ type: 'string', example: 'Іван Петренко' })
  @Column('character varying', { name: 'name', length: 100 })
  name: string;

  @ApiHideProperty()
  @Column('character varying', { name: 'password_hash', length: 255 })
  passwordHash: string;

  @ApiProperty({ type: () => [Cart] })
  @OneToMany(() => Cart, (cart) => cart.user)
  carts: Cart[];

  @ApiProperty({ type: () => [LoyaltyTransactions] })
  @OneToMany(
    () => LoyaltyTransactions,
    (loyaltyTransactions) => loyaltyTransactions.user,
  )
  loyaltyTransactions: LoyaltyTransactions[];

  @ApiProperty({ type: () => [Orders] })
  @OneToMany(() => Orders, (orders) => orders.user)
  orders: Orders[];

  @ApiProperty({ type: () => [Addresses] })
  @OneToMany(() => Addresses, (addresses) => addresses.user)
  addresses: Addresses[];
}
