export class CreateChatDto {
  readonly chatId: string;
  readonly chatName: {
    name: string,
    tgLink: string,
  };
  readonly admin: {
    userId: string,
  };
}
