export class UpdateChatDto {
  readonly admin?: {
    userId: string,
  };
  readonly chatName?: {
    name: string,
    tgLink: string,
  };
  readonly removed?: boolean;
}
