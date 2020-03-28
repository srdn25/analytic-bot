import {CreateBanDto} from '../dto/ban-create.dto';
import {UpdateBanDto} from '../dto/ban-update.dto';
import {VoteBanDto} from '../dto/ban-vote.dto';

export interface Ban {
  _id: string;
  userId: string;
  userName: string;
  userTgName: string;
  adminId: string;
  adminName: string;
  adminTgName: string;
  chatId: string;
  reason: string;
  duration: string;
  restrictedMsg: string;
  active: boolean;
  removed: boolean;
  created: Date;
  updated: Date;
  rate: number;
}

export interface GetAllQuery {
  sort: string;
  filter: string;
  page: number;
  size: number;
}

export interface IBanVote {
  id: string;
  vote: string;
}

export interface IBanValidator {
  create: CreateBanDto;
  update: UpdateBanDto;
  vote: VoteBanDto;
}
