export class CheckTokenUserDto {
  readonly userId: string;
  readonly id: string;
  readonly iat: number;
  readonly exp: number;
}
