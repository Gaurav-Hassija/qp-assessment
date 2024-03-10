import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { DbModule } from './core/db/db.module';
import { ItemModule } from './item/item.module';

@Module({
  imports: [AuthModule, DbModule, CategoryModule, ItemModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
