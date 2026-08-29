import { Response } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T | null;
  error?: {
    code: string;
    details?: any;
  } | null;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export function sendSuccess<T>(
  res: Response,
  data: T,
  message: string = 'Operation successful',
  statusCode: number = 200,
  meta?: ApiResponse['meta']
) {
  const payload: ApiResponse<T> = {
    success: true,
    message,
    data,
    ...(meta ? { meta } : {}),
  };
  return res.status(statusCode).json(payload);
}

export function sendError(
  res: Response,
  message: string = 'Operation failed',
  statusCode: number = 500,
  code: string = 'INTERNAL_SERVER_ERROR',
  details: any = null
) {
  const payload: ApiResponse = {
    success: false,
    message,
    data: null,
    error: {
      code,
      details,
    },
  };
  return res.status(statusCode).json(payload);
}
