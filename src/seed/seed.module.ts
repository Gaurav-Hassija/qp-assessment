import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DbModule } from 'src/core/db/db.module';
import { RoleModel } from 'src/db_migrations/models/role.model';
import { UserModel } from 'src/db_migrations/models/user.model';
import { SeedController } from './seed.controller';
import { SeedService } from './seed.service';

@Module({
  imports: [
    DbModule,
    TypeOrmModule.forFeature([RoleModel]),
    TypeOrmModule.forFeature([UserModel]),
  ],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}
