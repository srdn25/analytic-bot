export class CreateUserDateDto {
  readonly userId: string;
  readonly userName: {
    first: string,
    last: string,
    date: Date,
  };
  readonly userTgName: {
    name: string,
    date: Date,
  };
  readonly chatList: {
    id: string,
    name: string,
    date: Date,
  };
  readonly phone: {
    number: string,
    date: Date,
  };
  readonly prevActive: string;
}
