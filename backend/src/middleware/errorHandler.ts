import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { sendError } from '../utils/response';
import { logger } from '../config/logger';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) {
  if (err instanceof AppError) {
    if (err.statusCode >= 500) {
      logger.error(`[${req.method}] ${req.originalUrl} - AppError: ${err.message}`, { stack: err.stack });
    }
    return sendError(res, err.message, err.statusCode, err.code, err.details);
  }

  // Handle Prisma Known Request Errors if applicable
  if (err.name === 'PrismaClientKnownRequestError') {
    const prismaErr = err as any;
    if (prismaErr.code === 'P2002') {
      const target = prismaErr.meta?.target ? ` (${prismaErr.meta.target})` : '';
      return sendError(res, `A record with this field already exists${target}.`, 409, 'DUPLICATE_KEY_ERROR');
    }
    if (prismaErr.code === 'P2025') {
      return sendError(res, 'Record not found in database.', 404, 'RECORD_NOT_FOUND');
    }
  }

  // Fallback for unhandled unexpected errors
  logger.error(`[${req.method}] ${req.originalUrl} - Unhandled Exception:`, err);
  return sendError(
    res,
    process.env.NODE_ENV === 'production' ? 'An unexpected server error occurred.' : err.message,
    500,
    'INTERNAL_SERVER_ERROR',
    process.env.NODE_ENV === 'production' ? null : err.stack
  );
}
