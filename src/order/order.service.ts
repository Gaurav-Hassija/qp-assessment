/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StatusCodes } from 'http-status-codes';
import { ORDER_DISPLAY_CONSTANT, TOTAL_TAX } from 'src/constants';
import { IAccessTokenPayload } from 'src/core/interfaces';
import { ICreateOrder } from 'src/core/interfaces/request-body';
import { ADDRESS_TYPE } from 'src/db_migrations/db_constants';
import { AddressModel } from 'src/db_migrations/models/address.model';
import { ItemModel } from 'src/db_migrations/models/item.model';
import { OrderItemModel } from 'src/db_migrations/models/order-item.model';
import { OrderModel } from 'src/db_migrations/models/order.model';
import { Repository } from 'typeorm';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(ItemModel)
    private itemRepository: Repository<ItemModel>,
    @InjectRepository(AddressModel)
    private addressRepository: Repository<AddressModel>,
    @InjectRepository(OrderModel)
    private orderRepository: Repository<OrderModel>,
    @InjectRepository(OrderItemModel)
    private orderItemRepository: Repository<OrderItemModel>,
  ) {}
  async createOrder(body: ICreateOrder, userData: IAccessTokenPayload) {
    try {
      const { items, shipping_address, billing_address } = body;
      const itemIds: string[] = [];
      const invalidItems: number[] = [];
      const unavailableItems: number[] = [];
      const itemsPayload = {};
      const itemsToUpdate: Partial<ItemModel>[] = [];
      let orderAmount = 0;
      // get all items
      const existingItems = await this.itemRepository
        .createQueryBuilder('item')
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

      existingItems.forEach((item) => {
        itemIds.push(item.id.toString());
        itemsPayload[item.id] = item;
      });

      // check if items exist in our DB if yes calculate the price of order
      items.forEach((item) => {
        if (!itemIds.includes(item.item_id.toString())) {
          invalidItems.push(item.item_id);
        } else if (
          Number(itemsPayload[item.item_id].stock_inventory) < item.quantity
        ) {
          unavailableItems.push(item.item_id);
        } else {
          const itemDetails = itemsPayload[item.item_id.toString()];
          orderAmount += Number(itemDetails.unit_price) * item.quantity;
          itemsToUpdate.push({
            id: itemDetails.id,
            stock_inventory:
              Number(itemDetails.stock_inventory) - item.quantity,
          });
        }
      });
      console.log(itemsToUpdate);

      // throw error is items does not exist in our DB
      if (invalidItems.length) {
        throw new HttpException(
          `Invalid item ids - [${invalidItems}]`,
          StatusCodes.BAD_REQUEST,
        );
      }

      // throw error if item quantity is not in stock
      if (unavailableItems.length) {
        throw new HttpException(
          `Unavailable quantity for item ids - [${unavailableItems}]`,
          StatusCodes.BAD_REQUEST,
        );
      }

      // insert into Address Table for this order
      // billing address
      const billingAddress = await this.addressRepository.save({
        address_1: billing_address.address_1,
        address_2: billing_address.address_2,
        city: billing_address.city,
        state: billing_address.state,
        pincode: billing_address.pincode,
        type: ADDRESS_TYPE.ORDER_BILLING,
      });

      // shipping address
      const shippingAddress = await this.addressRepository.save({
        address_1: shipping_address.address_1,
        address_2: shipping_address.address_2,
        city: shipping_address.city,
        state: shipping_address.state,
        pincode: shipping_address.pincode,
        type: ADDRESS_TYPE.ORDER_SHIPPING,
      });

      // create order payload to insert into orders table
      const tax = (orderAmount / 100) * TOTAL_TAX;
      const orderPayload: Partial<OrderModel> = {
        display_order_id: `${ORDER_DISPLAY_CONSTANT}${Date.now()}${Math.trunc(Math.random() * 1000)}`,
        user_id: userData.id.toString(),
        order_amount: orderAmount,
        order_cgst: Math.floor(tax / 2),
        order_sgst: Math.floor(tax / 2),
        grand_total: Math.floor(orderAmount + tax),
        order_status: 'ORDER_CONFIRMED',
        billing_address_id: billingAddress.id,
        shipping_address_id: shippingAddress.id,
      };

      const order = await this.orderRepository.save(orderPayload);

      // insert data into orderitems
      const orderItemPayload: Partial<OrderItemModel>[] = [];
      items.forEach((item) => {
        const itemDetails = itemsPayload[item.item_id];
        orderItemPayload.push({
          order_id: order.id,
          category_id: itemDetails.category_id,
          item_id: itemDetails.id,
          unit_price: itemDetails.unit_price,
          quantity: item.quantity,
          total_price: itemDetails.unit_price * item.quantity,
          order_item_status: 'ORDER_CONFIRMED',
        });
      });

      console.log(orderItemPayload);

      const orderItems = await this.orderItemRepository.save(orderItemPayload);
      console.log(orderItems);

      // update quantity of items in item table
      for (const item of itemsToUpdate) {
        await this.itemRepository.update(
          {
            id: item.id,
          },
          {
            stock_inventory: item.stock_inventory,
            updated_at: new Date(),
          },
        );
      }

      return {
        status: StatusCodes.OK,
        message: 'Order created Successfully',
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(error.response, error.status);
    }
  }

  async getOrders(userData: IAccessTokenPayload) {
    try {
      const { id } = userData;
      const orders: OrderModel[] = await this.orderRepository
        .createQueryBuilder('order')
        .leftJoinAndSelect('order.orderItems', 'orderItem')
        .where('order.user_id = :userId', { userId: id })
        .getMany();

      const orderPayload = [];

      orders.forEach((order: OrderModel) => {
        const orderItemsPayload = [];
        order.orderItems.forEach((orderItem) => {
          orderItemsPayload.push({
            id: orderItem.id,
            item_quantity: orderItem.quantity,
            item_unit_price: orderItem.unit_price,
            total_price: orderItem.total_price,
            status: orderItem.order_item_status,
          });
        });

        orderPayload.push({
          id: order.id,
          display_order_id: order.display_order_id,
          order_items: orderItemsPayload,
          order_amount: order.order_amount,
          order_tax: {
            cgst: order.order_cgst,
            sgst: order.order_sgst,
            igst: order.order_igst,
          },
          grand_total: order.grand_total,
        });
      });
      return {
        status: StatusCodes.OK,
        data: orderPayload,
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(error.response, error.status);
    }
  }
}
