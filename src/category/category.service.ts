import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StatusCodes } from 'http-status-codes';
import { ADMIN_ROLE } from 'src/constants';
import { IAccessTokenPayload } from 'src/core/interfaces';
import { ICreateCategory } from 'src/core/interfaces/request-body';
import { CategoryModel } from 'src/db_migrations/models/category.model';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryModel)
    private categoryRepository: Repository<CategoryModel>,
  ) {}
  async createCategory(body: ICreateCategory, userData: IAccessTokenPayload) {
    try {
      if (userData.role !== ADMIN_ROLE) {
        throw new HttpException(
          `Access denied, restricted to administrators only`,
          StatusCodes.FORBIDDEN,
        );
      }
      const { name, description } = body;

      // check if category already exists
      const existingCategory = await this.categoryRepository.findOne({
        where: { name, is_deleted: false },
      });

      if (existingCategory) {
        throw new HttpException(
          `Category with name ${name} already exists!`,
          StatusCodes.BAD_REQUEST,
        );
      }

      // insert new category
      const categoryDetails = await this.categoryRepository.save({
        name,
        description,
        is_active: true,
      });
      console.log(categoryDetails);
      return {
        status: StatusCodes.OK,
        message: 'Category inserted successfully',
      };
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  }

  async getAllCategory() {
    try {
      const categoryDetails = await this.categoryRepository.find({
        where: {
          is_active: true,
          is_deleted: false,
        },
      });

      const categories = categoryDetails.map((category) => {
        return {
          id: category.id,
          name: category.name,
          description: category.description,
          active: category.is_active,
        };
      });

      return {
        status: StatusCodes.OK,
        message: 'All Categories',
        data: categories,
      };
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  }
}
