import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DbModule } from 'src/core/db/db.module';
import { AddressModel } from 'src/db_migrations/models/address.model';
import { ItemModel } from 'src/db_migrations/models/item.model';
import { OrderItemModel } from 'src/db_migrations/models/order-item.model';
import { OrderModel } from 'src/db_migrations/models/order.model';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({
  imports: [
    DbModule,
    JwtModule,
    TypeOrmModule.forFeature([ItemModel]),
    TypeOrmModule.forFeature([OrderModel]),
    TypeOrmModule.forFeature([AddressModel]),
    TypeOrmModule.forFeature([OrderItemModel]),
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
