export class GetChatDto {
  readonly chatId: string;
  readonly chatNameList: Array<{
    tgLink: string,
    name: string,
    date: Date,
  }>;
  readonly adminList: Array<{
    userId: string,
    date: Date,
  }>;
  readonly removed: boolean;
  readonly created: Date;
  readonly updated: Date;
}
