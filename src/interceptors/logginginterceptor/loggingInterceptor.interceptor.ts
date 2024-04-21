import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    console.log('logged on...', context.switchToHttp().getRequest().path);

    return next.handle().pipe(
      tap(() => {
        console.log(`timeTaken: ${Date.now() - now}ms`);
      }),
    );
  }
}
