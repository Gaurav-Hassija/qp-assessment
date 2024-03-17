import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleModel } from 'src/db_migrations/models/role.model';
import { UserModel } from 'src/db_migrations/models/user.model';
import { Repository } from 'typeorm';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(RoleModel)
    private roleRepository: Repository<RoleModel>,
    @InjectRepository(UserModel)
    private userRepository: Repository<UserModel>,
  ) {}
  async seedRole() {
    try {
      // Create payload to update role table
      const seedPayload: Partial<RoleModel>[] = [
        {
          role: 'user',
        },
        {
          role: 'admin',
        },
      ];

      // insert data into role table
      await this.roleRepository.save(seedPayload);

      return {};
    } catch (error) {
      throw new HttpException(error, error.status);
    }
  }
  async seedAdmin() {
    try {
      // Get Admin role id
      const roleDetails = await this.roleRepository.findOne({
        where: { role: 'admin' },
      });

      // insert data into user table
      await this.userRepository.save({
        phone_number: '9999999999',
        role_id: roleDetails.id,
        is_active: true,
      });

      return {
        admin_phone_number: '9999999999',
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(error, error.status);
    }
  }
}
