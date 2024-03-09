import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserOtpModel } from './user-otp.model';
import { AddressModel } from './address.model';
import { RoleModel } from './role.model';

@Entity({ name: `user` })
export class UserModel {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ nullable: true })
  email_address: string;

  @Column({ unique: true })
  phone_number: string;

  @Column({ nullable: true })
  first_name: string;

  @Column({ nullable: true })
  last_name: string;

  @OneToOne(() => AddressModel, (address) => address.id, {
    nullable: true,
  })
  @JoinColumn({
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_billing_address_id',
    name: 'billing_address_id',
  })
  @Column({ nullable: true })
  billing_address_id: number;

  @OneToOne(() => AddressModel, (address) => address.id, {
    nullable: true,
  })
  @JoinColumn({
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_shipping_address_id',
    name: 'shipping_address_id',
  })
  @Column({ nullable: true })
  shipping_address_id: number;

  @OneToOne(() => UserOtpModel, (userOtp) => userOtp.id, {
    nullable: true,
  })
  @JoinColumn({
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_user_otp_id',
    name: 'user_otp_id',
  })
  @Column({ nullable: true })
  user_otp_id: number;

  @OneToOne(() => RoleModel, (role) => role.id, {
    nullable: true,
  })
  @JoinColumn({
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_role_id',
    name: 'role_id',
  })
  @Column({ nullable: true })
  role_id: number;

  @Column({ default: false })
  is_active: boolean;

  @Column({ default: false })
  is_deleted: boolean;

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
