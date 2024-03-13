import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { DbModule } from './core/db/db.module';
import { ItemModule } from './item/item.module';
import { OrderModule } from './order/order.module';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
    AuthModule,
    DbModule,
    CategoryModule,
    ItemModule,
    OrderModule,
    SeedModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
