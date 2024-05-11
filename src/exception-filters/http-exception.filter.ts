import { Request, Response } from 'express';
import {
  Catch,
  ArgumentsHost,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ResponseError } from 'src/types/error.type';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus() || HttpStatus.BAD_REQUEST;

    this.logger.error(`${request.path} ${status}: ${exception.message}}`);

    const errorResponse = exception.getResponse();

    let responsePayload: ResponseError = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: '',
    };

    if (typeof errorResponse === 'string') {
      responsePayload.message = exception.message;
    } else {
      responsePayload = { ...responsePayload, ...errorResponse };
    }
    response.status(status).json(responsePayload);
  }
}
