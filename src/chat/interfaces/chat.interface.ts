export interface IChat {
  _id: string;
  chatId: string;
  readonly chatNameList: Array<{
    tgLink: string,
    name: string,
    date: Date,
  }>;
  readonly adminList: Array<{
    userId: string,
    date: Date,
  }>;
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
