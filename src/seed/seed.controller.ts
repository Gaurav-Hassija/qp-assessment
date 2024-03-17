import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { SeedService } from './seed.service';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get('role')
  async seedRole(@Res() res: Response) {
    const response = await this.seedService.seedRole();
    return res.status(StatusCodes.CREATED).send(response);
  }
  @Get('admin')
  async seedAdmin(@Res() res: Response) {
    const response = await this.seedService.seedAdmin();
    return res.status(StatusCodes.CREATED).send(response);
  }
}
