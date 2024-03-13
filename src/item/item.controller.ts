import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { JwtAuthGuard } from 'src/core/guards/jwt-auth-guard';
import {
  IAddItem,
  IDeleteItem,
  IUpdateItem,
} from 'src/core/interfaces/request-body';
import {
  addItemValidator,
  deleteItemValidator,
  updateItemValidator,
} from 'src/core/validators';
import { ItemService } from './item.service';

@Controller('item')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Post('')
  @UseGuards(JwtAuthGuard)
  async addItems(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: IAddItem,
  ) {
    await addItemValidator(body);
    const response = await this.itemService.addItem(body, req.user_data);
    return res.status(StatusCodes.OK).send(response);
  }

  @Get('')
  @UseGuards(JwtAuthGuard)
  async getAllItems(@Req() req: Request, @Res() res: Response) {
    const response = await this.itemService.getAllItems(req.user_data);
    return res.status(StatusCodes.OK).send(response);
  }

  @Delete('')
  @UseGuards(JwtAuthGuard)
  async deleteItem(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: IDeleteItem,
  ) {
    await deleteItemValidator(body);
    const response = await this.itemService.deleteItem(body, req.user_data);
    return res.status(StatusCodes.OK).send(response);
  }

  @Patch('')
  @UseGuards(JwtAuthGuard)
  async updateItem(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: IUpdateItem,
  ) {
    await updateItemValidator(body);
    const response = await this.itemService.updateItem(body, req.user_data);
    return res.status(StatusCodes.OK).send(response);
  }
}
