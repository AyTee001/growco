import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Orders } from './Orders';
import { ApiProperty } from '@nestjs/swagger';

@Index('DeliverySlots_pkey', ['slotId'], { unique: true })
@Entity('DeliverySlots', { schema: 'public' })
export class DeliverySlots {
  @ApiProperty({ type: 'integer', description: 'Unique identifier for the delivery slot' })
  @PrimaryGeneratedColumn({ type: 'integer', name: 'slot_id' })
  slotId: number;

  @ApiProperty({ 
    type: 'string', 
    format: 'date-time', 
    example: '2026-04-02T09:00:00.000Z',
    description: 'The beginning of the delivery window' 
  })
  @Column('timestamp without time zone', { name: 'start time' })
  startTime: Date;

  @ApiProperty({ 
    type: 'string', 
    format: 'date-time', 
    example: '2026-04-02T10:00:00.000Z',
    description: 'The end of the delivery window' 
  })
  @Column('timestamp without time zone', { name: 'end time' })
  endTime: Date;

  @ApiProperty({ 
    type: 'boolean', 
    default: true, 
    description: 'Whether this slot is still open for booking' 
  })
  @Column('boolean', { name: 'is available', default: () => 'true' })
  isAvailable: boolean;

  @ApiProperty({ type: () => [Orders], required: false })
  @OneToMany(() => Orders, (orders) => orders.deliverySlot)
  orders: Orders[];
}
