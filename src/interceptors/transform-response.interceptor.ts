import {
  Injectable,
  CallHandler,
  NestInterceptor,
  ExecutionContext,
  Logger,
} from '@nestjs/common';
import { map } from 'rxjs/operators';

import { ResponseData, Response } from 'src/utils/Response';

@Injectable()
export class TransformResponseInterceptor
  implements NestInterceptor<ResponseData>
{
  private readonly logger = new Logger(TransformResponseInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler<ResponseData>) {
    const now = new Date().toISOString();
    const req = context.switchToHttp().getRequest();
    this.logger.log(
      `Logged on: ${now}, ${req.method} ${req.path || '-'}, ${req.query && JSON.stringify(req.query)}, ${req.body && JSON.stringify(req.body)}`,
    );

    return next.handle().pipe(
      map((data) => {
        const statusCode = context.switchToHttp().getResponse().statusCode;

        return new Response(data, statusCode);
      }),
    );
  }
}
