import { Router } from 'express';
import { invoiceController } from './invoice.controller';
import { requireAuth } from '../../middleware/authMiddleware';

const router = Router();

router.use(requireAuth);

router.get('/order/:orderId', (req, res, next) =>
  invoiceController.getInvoiceByOrder(req, res, next)
);

export const invoiceRoutes = router;
