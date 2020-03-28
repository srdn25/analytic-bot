import {GetAllQuery} from '../interfaces/ban.interface';

// tslint:disable-next-line
const Validator = require('fastest-validator');
import {CustomError} from '@components/CustomError';
import {CreateBanDto} from '../dto/ban-create.dto';
import {UpdateBanDto} from '../dto/ban-update.dto';
import {VoteBanDto} from '../dto/ban-vote.dto';
import {errorList, validatorSchema} from '../../constants';
import {RemoveBanDto} from '../dto/ban-remove.dto';

const validator = new Validator();

const getSortPattern = '^((' +
  'userId|userName|userTgName|adminId|adminName|adminTgName|chatId|duration' +
  '):(asc|desc)(,\s?)?)*$';

const schemaGet = validatorSchema.getList(getSortPattern);

const schemaCreate = {
  userId: { type: 'string', min: 3, max: 150 },
  userName: { type: 'string', min: 3, max: 150 },
  userTgName: { type: 'string', min: 3, max: 150 },
  adminId: { type: 'string', min: 3, max: 150 },
  adminName: { type: 'string', min: 3, max: 150 },
  adminTgName: { type: 'string', min: 3, max: 150 },
  chatId: { type: 'string', min: 3, max: 150 },
  reason: { type: 'string', min: 3, max: 500 },
  duration: { type: 'string', min: 2, max: 170 },
  restrictedMsg: { type: 'string', min: 3, max: 1500 },
  $$strict: true,
};

const schemaUpdate = {
  active: { type: 'boolean', optional: true, convert: true },
  removed: { type: 'boolean', optional: true, convert: true },
  $$strict: true,
};

const schemaVote = {
  id: { type: 'string' },
  vote: { type: 'string', pattern: '^(up|down)$' },
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
  'chatId',
  'reason',
  'duration',
  'restrictedMsg',
  'active',
  'removed',
  'created',
  'updated',
  'rate',
];

export class BanValidator {
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

  get(data): GetAllQuery {
    return this.main(schemaGet, data);
  }

  create(data): CreateBanDto {
    return this.main(schemaCreate, data);
  }

  update(data): UpdateBanDto {
    return this.main(schemaUpdate, data);
  }

  vote(data): VoteBanDto {
    return this.main(schemaVote, data);
  }

  remove(data): RemoveBanDto {
    const result = this.main(schemaRemove, data);
    return result.id;
  }
}
