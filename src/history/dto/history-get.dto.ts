export class GetHistoryDto {
  readonly userId: string;
  readonly userName: string;
  readonly userTgName: string;
  readonly adminId: string;
  readonly adminName: string;
  readonly adminTgName: string;
  readonly id: string;
  readonly service: string;
  readonly event: string;
  readonly removed: boolean;
  readonly created: Date;
  readonly updated: Date;
}
