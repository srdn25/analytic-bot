// tslint:disable-next-line
import {LoginUserDto} from '../dto/user-login.dto';

const Validator = require('fastest-validator');

import {IGetAllQuery} from '../interfaces/user.interface';
import {CustomError} from '@components/CustomError';
import {CreateUserDto} from '../dto/user-create.dto';
import {UpdateUserDto} from '../dto/user-update.dto';
import { errorList, validatorSchema } from '../../constants';
import {RemoveUserDto} from '../dto/user-remove.dto';
import {HttpStatus} from '@nestjs/common';

const validator = new Validator();

const getSortPattern = '^((' +
  'userId|userName|userTgName|chatName|phone' +
  '):(asc|desc)(,\s?)?)*$';

const schemaGet = validatorSchema.getList(getSortPattern);

const schemaCreate = {
  userId: { type: 'string', min: 3, max: 150 },
  userName: { type: 'object', props: {
      first: { type: 'string', max: 150 },
      last: { type: 'string', max: 150, optional: true },
      $$strict: true,
    },
  },
  userTgName: { type: 'object', props: {
      name: { type: 'string', min: 3, max: 150, optional: true },
      $$strict: true,
    },
  },
  chatList: { type: 'object', props: {
      id: { type: 'string', min: 3, max: 150 },
      name: { type: 'string', min: 3, max: 150 },
      $$strict: true,
    },
  },
  phone: { type: 'object', props: {
      number: { type: 'string', min: 1, max: 150 },
      $$strict: true,
    },
  },
  prevActive: { type: 'string', max: 300 },
  $$strict: true,
};

const schemaUpdate = {
  userId: { type: 'string', min: 3, max: 150 },
  userName: { type: 'object', optional: true, props: {
      first: { max: 150 },
      last: { max: 150, optional: true },
      $$strict: true,
    },
  },
  userTgName: { type: 'object', optional: true, props: {
      name: { min: 3, max: 150, optional: true },
      $$strict: true,
    },
  },
  chat: { type: 'object', optional: true, props: {
      id: { min: 3, max: 150 },
      name: { min: 3, max: 150 },
      $$strict: true,
    },
  },
  phone: { type: 'object', optional: true, props: {
      number: { min: 1, max: 150 },
      $$strict: true,
    },
  },
  prevActive: { type: 'string', max: 300 },
  removed: { type: 'boolean', optional: true, convert: true },
  $$strict: true,
};

const schemaRemove = {
  id: { type: 'string' },
  adminId: { type: 'string' },
  adminTgName: { type: 'string' },
  adminName: { type: 'string' },
  $$strict: true,
};

const schemaId = {
  id: { type: 'string' },
};

const schemaLogin = {
  userId: { type: 'string' },
  password: { type: 'string' },
  $$strict: true,
};

const schemaCheckToken = {
  'x-access-token': { type: 'string' },
};

const schemaCheckBotToken = {
  'bot-secret-token': { type: 'string' },
};

const allowedKeys = [
  'userId',
  'userName',
  'userTgName',
  'chatList',
  'phone',
  'prevActive',
  'removed',
  'created',
  'updated',
];

export class UserValidator {
  private main(schema, data) {
    const check = validator.compile(schema);
    const valid = check(data);

    if (valid !== true) {
      throw new CustomError({
        message: validator.validate(data, schema),
        status: 400,
        code: errorList.NOT_VALID.code,
      });
    }

    return data;
  }

  get(data): IGetAllQuery {
    return this.main(schemaGet, data);
  }

  create(data): CreateUserDto {
    return this.main(schemaCreate, data);
  }

  update(data): UpdateUserDto {
    return this.main(schemaUpdate, data);
  }

  login(data): LoginUserDto {
    return this.main(schemaLogin, data);
  }

  checkToken(data) {
    const valid = this.main(schemaCheckToken, data);
    return { token: valid['x-access-token'] };
  }

  checkBotToken(data) {
    if (!(data['bot-secret-token'] === process.env.BOT_TOKEN)) {
      const { code, info: message } = errorList.BOT.TOKEN_ERROR;

      throw new CustomError({
        status: HttpStatus.UNAUTHORIZED,
        code,
        message,
      });
    }

    this.main(schemaCheckBotToken, data);

    return true;
  }

  checkId(data) {
    const valid = this.main(schemaCheckToken, data);
    return { token: valid['x-access-token'] };
  }

  remove(data): RemoveUserDto {
    const result = this.main(schemaRemove, data);
    return result.id;
  }
}
