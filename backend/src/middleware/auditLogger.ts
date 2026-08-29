import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './authMiddleware';
import { prisma } from '../database/prisma';
import { logger } from '../config/logger';

export function auditLog(action: string, entity: string) {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // We attach a listener on response finish to log successful operations
    res.on('finish', async () => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        try {
          const userId = req.user?.userId;
          const entityId = req.params?.id || req.body?.id || null;
          const ipAddress = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';

          await prisma.auditLog.create({
            data: {
              userId,
              action,
              entity,
              entityId,
              newValue: req.body ? req.body : undefined,
              ipAddress,
            },
          });
        } catch (err) {
          logger.warn(`Failed to write audit log for action ${action}:`, err);
        }
      }
    });

    next();
  };
}
