import {CreateTagDto} from '../dto/tag-create.dto';
import {UpdateTagDto} from '../dto/tag-update.dto';

export interface ITag {
  _id: string;
  authorId: string;
  authorName: string;
  authorTgName: string;
  adminId: string;
  adminName: string;
  adminTgName: string;
  chatId: string;
  text: string;
  tagList: string[];
  approve: boolean;
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

export interface ITagApprove {
  id: string;
  adminId: string;
  adminName: string;
  adminTgName: string;
}

export interface ITagValidator {
  create: CreateTagDto;
  update: UpdateTagDto;
}
