import {Injectable} from '@nestjs/common';
import * as _ from 'lodash';

import {IHistory, IGetAllQuery} from './interfaces/history.interface';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {database} from '../constants';
import {CreateHistoryDto} from './dto/history-create.dto';
import helper from '@components/helper';

@Injectable()
export class HistoryService {
  constructor(
    @InjectModel(database.modelName.history) private readonly historyModel: Model<IHistory>,
  ) {}

  async findAll(query: IGetAllQuery): Promise<{ result: IHistory[], count: number }> {
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

    const resultFromMongo = await this.historyModel.aggregate(find);

    // clearify result
    const { result, info: [{ count } = { count: 0 }] } = resultFromMongo[0];
    return {
      result: result.map(el => {
        return _.omit(el, ...excludeFields);
      }),
      count,
    };
  }

  async findBanVoteByUserAndBan(userId, id: string): Promise<IHistory> {
    return await this.historyModel.findOne({
      id,
      service: database.modelName.ban,
      event: 'vote',
      userId,
    });
  }

  async create(history: CreateHistoryDto): Promise<IHistory> {
    const newHistory = new this.historyModel(history);
    return await newHistory.save();
  }

  async delete(id: string): Promise<IHistory> {
    return await this.historyModel.findByIdAndUpdate(id, { removed: true }, { new: true });
  }
}
