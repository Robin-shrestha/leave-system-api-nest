import { Pagination } from './pagination';

export class PaginatedResult<T> {
  data: T[];

  pagination: Omit<Pagination, 'hasMore'>;

  constructor(data: T[], pagination: Omit<Pagination, 'hasMore'>) {
    this.data = data;
    this.pagination = pagination;
  }
}

export type ResultData<T = unknown> = Record<string, T> | PaginatedResult<T>;
