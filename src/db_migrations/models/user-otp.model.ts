import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: `user_otp` })
export class UserOtpModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  otp: string;

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
