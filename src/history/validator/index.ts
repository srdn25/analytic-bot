import {IGetAllQuery} from '../interfaces/history.interface';

// tslint:disable-next-line
const Validator = require('fastest-validator');
import {CustomError} from '@components/CustomError';
import {CreateHistoryDto} from '../dto/history-create.dto';
import {UpdateHistoryDto} from '../dto/history-update.dto';
import {errorList, validatorSchema} from '../../constants';
import {RemoveHistoryDto} from '../dto/history-remove.dto';

const validator = new Validator();

const getSortPattern = '^((' +
  'userId|userName|userTgName|adminId|adminName|adminTgName|service|event' +
  '):(asc|desc)(,\s?)?)*$';

const schemaGet = validatorSchema.getList(getSortPattern);

const schemaCreate = {
  userId: { type: 'string', min: 3, max: 150 },
  userName: { type: 'string', min: 3, max: 150 },
  userTgName: { type: 'string', min: 3, max: 150 },
  adminId: { type: 'string', min: 3, max: 150 },
  adminName: { type: 'string', min: 3, max: 150 },
  adminTgName: { type: 'string', min: 3, max: 150 },
  id: { type: 'string', min: 3, max: 150 },
  service: { type: 'string', min: 3, max: 500 },
  event: { type: 'string', min: 1, max: 50 },
  info: { type: 'string', max: 300 },
  $$strict: true,
};

const schemaUpdate = {
  removed: { type: 'boolean', optional: true, convert: true },
  $$strict: true,
};

const schemaRemove = {
  id: { type: 'string' },
  $$strict: true,
};

const allowedKeys = [
  'userId',
  'userName',
  'userTgName',
  'adminId',
  'adminName',
  'adminTgName',
  'id',
  'service',
  'event',
  'removed',
  'created',
  'updated',
];

export class HistoryValidator {
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

  create(data): CreateHistoryDto {
    return this.main(schemaCreate, data);
  }

  update(data): UpdateHistoryDto {
    return this.main(schemaUpdate, data);
  }

  remove(data): RemoveHistoryDto {
    const result = this.main(schemaRemove, data);
    return result.id;
  }
}
