import { IAccessTokenPayload } from '.';

export {};
declare global {
  namespace Express {
    export interface Request {
      user_data: IAccessTokenPayload;
    }
  }
}
