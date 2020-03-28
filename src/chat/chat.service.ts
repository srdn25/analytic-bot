import {Injectable} from '@nestjs/common';
import {IChat, IGetAllQuery} from './interfaces/chat.interface';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {database} from '../constants';
import {CreateChatDto} from './dto/chat-create.dto';
import * as _ from 'lodash';
import helper from '@components/helper';
import {UpdateChatDto} from './dto/chat-update.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(database.modelName.chat) private readonly chatModel: Model<IChat>,
  ) {}

  private addDataTime(data: CreateChatDto|UpdateChatDto|object) {
    return Object.entries(data).reduce((acc, [ key, value ]) => {
      if (/adminList|chatNameList/.test(key)) {
        acc[key] = { ...value, date: Date.now() };
      } else {
        acc[key] = value;
      }

      return acc;
    }, {});
  }

  private removeDataTime(data: IChat) {
    return Object.entries(data).reduce((acc, [ key, value ]) => {
      if (/adminList|chatNameList/.test(key)) {
        acc[key] = value.map(el => {
          delete el.date;
          delete el._id;
          return el;
        });
      } else {
        acc[key] = value;
      }

      return acc;
    }, {});
  }

  async findAll(query: IGetAllQuery): Promise<{ result: IChat[], count: number }> {
    const hideRemoved = true;

    const excludeFields = ['__v'];

    const sort = helper.sortStringToObject(query.sort);
    const { filter, page = 1, size = 5 } = query;

    const find: any = [
      {
        $facet: {
          result: [
            { $sort: sort },
            { $skip: (Number(page) - 1) * Number(size) },
            { $limit: Number(size) },
          ],
          info: [
            {
              $group: {
                _id: null,
                count: { $sum: 1 },
              },
            },
          ],
        },
      },
    ];

    if (hideRemoved) {
      excludeFields.push('removed');
      find.unshift(
        { $match: { removed: false } },
      );
    }

    if (filter) {
      find.unshift({ $match: {
        $text: {
          $search: filter,
          $caseSensitive: false,
        },
      }});
    }

    const resultFromMongo = await this.chatModel.aggregate(find);

    // clearify result
    const { result, info: [{ count } = { count: 0 }] } = resultFromMongo[0];
    return {
      result: result.map(el => {
        return _.omit(el, ...excludeFields);
      }),
      count,
    };
  }

  async update({chatId, data, exist}: { chatId: string, data: UpdateChatDto, exist: IChat | boolean }): Promise<IChat|string> {

    const differentKeys = {};

    let existObject;

    exist ? existObject = exist :
      existObject = await this.getByTgId({ chatId });

    const existWithoutData = this.removeDataTime(existObject);

    const dataArr = Object.entries(_.omit(data, 'chatId'));

    for ( const elFromNewData of dataArr) {
      let found = false;
      const [ key, value ] = elFromNewData;
      const databaseKeyArr = existWithoutData[key];

      for (const elFromMongo of databaseKeyArr) {
        const equalKey = _.isEqual(elFromMongo, data[key]);
        if (equalKey) {
          found = true;
          break;
        }
      }

      if (!found) {
        differentKeys[key] = data[key];
      }
    }

    if (!Object.keys(differentKeys).length) {
      return 'Chat exist, all fields is actual';
    }

    const dataWithDate = this.addDataTime(differentKeys);

    const updateData: any = {
      $push: {
        ..._.omit(dataWithDate, 'chatId'),
      },
    };

    const chat = await this.chatModel.findOneAndUpdate({
      chatId,
      removed: false,
    }, updateData, { new: true });

    return chat;
  }

  async getByTgId({ chatId }: { chatId: string }): Promise<IChat> {
    return await this.chatModel.findOne({ chatId }).lean();
  }

  async create(chat: CreateChatDto): Promise<IChat | string> {
    const { chatId } = chat;
    const exist = await this.getByTgId({ chatId });

    if (exist) {
      return await this.update({ chatId: exist.chatId, data: chat, exist });
    }

    // @ts-ignore
    const arrayChat = Object.entries(this.addDataTime(chat)).reduce((acc, [ key, value ]) => {
      if (/chatId/.test(key)) {
        acc[key] = value;
      } else {
        acc[key] = [value];
      }
      return acc;
    }, {});

    const chatNew = new this.chatModel(arrayChat);
    const chatSave = await chatNew.save();

    return chatSave;
  }

  async delete(id: string): Promise<IChat> {
    return await this.chatModel.findByIdAndUpdate(id, { removed: true }, { new: true });
  }
}
