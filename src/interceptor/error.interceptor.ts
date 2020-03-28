import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler, HttpException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import {catchError} from 'rxjs/operators';

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next
      .handle()
      .pipe(
        catchError(err => {
          const { message, code = 0 } = err;
          return throwError(new HttpException({message, code}, err.status));
        }),
      );
  }
}
