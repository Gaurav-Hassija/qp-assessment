import { ADDRESS_TYPE } from '../db_constants/index';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: `address` })
export class AddressModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  address_1: string;

  @Column({ nullable: true })
  address_2: string;

  @Column()
  city: string;

  @Column()
  pincode: string;

  @Column()
  state: string;

  @Column({
    type: 'enum',
    enum: ADDRESS_TYPE,
  })
  type: ADDRESS_TYPE;

  @Column({
    type: 'timestamp without time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @Column({
    type: 'timestamp without time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;
}
