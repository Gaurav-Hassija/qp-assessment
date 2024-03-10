import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StatusCodes } from 'http-status-codes';
import { ADMIN_ROLE } from 'src/constants';
import { IAccessTokenPayload } from 'src/core/interfaces';
import { IAddItem, IDeleteItem } from 'src/core/interfaces/request-body';
import { CategoryModel } from 'src/db_migrations/models/category.model';
import { ItemModel } from 'src/db_migrations/models/item.model';
import { Repository } from 'typeorm';

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(ItemModel)
    private itemRepository: Repository<ItemModel>,
    @InjectRepository(CategoryModel)
    private categoryRepository: Repository<CategoryModel>,
  ) {}
  async addItem(body: IAddItem, userData: IAccessTokenPayload) {
    try {
      if (userData.role !== ADMIN_ROLE) {
        throw new HttpException(
          `Access denied, restricted to administrators only`,
          StatusCodes.FORBIDDEN,
        );
      }
      const { name, description, category, price, stock_available, unit } =
        body;

      // check if category already exists
      const existingCategory = await this.categoryRepository.findOne({
        where: { id: category.toString() },
      });

      if (!existingCategory) {
        throw new HttpException(
          `Category does not exists!`,
          StatusCodes.BAD_REQUEST,
        );
      }

      // check if item already exists

      const existingItem = await this.itemRepository.findOne({
        where: { name, is_deleted: false },
      });

      if (existingItem) {
        throw new HttpException(
          `Item with name ${name} already exists!`,
          StatusCodes.BAD_REQUEST,
        );
      }

      // Insert item into item table
      const itemDetails = await this.itemRepository.save({
        category_id: category,
        name,
        description,
        unit_price: price,
        unit,
        stock_inventory: stock_available,
        is_active: true,
      });

      console.log(itemDetails);
      return {
        status: StatusCodes.OK,
        message: 'Item added successfully',
      };
    } catch (error) {
      throw new HttpException(error, error.status);
    }
  }

  async getAllItems(userData: IAccessTokenPayload) {
    try {
      let itemDetails: ItemModel[] & { category?: CategoryModel };
      if (userData.role === ADMIN_ROLE) {
        itemDetails = await this.itemRepository
          .createQueryBuilder('item')
          .leftJoinAndMapOne(
            'item.category',
            CategoryModel,
            'category',
            'category.id = item.category_id',
          )
          .where('item.is_deleted = :deleted', {
            deleted: false,
          })
          .getMany();
      } else {
        itemDetails = await this.itemRepository
          .createQueryBuilder('item')
          .leftJoinAndMapOne(
            'item.category',
            CategoryModel,
            'category',
            'category.id = item.category_id',
          )
          .where('item.is_deleted = :deleted', {
            deleted: false,
          })
          .andWhere('item.is_active = :active', {
            active: true,
          })
          .andWhere('item.stock_inventory > :inventory', {
            inventory: 0,
          })
          .getMany();
      }

      const items = itemDetails.map(
        (item: ItemModel & { category?: CategoryModel }) => {
          return {
            id: item.id,
            item_name: item.name,
            item_description: item.description,
            category_name: item.category.name,
            category_description: item.category.description,
            price: item.unit_price,
            unit: item.unit,
            display_price_string: `Rs ${item.unit_price} per ${item.unit}`,
          };
        },
      );
      return {
        status: StatusCodes.OK,
        message: 'All Items',
        data: items,
      };
    } catch (error) {
      throw new HttpException(error, error.s);
    }
  }

  async deleteItem(body: IDeleteItem, userData: IAccessTokenPayload) {
    try {
      if (userData.role !== ADMIN_ROLE) {
        throw new HttpException(
          `Access denied, restricted to administrators only`,
          StatusCodes.FORBIDDEN,
        );
      }
      const { item_id } = body;
      // check if item_id exist
      const existingItem = await this.itemRepository.findOne({
        where: { id: item_id.toString() },
      });
      if (!existingItem) {
        throw new HttpException(
          `Item does not exists!`,
          StatusCodes.BAD_REQUEST,
        );
      }

      // update item table
      await this.itemRepository.update(
        {
          id: item_id.toString(),
        },
        {
          is_deleted: true,
        },
      );

      return {
        status: StatusCodes.OK,
        message: 'Item deleted',
        data: {},
      };
    } catch (error) {
      throw new HttpException(error, error.s);
    }
  }
}
