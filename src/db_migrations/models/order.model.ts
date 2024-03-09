import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserModel } from './user.model';
import { AddressModel } from './address.model';

@Entity({ name: `order` })
export class OrderModel {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ nullable: true })
  display_order_id: string;

  @ManyToOne(() => UserModel, (user) => user.id)
  @JoinColumn({
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_user_id',
    name: 'user_id',
  })
  @Column()
  user_id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  order_amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 3, nullable: true })
  order_cgst: number;

  @Column({ type: 'decimal', precision: 10, scale: 3, nullable: true })
  order_sgst: number;

  @Column({ type: 'decimal', precision: 10, scale: 3, nullable: true })
  order_igst: number;

  @Column({ type: 'decimal', precision: 10, scale: 3 })
  grand_total: number;

  @Column()
  order_status: string;

  @OneToOne(() => AddressModel, (address) => address.id)
  @JoinColumn({
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_billing_address_id',
    name: 'billing_address_id',
  })
  @Column()
  billing_address_id: number;

  @OneToOne(() => AddressModel, (address) => address.id)
  @JoinColumn({
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_shipping_address_id',
    name: 'shipping_address_id',
  })
  @Column()
  shipping_address_id: number;

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
