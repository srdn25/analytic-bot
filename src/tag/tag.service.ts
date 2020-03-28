import {Injectable} from '@nestjs/common';
import {ITag, IGetAllQuery, ITagApprove} from './interfaces/tag.interface';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {database} from '../constants';
import {CreateTagDto} from './dto/tag-create.dto';
import * as _ from 'lodash';
import helper from '@components/helper';

@Injectable()
export class TagService {
  constructor(
    @InjectModel(database.modelName.tag) private readonly tagModel: Model<ITag>,
  ) {}

  async findAll(query: IGetAllQuery): Promise<{ result: ITag[], count: number }> {
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

    const resultFromMongo = await this.tagModel.aggregate(find);

    // clearify result
    const { result, info: [{ count } = { count: 0 }] } = resultFromMongo[0];
    return {
      result: result.map(el => {
        return _.omit(el, ...excludeFields);
      }),
      count,
    };
  }

  async approve(data: ITagApprove): Promise<ITag> {
    const { id } = data;
    return await this.tagModel.findOneAndUpdate({
      _id: id,
      removed: false,
      approve: false,
    }, {
      approve: true,
    }, { new: true });
  }

  async create(tag: CreateTagDto): Promise<ITag> {
    const newTag = new this.tagModel(tag);
    return await newTag.save();
  }

  async delete(id: string): Promise<ITag> {
    return await this.tagModel.findByIdAndUpdate(id, { removed: true }, { new: true });
  }
}
