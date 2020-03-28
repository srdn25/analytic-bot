import {Injectable} from '@nestjs/common';
import {Ban, GetAllQuery, IBanVote} from './interfaces/ban.interface';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {database, errorList} from '../constants';
import {CreateBanDto} from './dto/ban-create.dto';
import {CustomError} from '@components/CustomError';
import * as _ from 'lodash';
import helper from '@components/helper';

@Injectable()
export class BanService {
  constructor(
    @InjectModel(database.modelName.ban) private readonly banModel: Model<Ban>,
  ) {}

  async findAll(query: GetAllQuery): Promise<{ result: Ban[], count: number }> {
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

    const resultFromMongo = await this.banModel.aggregate(find);

    // clearify result
    const { result, info: [{ count } = { count: 0 }] } = resultFromMongo[0];
    return {
      result: result.map(el => {
        return _.omit(el, ...excludeFields);
      }),
      count,
    };
  }

  async vote(data: IBanVote): Promise<Ban> {
    const { id, vote } = data;
    return await this.banModel.findOneAndUpdate({
      _id: id,
      removed: false,
    }, {
      $inc: { rate: vote === 'up' ? 1 : -1 },
    }, { new: true });
  }

  async create(ban: CreateBanDto): Promise<Ban> {
    const newBan = new this.banModel(ban);
    return await newBan.save();
  }

  async delete(id: string): Promise<Ban> {
    return await this.banModel.findByIdAndUpdate(id, { removed: true, active: false }, { new: true });
  }
}
