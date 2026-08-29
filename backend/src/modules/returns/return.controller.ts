import { Response, NextFunction } from 'express';
import { returnService } from './return.service';
import { sendSuccess } from '../../utils/response';
import { AuthenticatedRequest } from '../../middleware/authMiddleware';

export class ReturnController {
  async submitRequest(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await returnService.submitRequest(req.user!.userId, req.body);
      return sendSuccess(res, result, 'Return/Exchange request submitted successfully', 201);
    } catch (error) {
      return next(error);
    }
  }

  async getAdminReturns(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const [returns, exchanges] = await Promise.all([
        returnService.getAdminReturnRequests(),
        returnService.getAdminExchangeRequests(),
      ]);
      return sendSuccess(res, { returns, exchanges }, 'Return and exchange requests retrieved');
    } catch (error) {
      return next(error);
    }
  }

  async updateReturnStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await returnService.updateReturnStatus(
        req.params.id,
        req.body.status,
        req.body.notes
      );
      return sendSuccess(res, result, 'Return request updated');
    } catch (error) {
      return next(error);
    }
  }
}

export const returnController = new ReturnController();
