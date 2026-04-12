import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Orders } from './Orders';
import { ApiProperty } from '@nestjs/swagger';

@Index('Stores_pkey', ['storeId'], { unique: true })
@Entity('Stores', { schema: 'public' })
export class Stores {
  @ApiProperty({ type: 'integer', description: 'Unique identifier for the store' })
  @PrimaryGeneratedColumn({ type: 'integer', name: 'store_id' })
  storeId: number;

  @ApiProperty({ type: 'string', example: 'Магазин №1' })
  @Column('character varying', { name: 'name', length: 100 })
  name: string;

  @ApiProperty({ type: 'string', example: 'Київ' })
  @Column('character varying', { name: 'city', length: 100 })
  city: string;

  @ApiProperty({ type: 'string', example: 'вул. Хрещатик' })
  @Column('character varying', { name: 'street', length: 255 })
  street: string;

  @ApiProperty({ type: 'string', example: '24/1' })
  @Column('character varying', { name: 'house number', length: 20 })
  houseNumber: string;

  @ApiProperty({ type: 'string', example: '08:00 - 22:00' })
  @Column('character varying', { name: 'working hours', length: 100 })
  workingHours: string;

  @ApiProperty({ type: () => [Orders], required: false })
  @OneToMany(() => Orders, (orders) => orders.store)
  orders: Orders[];
}