import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Orders } from './Orders';

@Index('DeliverySlots_pkey', ['slotId'], { unique: true })
@Entity('DeliverySlots', { schema: 'public' })
export class DeliverySlots {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'slot_id' })
  slotId: number;

  @Column('timestamp without time zone', { name: 'start time' })
  startTime: Date;

  @Column('timestamp without time zone', { name: 'end time' })
  endTime: Date;

  @Column('boolean', { name: 'is available', default: () => 'true' })
  isAvailable: boolean;

  @OneToMany(() => Orders, (orders) => orders.deliverySlot)
  orders: Orders[];
}
