import { HttpException, HttpStatus } from '@nestjs/common';
import * as Joi from 'joi';
import {
  IAddItem,
  ICreateCategory,
  ICreateOrder,
  IDeleteItem,
  ISendOtp,
  IUpdateItem,
  IVerifyOtp,
} from '../interfaces/request-body';
const joiConfig = {
  abortEarly: false,
};

const parseErrorsFromJoi = (error) => {
  return (
    error?.details?.map((each) => ({
      field: each?.context?.label,
      message: each?.message,
    })) || []
  );
};

const sendPhoneOtpValidator = async (body: ISendOtp) => {
  try {
    const schema = Joi.object({
      phone_number: Joi.string().min(10).max(10).required(),
    });
    await schema.validateAsync(body, joiConfig);
  } catch (err) {
    throw new HttpException(parseErrorsFromJoi(err), HttpStatus.BAD_REQUEST);
  }
};

const verifyPhoneOtpValidator = async (body: IVerifyOtp) => {
  try {
    const schema = Joi.object({
      phone_number: Joi.string().min(10).max(10).required(),
      otp: Joi.string().required(),
    });
    await schema.validateAsync(body, joiConfig);
  } catch (err) {
    throw new HttpException(parseErrorsFromJoi(err), HttpStatus.BAD_REQUEST);
  }
};

const createCategoryValidator = async (body: ICreateCategory) => {
  try {
    const schema = Joi.object({
      name: Joi.string().required(),
      description: Joi.string().optional(),
    });
    await schema.validateAsync(body, joiConfig);
  } catch (err) {
    throw new HttpException(parseErrorsFromJoi(err), HttpStatus.BAD_REQUEST);
  }
};

const addItemValidator = async (body: IAddItem) => {
  try {
    const schema = Joi.object({
      category: Joi.number().required(),
      name: Joi.string().required(),
      description: Joi.string().optional(),
      price: Joi.number().required(),
      unit: Joi.string().valid('kg', 'dozen').required(),
      stock_available: Joi.number().required(),
    });
    await schema.validateAsync(body, joiConfig);
  } catch (err) {
    throw new HttpException(parseErrorsFromJoi(err), HttpStatus.BAD_REQUEST);
  }
};

const deleteItemValidator = async (body: IDeleteItem) => {
  try {
    const schema = Joi.object({
      item_id: Joi.number().required(),
    });
    await schema.validateAsync(body, joiConfig);
  } catch (err) {
    throw new HttpException(parseErrorsFromJoi(err), HttpStatus.BAD_REQUEST);
  }
};

const updateItemValidator = async (body: IUpdateItem) => {
  try {
    const schema = Joi.object({
      id: Joi.number().required(),
      name: Joi.string(),
      description: Joi.string(),
      price: Joi.number(),
      available_stock: Joi.string(),
    })
      .or('name', 'description', 'price', 'available_stock')
      .when(Joi.object({ id: Joi.exist() }).unknown(), {
        then: Joi.object({
          id: Joi.number().required(),
        }).or('name', 'description', 'price', 'available_stock'),
        otherwise: Joi.object({
          id: Joi.number().required(),
        }),
      });
    await schema.validateAsync(body, joiConfig);
  } catch (err) {
    throw new HttpException(parseErrorsFromJoi(err), HttpStatus.BAD_REQUEST);
  }
};

const createOrderValidator = async (body: ICreateOrder) => {
  try {
    const schema = Joi.object({
      items: Joi.array()
        .items({
          item_id: Joi.number().required(),
          quantity: Joi.number().required(),
        })
        .required()
        .min(1),
      billing_address: Joi.object({
        pincode: Joi.string().required(),
        city: Joi.string().required(),
        address_1: Joi.string().required(),
        address_2: Joi.string(),
        state: Joi.string().required(),
      }).required(),
      shipping_address: Joi.object({
        pincode: Joi.string().required(),
        city: Joi.string().required(),
        address_1: Joi.string().required(),
        address_2: Joi.string(),
        state: Joi.string().required(),
      }).required(),
    });
    await schema.validateAsync(body, joiConfig);
  } catch (err) {
    throw new HttpException(parseErrorsFromJoi(err), HttpStatus.BAD_REQUEST);
  }
};

export {
  addItemValidator,
  createCategoryValidator,
  createOrderValidator,
  deleteItemValidator,
  sendPhoneOtpValidator,
  updateItemValidator,
  verifyPhoneOtpValidator,
};
