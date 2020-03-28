export class GetUserDto {
  readonly userId: string;
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
  readonly removed: boolean;
  readonly created: Date;
  readonly updated: Date;
}
