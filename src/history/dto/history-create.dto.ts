export class CreateHistoryDto {
  readonly userId?: string;
  readonly userName?: string;
  readonly userTgName?: string;
  readonly adminId?: string;
  readonly adminName?: string;
  readonly adminTgName?: string;
  id?: string;
  info?: string;
  readonly service: string;
  readonly event: string;
}
