import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Users } from './Users';

@Index('addresses_pkey', ['addressId'], { unique: true })
@Index('ix_addresses_user_id', ['userId'], {})
@Entity('addresses', { schema: 'public' })
export class Addresses {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'address_id' })
  addressId: number;

  @Column('integer', { name: 'user_id' })
  userId: number;

  @Column('character varying', { name: 'street', length: 255 })
  street: string;

  @Column('character varying', { name: 'building', length: 20 })
  building: string;

  @Column('character varying', {
    name: 'apartment',
    nullable: true,
    length: 20,
  })
  apartment: string | null;

  @Column('character varying', { name: 'city', length: 100 })
  city: string;

  @Column('character varying', { name: 'postal_code', length: 10 })
  postalCode: string;

  @ManyToOne(() => Users, (users) => users.addresses)
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'userId' }])
  user: Users;
}
