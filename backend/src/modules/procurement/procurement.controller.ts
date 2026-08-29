import { Request, Response, NextFunction } from 'express';
import { procurementService } from './procurement.service';
import { sendSuccess } from '../../utils/response';

export class ProcurementController {
  public getSuppliers(req: Request, res: Response, next: NextFunction) {
    try {
      const suppliers = procurementService.getSuppliers();
      return sendSuccess(res, suppliers, 'Luxury mill vendors retrieved');
    } catch (err) {
      next(err);
    }
  }

  public getPurchaseOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const pos = procurementService.getPurchaseOrders();
      return sendSuccess(res, pos, 'Purchase orders retrieved');
    } catch (err) {
      next(err);
    }
  }

  public createPurchaseOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const po = procurementService.createPurchaseOrder(req.body);
      return sendSuccess(res, po, 'Purchase order generated and transmitted to mill', 201);
    } catch (err) {
      next(err);
    }
  }

  public getGRNs(req: Request, res: Response, next: NextFunction) {
    try {
      const grns = procurementService.getGoodsReceiptNotes();
      return sendSuccess(res, grns, 'Goods receipt inspection records retrieved');
    } catch (err) {
      next(err);
    }
  }
}

export const procurementController = new ProcurementController();
