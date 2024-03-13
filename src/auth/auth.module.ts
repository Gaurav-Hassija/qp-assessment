import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DbModule } from 'src/core/db/db.module';
import { RoleModel } from 'src/db_migrations/models/role.model';
import { UserOtpModel } from 'src/db_migrations/models/user-otp.model';
import { UserModel } from 'src/db_migrations/models/user.model';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    DbModule,
    JwtModule,
    TypeOrmModule.forFeature([UserModel]),
    TypeOrmModule.forFeature([UserOtpModel]),
    TypeOrmModule.forFeature([RoleModel]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
