import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CategoryModel } from './category.model';

@Entity({ name: `item` })
export class ItemModel {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(() => CategoryModel, (category) => category.id)
  @JoinColumn({
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_category_id',
    name: 'category_id',
  })
  @Column()
  category_id: number;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unit_price: number;

  @Column()
  stock_inventory: number;

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
