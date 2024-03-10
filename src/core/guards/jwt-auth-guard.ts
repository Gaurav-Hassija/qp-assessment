import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { StatusCodes } from 'http-status-codes';
import { IAccessTokenPayload } from '../interfaces/index';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    // Get the JWT token from the request headers
    const token = request.headers.authorization?.split(' ')[1];
    if (token) {
      try {
        const authTokenSecret = process.env.ACCESS_TOKEN_SECRET;
        if (!authTokenSecret) {
          throw new HttpException(
            'Internal server error',
            StatusCodes.INTERNAL_SERVER_ERROR,
          );
        }

        const decodedPayload: IAccessTokenPayload = this.jwtService.verify(
          token,
          { secret: authTokenSecret },
        );
        if (!decodedPayload.id) {
          throw new HttpException(
            'Incomplete/malformed token, please re-login',
            StatusCodes.UNAUTHORIZED,
          );
        }
        request.user_data = decodedPayload;
        return true;
      } catch (error) {
        throw new HttpException('Unauthorized', StatusCodes.UNAUTHORIZED);
      }
    }

    throw new HttpException('Unauthorized', StatusCodes.UNAUTHORIZED);
  }
}
