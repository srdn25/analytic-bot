export class CreateTagDto {
  readonly authorId: string;
  readonly authorName: string;
  readonly authorTgName: string;
  readonly adminId: string;
  readonly adminName: string;
  readonly adminTgName: string;
  readonly chatId: string;
  readonly text: string;
  readonly tagList: string[];
}
