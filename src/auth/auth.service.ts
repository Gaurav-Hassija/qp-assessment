import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { StatusCodes } from 'http-status-codes';
import { OTP_EXPIRY_IN_SECONDS } from 'src/constants';
import { ISendOtp, IVerifyOtp } from 'src/core/interfaces/request-body';
import { generateAccessToken, generateOtp } from 'src/core/utils';
import { UserOtpModel } from 'src/db_migrations/models/user-otp.model';
import { UserModel } from 'src/db_migrations/models/user.model';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserModel)
    private userRepository: Repository<UserModel>,
    @InjectRepository(UserOtpModel)
    private userOtpRepository: Repository<UserOtpModel>,
    private readonly jwtService: JwtService,
  ) {}
  async sendOtp(body: ISendOtp) {
    try {
      const { phone_number } = body;

      // check if user exists
      let userData = await this.userRepository.findOne({
        where: { phone_number },
      });
      if (!userData) {
        const userResponse = await this.userRepository.save({
          phone_number,
          role_id: 1,
        });
        if (!userResponse) {
          throw new HttpException(
            'Something went wrong',
            StatusCodes.INTERNAL_SERVER_ERROR,
          );
        }
        userData = userResponse;
      }

      // generate otp
      const otp = await generateOtp();
      const userOtpResponse = await this.userOtpRepository.save({
        otp: otp.toString(),
      });

      // // configure twilio to send sms
      // const client = twilio(
      //   process.env.TWILIO_SID,
      //   process.env.TWILIO_AUTH_TOKEN,
      // );

      // // send otp using twilio client
      // // twilio works with free account
      // const twilioResponse = await client.messages.create({
      //   body: `Dear user, your otp to login into QP Grocery is ${otp}`,
      //   from: process.env.TWILIO_PHONE_NUMBER,
      //   to: `+91${phone_number}`,
      // });
      // console.log(twilioResponse);

      // update user with otp details
      await this.userRepository.update(
        {
          id: userData.id,
        },
        {
          user_otp_id: userOtpResponse.id,
        },
      );

      return {
        status: HttpStatus.OK,
        message: `Otp send successfully to ${phone_number}`,
        otp: `${otp}. PS - using twilio to send sms, but free trail doesnt work on every number hence sending otp in response body for further processing`,
      };
    } catch (error) {
      throw new HttpException(error, error.status);
    }
  }
  async verifyOtp(body: IVerifyOtp) {
    try {
      const { phone_number, otp } = body;
      const userData: UserModel & {
        user_otp?: UserOtpModel;
      } = await this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndMapOne(
          'user.user_otp',
          UserOtpModel,
          'user_otp',
          'user_otp.id = user.user_otp_id',
        )
        .where('user.phone_number = :phoneNumber', {
          phoneNumber: phone_number,
        })
        .getOne();

      if (!userData.user_otp) {
        throw new HttpException(
          `Otp for user with phone number ${phone_number} not found`,
          StatusCodes.NOT_FOUND,
        );
      }

      // Check for otp expiry
      const otpCreatedTime =
        (Date.now() - userData.user_otp.created_at.getTime()) / 1000;

      if (otpCreatedTime > OTP_EXPIRY_IN_SECONDS) {
        throw new HttpException(`Otp Expired`, StatusCodes.GONE);
      }

      // Check for correct otp
      if (userData.user_otp.otp !== otp) {
        throw new HttpException('Incorrect otp', StatusCodes.BAD_REQUEST);
      }

      // update user details
      await this.userRepository.update(
        {
          id: userData.id,
        },
        {
          is_active: true,
          user_otp_id: null,
          updated_at: new Date(),
        },
      );

      // Generate Access Token
      const accessToken = await generateAccessToken(this.jwtService, {
        id: userData.id,
        role: userData.role_id,
        phone_number,
      });

      // delete otp from user_otp table
      await this.userOtpRepository.delete({
        id: userData.user_otp.id,
      });

      return {
        status: StatusCodes.OK,
        access_token: accessToken,
        token_type: 'bearer',
      };
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  }
}
