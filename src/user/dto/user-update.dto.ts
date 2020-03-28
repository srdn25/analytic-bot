export class UpdateUserDto {
  readonly userId: string;
  readonly userName?: {
    first: string,
    last: string,
  };
  readonly userTgName?: {
    name: string,
  };
  readonly chat?: {
    id: string,
    name: string,
  };
  readonly phone?: {
    number: string,
  };
  readonly password?: string;
  readonly prevActive: string;
  readonly removed?: boolean;
}
