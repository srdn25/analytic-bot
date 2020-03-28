import {IGetAllQuery, ITagApprove} from '../interfaces/tag.interface';

// tslint:disable-next-line
const Validator = require('fastest-validator');
import {CustomError} from '@components/CustomError';
import {CreateTagDto} from '../dto/tag-create.dto';
import {UpdateTagDto} from '../dto/tag-update.dto';
import {errorList, validatorSchema} from '../../constants';
import {RemoveTagDto} from '../dto/tag-remove.dto';
import {HttpStatus} from '@nestjs/common';

const validator = new Validator();

const getSortPattern = '^((' +
  'authorId|authorName|authorTgName|adminId|adminName|adminTgName|chatId|approve' +
  '):(asc|desc)(,\s?)?)*$';

const schemaGet = validatorSchema.getList(getSortPattern);

const schemaCreate = {
  authorId: { type: 'string', min: 3, max: 150 },
  authorName: { type: 'string', min: 3, max: 150 },
  authorTgName: { type: 'string', min: 3, max: 150 },
  adminId: { type: 'string', min: 3, max: 150 },
  adminName: { type: 'string', min: 3, max: 150 },
  adminTgName: { type: 'string', min: 3, max: 150 },
  chatId: { type: 'string', min: 3, max: 150 },
  text: { type: 'string', min: 3, max: 500 },
  tagList: { type: 'array', min: 1, items: { type: 'string', min: 2, max: 170 } },
  $$strict: true,
};

const schemaUpdate = {
  approve: { type: 'boolean', optional: true, convert: true },
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

const schemaCheckBotToken = {
  'bot-secret-token': { type: 'string' },
};

const allowedKeys = [
  'authorId',
  'authorName',
  'authorTgName',
  'adminId',
  'adminName',
  'adminTgName',
  'chatId',
  'text',
  'tagList',
  'approve',
  'removed',
  'created',
  'updated',
];

export class TagValidator {
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

  create(data): CreateTagDto {
    return this.main(schemaCreate, data);
  }

  approve(data): ITagApprove {
    return this.main(schemaRemove, data);
  }

  update(data): UpdateTagDto {
    return this.main(schemaUpdate, data);
  }

  remove(data): RemoveTagDto {
    return this.main(schemaRemove, data);
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

}
