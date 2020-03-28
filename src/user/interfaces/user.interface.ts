import {CreateUserDto} from '../dto/user-create.dto';
import {UpdateUserDto} from '../dto/user-update.dto';

export interface IUser {
  _id: string;
  readonly userId: string;
  readonly password: string;
  readonly userName: Array<{
    first: string,
    last: string,
    date: Date,
  }>;
  readonly userTgName: Array<{
    name: string,
    date: Date,
  }>;
  readonly chatList: Array<{
    id: string,
    name: string,
    date: Date,
  }>;
  readonly phone: Array<{
    number: string,
    date: Date,
  }>;
  readonly prevActive: string;
  removed: boolean;
  created: Date;
  updated: Date;
}

export interface IGetAllQuery {
  sort: string;
  filter: string;
  page: number;
  size: number;
}

export interface IUserValidator {
  create: CreateUserDto;
  update: UpdateUserDto;
}

export interface ICreatePassword {
  userId: string;
  password: string;
}

export interface IToken {
  readonly token: string;
  readonly exp: number;
}
