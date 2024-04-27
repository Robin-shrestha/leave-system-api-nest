import { Request, Response } from 'express';
import {
  Catch,
  ArgumentsHost,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ResponseError } from 'src/types/error.type';

@Catch()
export class DefaultExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(DefaultExceptionFilter.name);
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    this.logger.log(`${exception.message}`);

    const responsePayload: ResponseError = {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception.message || ' Internal Server Errororro',
    };

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(responsePayload);
  }
}
