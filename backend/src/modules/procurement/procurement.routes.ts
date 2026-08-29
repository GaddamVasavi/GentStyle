import { Router } from 'express';
import { procurementController } from './procurement.controller';
import { requireAuth, requireRole } from '../../middleware/authMiddleware';

const router = Router();

router.get('/suppliers', procurementController.getSuppliers.bind(procurementController));
router.get('/purchase-orders', procurementController.getPurchaseOrders.bind(procurementController));
router.post('/purchase-orders', requireAuth, requireRole('ADMIN'), procurementController.createPurchaseOrder.bind(procurementController));
router.get('/goods-receipts', procurementController.getGRNs.bind(procurementController));

export const procurementRoutes = router;
