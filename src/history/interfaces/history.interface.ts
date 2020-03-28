import {CreateHistoryDto} from '../dto/history-create.dto';
import {UpdateHistoryDto} from '../dto/history-update.dto';

export interface IHistory {
  _id: string;
  userId: string;
  userName: string;
  userTgName: string;
  adminId: string;
  adminName: string;
  adminTgName: string;
  service: string;
  id: string;
  event: string;
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

export interface IHistoryValidator {
  create: CreateHistoryDto;
  update: UpdateHistoryDto;
}
