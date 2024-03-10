import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DbModule } from 'src/core/db/db.module';
import { CategoryModel } from 'src/db_migrations/models/category.model';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';

@Module({
  imports: [DbModule, JwtModule, TypeOrmModule.forFeature([CategoryModel])],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
