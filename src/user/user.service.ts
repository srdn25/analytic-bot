import { randomBytes } from 'crypto';
import { hashSync, compareSync } from 'bcrypt';
import {sign, verify} from 'jsonwebtoken';
import {Injectable} from '@nestjs/common';
import {IUser, IGetAllQuery, ICreatePassword, IToken} from './interfaces/user.interface';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {database, errorList} from '../constants';
import {CreateUserDto} from './dto/user-create.dto';
import * as _ from 'lodash';
import {UpdateUserDto} from './dto/user-update.dto';
import {CreateUserDateDto} from './dto/user-create-date.dto';
import helper from '@components/helper';
import {CustomError} from '@components/CustomError';
import {CheckTokenUserDto} from './dto/user-checkToken.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(database.modelName.user) private readonly userModel: Model<IUser>,
  ) {}

  private addDataTime(data: CreateUserDto|UpdateUserDto|object) {
    return Object.entries(data).reduce((acc, [ key, value ]) => {
      if (/userName|userTgName|chatList|phone|chat/.test(key)) {
        acc[key] = { ...value, date: Date.now() };
      } else {
        acc[key] = value;
      }

      return acc;
    }, {});
  }

  private removeDataTime(data: IUser) {
    return Object.entries(data).reduce((acc, [ key, value ]) => {
      if (/userName|userTgName|chatList|phone|chat/.test(key)) {
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

  async findAll(query: IGetAllQuery): Promise<{ result: IUser[], count: number }> {
    const hideRemoved = true;

    const excludeFields = ['__v', 'password'];

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

    const resultFromMongo = await this.userModel.aggregate(find);

    // clearify result
    const { result, info: [{ count } = { count: 0 }] } = resultFromMongo[0];
    return {
      result: result.map(el => {
        return _.omit(el, ...excludeFields);
      }),
      count,
    };
  }

  // tslint:disable-next-line:no-shadowed-variable
  async update({id, data, exist}: { id: string, data: UpdateUserDto, exist: IUser | boolean }): Promise<IUser|string> {

    const differentKeys = {};

    let existObject;

    exist ? existObject = exist :
    existObject = await this.getByTgId({ id: data.userId });

    const existWithoutData = this.removeDataTime(existObject);

    const dataArr = Object.entries(_.omit(data, 'userId'));

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
      return 'User exist, all fields is actual';
    }

    const dataWithDate = this.addDataTime(differentKeys);
    const { prevActive, chat, password } = data;

    let updateData: any = {
      $push: {
        ..._.omit(dataWithDate, 'userId', 'password', 'chat', 'prevActive'),
      },
      prevActive,
    };

    if (password) {
      updateData = { ...updateData, password };
    }

    if (chat) {
      updateData = { ...updateData, $push: { ...updateData.$push, chatList: chat } };
    }

    const user = await this.userModel.findOneAndUpdate({
      _id: id,
      removed: false,
    }, updateData, { new: true });

    delete user.password;

    return user;
  }

  async create(user: CreateUserDto): Promise<IUser|string> {
    const exist = await this.getByTgId({ id: user.userId });

    if (exist) {
      return await this.update({ id: exist._id, data: user, exist });
    }

    // @ts-ignore
    const arrayUser = Object.entries(this.addDataTime(user)).reduce((acc, [ key, value ]) => {
      if (/userId|prevActive/.test(key)) {
        acc[key] = value;
      } else {
        acc[key] = [value];
      }
      return acc;
    }, {});

    const newUser = new this.userModel(arrayUser);
    const userSave = await newUser.save();

    delete userSave.password;
    return userSave;
  }

  async createPassword({ userId }): Promise<ICreatePassword | string> {
    const passwordSource = randomBytes(7).toString('hex');
    const password = hashSync(passwordSource, 10);

    const exist = await this.getByTgId({ id: userId });
    if (exist) {
      await this.update({ id: exist._id, data: {
        userId, password, prevActive: 'generatePassword',
      }, exist });

      return { userId, password: passwordSource };
    }

    return 'User not exist';
  }

  async login({ userId, password }): Promise<IToken> {
    const user = await this.getByTgId({ id: userId });
    const tokenLife = Number(process.env.TOKEN_LIFETIME);

    if (!user) {
      const { code, info: message } = errorList.USER.NOT_FOUND;
      throw new CustomError({ status: 404, message, code });
    }

    if (!compareSync(password, user.password)) {
      const { code, info: message } = errorList.USER.WRONG_PASSWORD;
      throw new CustomError({ status: 403, message, code });
    }

    const token = sign({userId, id: user._id}, process.env.SECRET, {
      expiresIn: tokenLife,
    });

    return { token, exp: Date.now() + (tokenLife * 100) };
  }

  async checkToken({ token }): Promise<CheckTokenUserDto> {
    return verify(token, process.env.SECRET, (err, decoded) => {
      const { code } = errorList.USER.TOKEN_ERROR;

      if (err) { throw new CustomError({
        status: 400, message: err.message, code,
        });
      }

      return decoded;
    });
  }

  async getByTgId({ id }: { id: string }): Promise<IUser> {
    return await this.userModel.findOne({ userId: id }).lean();
  }

  async getById(id): Promise<IUser> {
    return await this.userModel.findById(id);
  }

  async delete(id: string): Promise<IUser> {
    return await this.userModel.findByIdAndUpdate(id, { removed: true }, { new: true });
  }
}
