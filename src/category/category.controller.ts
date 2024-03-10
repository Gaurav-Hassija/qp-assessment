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
import { ICreateCategory } from 'src/core/interfaces/request-body';
import { createCategoryValidator } from 'src/core/validators';
import { CategoryService } from './category.service';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('')
  @UseGuards(JwtAuthGuard)
  async createCategory(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: ICreateCategory,
  ) {
    await createCategoryValidator(body);
    const response = await this.categoryService.createCategory(
      body,
      req.user_data,
    );
    return res.status(StatusCodes.OK).send(response);
  }

  @Get('')
  @UseGuards(JwtAuthGuard)
  async getAllCategory(@Req() req: Request, @Res() res: Response) {
    const response = await this.categoryService.getAllCategory();
    return res.status(StatusCodes.OK).send(response);
  }
}
