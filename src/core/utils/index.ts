import { HttpException } from '@nestjs/common';
import { StatusCodes } from 'http-status-codes';
import { ACCESS_TOKEN_EXPIRY } from 'src/constants';
import { IAccessTokenPayload } from '../interfaces';

export const generateOtp = () => Math.floor(1000 + Math.random() * 9000);

export const generateAccessToken = async (
  jwtService,
  { id, role, phone_number },
) => {
  try {
    return jwtService.sign(
      {
        id,
        role,
        phone_number,
      } as IAccessTokenPayload,
      {
        secret: process.env.ACCESS_TOKEN_SECRET,
        expiresIn: ACCESS_TOKEN_EXPIRY,
      },
    );
  } catch (error) {
    console.log(error);
    throw new HttpException(
      'Error in generating access token',
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
};
