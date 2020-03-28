import {IGetAllQuery} from '../interfaces/chat.interface';

// tslint:disable-next-line
const Validator = require('fastest-validator');
import {CustomError} from '@components/CustomError';
import {CreateChatDto} from '../dto/chat-create.dto';
import {UpdateChatDto} from '../dto/chat-update.dto';
import {errorList, validatorSchema} from '../../constants';
import {RemoveChatDto} from '../dto/chat-remove.dto';
import {HttpStatus} from '@nestjs/common';

const validator = new Validator();

const getSortPattern = '^((' +
  'chatId' +
  '):(asc|desc)(,\s?)?)*$';

const schemaGet = validatorSchema.getList(getSortPattern);

const schemaCreate = {
  chatId: { type: 'string', min: 3, max: 150 },
  chatNameList: { type: 'object', props: {
      tgLink: { type: 'string', max: 150 },
      name: { type: 'string', max: 150, optional: true },
      $$strict: true,
    },
  },
  adminList: { type: 'object', props: {
      userId: { type: 'string', max: 150 },
      $$strict: true,
    },
  },
};

const schemaUpdate = {
  chatName: { type: 'object', optional: true, props: {
      tgLink: { type: 'string', max: 150 },
      name: { type: 'string', max: 150, optional: true },
      $$strict: true,
    },
  },
  admin: { type: 'object', optional: true, props: {
      userId: { type: 'string', max: 150 },
      $$strict: true,
    },
  },
  removed: { type: 'boolean', optional: true, convert: true },
  $$strict: true,
};

const schemaRemove = {
  id: { type: 'string' },
  $$strict: true,
};

const schemaCheckBotToken = {
  'bot-secret-token': { type: 'string' },
};

const allowedKeys = [
  'chatId',
  'admin',
  'chatName',
  'removed',
  'created',
  'updated',
];

export class ChatValidator {
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

  create(data): CreateChatDto {
    return this.main(schemaCreate, data);
  }

  update(data): UpdateChatDto {
    return this.main(schemaUpdate, data);
  }

  remove(data): RemoveChatDto {
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
