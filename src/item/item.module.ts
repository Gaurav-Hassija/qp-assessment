import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DbModule } from 'src/core/db/db.module';
import { CategoryModel } from 'src/db_migrations/models/category.model';
import { ItemModel } from 'src/db_migrations/models/item.model';
import { ItemController } from './item.controller';
import { ItemService } from './item.service';

@Module({
  imports: [
    DbModule,
    JwtModule,
    TypeOrmModule.forFeature([ItemModel]),
    TypeOrmModule.forFeature([CategoryModel]),
  ],
  controllers: [ItemController],
  providers: [ItemService],
})
export class ItemModule {}
