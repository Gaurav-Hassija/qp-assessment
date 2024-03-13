import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { JwtAuthGuard } from 'src/core/guards/jwt-auth-guard';
import { ICreateOrder } from 'src/core/interfaces/request-body';
import { createOrderValidator } from 'src/core/validators';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly itemService: OrderService) {}

  @Post('')
  @UseGuards(JwtAuthGuard)
  async createOrder(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: ICreateOrder,
  ) {
    await createOrderValidator(body);
    const response = await this.itemService.createOrder(body, req.user_data);
    return res.status(StatusCodes.OK).send(response);
  }

  @Get('')
  @UseGuards(JwtAuthGuard)
  async getOrders(@Req() req: Request, @Res() res: Response) {
    const response = await this.itemService.getOrders(req.user_data);
    return res.status(StatusCodes.OK).send(response);
  }
}
