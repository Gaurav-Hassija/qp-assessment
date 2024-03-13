import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DbModule } from 'src/core/db/db.module';
import { RoleModel } from 'src/db_migrations/models/role.model';
import { SeedController } from './seed.controller';
import { SeedService } from './seed.service';

@Module({
  imports: [DbModule, JwtModule, TypeOrmModule.forFeature([RoleModel])],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}
