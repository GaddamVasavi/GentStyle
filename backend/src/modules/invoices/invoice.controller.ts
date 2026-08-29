import { Response, NextFunction } from 'express';
import { invoiceService } from './invoice.service';
import { sendSuccess } from '../../utils/response';
import { AuthenticatedRequest } from '../../middleware/authMiddleware';

export class InvoiceController {
  async getInvoiceByOrder(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const isCustomer = req.user!.role === 'CUSTOMER';
      const invoice = await invoiceService.getInvoiceByOrder(
        req.params.orderId,
        isCustomer ? req.user!.userId : undefined
      );
      return sendSuccess(res, invoice, 'Invoice retrieved successfully');
    } catch (error) {
      return next(error);
    }
  }
}

export const invoiceController = new InvoiceController();
