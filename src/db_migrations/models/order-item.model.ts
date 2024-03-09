import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderModel } from './order.model';
import { CategoryModel } from './category.model';
import { ItemModel } from './item.model';

@Entity({ name: `order_item` })
export class OrderItemModel {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ nullable: true })
  display_order_id: string;

  @ManyToOne(() => OrderModel, (order) => order.id)
  @JoinColumn({
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_order_id',
    name: 'order_id',
  })
  @Column()
  order_id: string;

  @OneToOne(() => CategoryModel, (category) => category.id)
  @JoinColumn({
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_category_id',
    name: 'category_id',
  })
  @Column()
  category_id: string;

  @OneToOne(() => ItemModel, (item) => item.id)
  @JoinColumn({
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_item_id',
    name: 'item_id',
  })
  @Column()
  item_id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unit_price: number;

  @Column()
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 3, nullable: true })
  total_price: number;

  @Column()
  order_item_status: string;

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
