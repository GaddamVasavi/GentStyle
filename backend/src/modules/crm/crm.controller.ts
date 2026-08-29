import { Request, Response, NextFunction } from 'express';
import { crmService } from './crm.service';
import { sendSuccess } from '../../utils/response';
import { RFMSegment } from './crm.types';

export class CRMController {
  public getCustomers(req: Request, res: Response, next: NextFunction) {
    try {
      const { search, segment } = req.query;
      const customers = crmService.getAllCustomers(search as string, segment as RFMSegment);
      return sendSuccess(res, customers, 'Customer 360 profiles retrieved');
    } catch (err) {
      next(err);
    }
  }

  public getCustomerById(req: Request, res: Response, next: NextFunction) {
    try {
      const customer = crmService.getCustomerById(req.params.id);
      return sendSuccess(res, customer, 'Customer 360 profile details retrieved');
    } catch (err) {
      next(err);
    }
  }
}

export const crmController = new CRMController();
