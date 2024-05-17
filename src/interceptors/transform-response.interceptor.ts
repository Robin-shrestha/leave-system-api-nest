import {
  Injectable,
  CallHandler,
  NestInterceptor,
  ExecutionContext,
  Logger,
} from '@nestjs/common';
import { map } from 'rxjs/operators';

import {
  Response,
  ResultData,
  PaginatedResult,
  PaginatedResponse,
} from 'src/utils';

@Injectable()
export class TransformResponseInterceptor
  implements NestInterceptor<ResultData>
{
  private readonly logger = new Logger(TransformResponseInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler<ResultData>) {
    const now = new Date().toISOString();
    const req = context.switchToHttp().getRequest();

    this.logger.log(
      `Logged on: ${now}, ${req.method} ${req.path || '-'}, ${req.query && JSON.stringify(req.query)}, ${req.body && JSON.stringify(req.body)}`,
    );

    return next.handle().pipe(
      map((data) => {
        const statusCode = context.switchToHttp().getResponse().statusCode;

        if (data instanceof PaginatedResult) {
          return new PaginatedResponse(data.data, data.pagination, statusCode);
        }
        return new Response(data, statusCode);
      }),
    );
  }
}
