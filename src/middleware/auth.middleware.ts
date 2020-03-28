import {NestMiddleware, HttpStatus, Injectable, Inject, HttpException} from '@nestjs/common';
import {UserService} from '../user/user.service';
import {Request, Response, NextFunction} from 'express';
import {errorList} from '@constants/index';
import helper from '@components/helper';
import {IUser} from '../user/interfaces/user.interface';

declare global {
  namespace Express {
    interface Request {
      user: IUser;
    }
  }
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    @Inject('UserService') private readonly userService: UserService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers[process.env.HEADER_TOKEN];

    if (token && (typeof token === 'string')) {
      const decoded = helper.decode(token);

      const user = await this.userService.getById(decoded.id);

      if (!user) {
        throw new HttpException({
          message: 'User not found',
          code: errorList.USER.NOT_FOUND.code,
        }, HttpStatus.UNAUTHORIZED);
      }

      req.user = user;

      next();
    } else {
      throw new HttpException({
        message: 'Not authorized',
        code: errorList.USER.NOT_FOUND.code,
      }, HttpStatus.FORBIDDEN);
    }
  }
}
