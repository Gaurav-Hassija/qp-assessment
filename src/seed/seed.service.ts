import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleModel } from 'src/db_migrations/models/role.model';
import { Repository } from 'typeorm';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(RoleModel)
    private roleRepository: Repository<RoleModel>,
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
}
