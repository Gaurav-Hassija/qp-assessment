import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ISendOtp, IVerifyOtp } from 'src/core/interfaces/request-body';
import {
  sendPhoneOtpValidator,
  verifyPhoneOtpValidator,
} from 'src/core/validators';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('send-otp')
  async sendOtp(@Res() res: Response, @Body() body: ISendOtp) {
    await sendPhoneOtpValidator(body);
    const response = await this.authService.sendOtp(body);
    return res.status(StatusCodes.OK).send(response);
  }

  @Post('verify-otp')
  async verifyOtp(@Res() res: Response, @Body() body: IVerifyOtp) {
    await verifyPhoneOtpValidator(body);
    const response = await this.authService.verifyOtp(body);
    return res.status(StatusCodes.OK).send(response);
  }
}
