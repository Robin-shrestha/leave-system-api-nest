import { Pagination } from './pagination';
import { ApiProperty } from '@nestjs/swagger';

export class Response<T> {
  @ApiProperty({ default: 'response object' })
  data: T;

  @ApiProperty({ default: 'SUCCESS' })
  message: string;

  @ApiProperty({ default: 200 })
  statusCode: number;

  constructor(data: T, statusCode: number, message?: string) {
    this.data = data;
    this.statusCode = statusCode;
    this.message = message || 'SUCCESS';
  }
}

export class PaginatedResponse<T> {
  @ApiProperty({ default: 'response object' })
  data: T;

  @ApiProperty({ default: 'SUCCESS' })
  message: string;

  @ApiProperty({ default: 200 })
  statusCode: number;

  @ApiProperty({ type: Pagination })
  pagination: Pagination;

  constructor(
    data: T,
    pagination: Omit<Pagination, 'hasMore'>,
    statusCode: number,
    message?: string,
  ) {
    this.data = data;
    this.statusCode = statusCode;
    this.message = message || 'SUCCESS';
    if (pagination) {
      this.pagination = {
        limit: pagination.limit,
        page: pagination.page,
        total: pagination.total,
        hasMore: pagination.limit * pagination.page < pagination.total,
      };
    }
  }
}
