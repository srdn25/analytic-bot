import {CheckTokenUserDto} from '../user/dto/user-checkToken.dto';
import {errorList} from '@constants/index';
import {HttpException} from '@nestjs/common';
import { verify } from 'jsonwebtoken';

export default {
  sortStringToObject: (source) => {
    let obj = {};
    const arr = source ? source.split(',') : [];

    if (arr.length) {
      obj = arr.reduce((acc, e) => {
        const [field, direction] = e.trim().split(':');
        acc[field] = direction === 'asc' ? 1 : -1;
        return acc;
      }, {});
    } else {
      obj = { created: -1 };
    }

    return obj;
  },

  decode: (token): CheckTokenUserDto => {

    return verify(token, process.env.SECRET, (err, decoded) => {
      const { code } = errorList.USER.TOKEN_ERROR;

      if (err) {
        throw new HttpException({message: err.message, code}, err.status);
      }

      return decoded;

    });
  },

};
