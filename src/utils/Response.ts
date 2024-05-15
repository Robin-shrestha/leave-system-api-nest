interface Pagination {
  currentPage?: number;
  pageCount?: number;
  pageSize?: number;
}

export type ResponseData<T = unknown> = Record<string, T> | Record<string, T>[];

export class Response<T> {
  data: T;
  message: string;
  statusCode: number;
  metadata: {
    pagination: Pagination;
  };

  constructor(
    data: T,
    statusCode: number,
    message?: string,
    pagination?: Pagination,
  ) {
    this.data = data;
    this.statusCode = statusCode;
    this.message = message || 'SUCCESS';
    if (pagination) {
      this.metadata = {
        pagination: pagination,
      };
    }
  }
}
