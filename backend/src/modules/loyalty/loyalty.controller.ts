import { Request, Response, NextFunction } from 'express';
import { loyaltyService } from './loyalty.service';
import { sendSuccess } from '../../utils/response';

export class LoyaltyController {
  public getMyAccount(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.id || 'user-001';
      const account = loyaltyService.getAccount(userId);
      return sendSuccess(res, account, 'VIP loyalty profile retrieved');
    } catch (err) {
      next(err);
    }
  }

  public getTiers(req: Request, res: Response, next: NextFunction) {
    try {
      const tiers = loyaltyService.getTierDefinitions();
      return sendSuccess(res, tiers, 'VIP tier privileges retrieved');
    } catch (err) {
      next(err);
    }
  }

  public getCertificates(req: Request, res: Response, next: NextFunction) {
    try {
      const certs = loyaltyService.getProvenanceCertificates();
      return sendSuccess(res, certs, 'Sartorial provenance certificates retrieved');
    } catch (err) {
      next(err);
    }
  }
}

export const loyaltyController = new LoyaltyController();
