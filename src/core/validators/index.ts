import { HttpException, HttpStatus } from '@nestjs/common';
import * as Joi from 'joi';
import {
  IAddItem,
  ICreateCategory,
  IDeleteItem,
  ISendOtp,
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
    throw new HttpException(
      'Validation Error',
      HttpStatus.BAD_REQUEST,
      parseErrorsFromJoi(err),
    );
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
    throw new HttpException(
      'Validation Error',
      HttpStatus.BAD_REQUEST,
      parseErrorsFromJoi(err),
    );
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
    throw new HttpException(
      'Validation Error',
      HttpStatus.BAD_REQUEST,
      parseErrorsFromJoi(err),
    );
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
    throw new HttpException(
      'Validation Error',
      HttpStatus.BAD_REQUEST,
      parseErrorsFromJoi(err),
    );
  }
};

const deleteItemValidator = async (body: IDeleteItem) => {
  try {
    const schema = Joi.object({
      item_id: Joi.number().required(),
    });
    await schema.validateAsync(body, joiConfig);
  } catch (err) {
    throw new HttpException(
      'Validation Error',
      HttpStatus.BAD_REQUEST,
      parseErrorsFromJoi(err),
    );
  }
};

export {
  addItemValidator,
  createCategoryValidator,
  deleteItemValidator,
  sendPhoneOtpValidator,
  verifyPhoneOtpValidator,
};
