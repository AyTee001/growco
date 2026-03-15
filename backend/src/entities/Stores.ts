import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Orders } from './Orders';

@Index('Stores_pkey', ['storeId'], { unique: true })
@Entity('Stores', { schema: 'public' })
export class Stores {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'store_id' })
  storeId: number;

  @Column('character varying', { name: 'name', length: 100 })
  name: string;

  @Column('character varying', { name: 'city', length: 100 })
  city: string;

  @Column('character varying', { name: 'street', length: 255 })
  street: string;

  @Column('character varying', { name: 'house number', length: 20 })
  houseNumber: string;

  @Column('character varying', { name: 'working hours', length: 100 })
  workingHours: string;

  @OneToMany(() => Orders, (orders) => orders.store)
  orders: Orders[];
}
