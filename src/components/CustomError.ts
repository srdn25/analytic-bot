interface ICustomError {
  message: any;
  status: number;
  code: number;
}

export class CustomError extends Error {
  public code: number;
  public status: number;
  // @ts-ignore
  public message: any;

  constructor({ message, status, code }: ICustomError, ...args) {
    super(...args);
    this.message = message || 'Unknown error';
    this.status = status;
    this.code = code || 0;
  }
}
