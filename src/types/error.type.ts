export type ResponseError = {
  message: string | Array<unknown> | object;
  statusCode: number;
  timestamp: string;
  path?: string;
  [x: string]: unknown;
};
