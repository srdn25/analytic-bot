export class CreateBanDto {
  readonly userId: string;
  readonly userName: string;
  readonly userTgName: string;
  readonly adminId: string;
  readonly adminName: string;
  readonly adminTgName: string;
  readonly chatId: string;
  readonly reason: string;
  readonly duration: string;
  readonly restrictedMsg: string;
}
