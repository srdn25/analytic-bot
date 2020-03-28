export class CreateUserDto {
  readonly userId: string;
  readonly userName: {
    first: string,
    last: string,
  };
  readonly userTgName: {
    name: string,
  };
  readonly chatList: {
    id: string,
    name: string,
  };
  readonly phone: {
    number: string,
  };
  readonly prevActive: string;
}
