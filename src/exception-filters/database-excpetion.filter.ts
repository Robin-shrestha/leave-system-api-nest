import { Request, Response } from 'express';
import {
  Catch,
  ArgumentsHost,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { TypeORMError, EntityNotFoundError } from 'typeorm';
import { ResponseError } from 'src/types/error.type';

@Catch(TypeORMError)
export class DatabaseExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(DatabaseExceptionFilter.name);

  catch(exception: TypeORMError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    this.logger.error(`${exception.name}: ${exception.message}`);

    const errorPayload: ResponseError = {
      statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      message: exception.message,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    if (exception instanceof EntityNotFoundError) {
      errorPayload.message = 'Record Not Found';
    }

    response.status(HttpStatus.UNPROCESSABLE_ENTITY).json(errorPayload);
  }
}
