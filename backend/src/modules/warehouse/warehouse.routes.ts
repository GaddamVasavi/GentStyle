import { Router } from 'express';
import { warehouseController } from './warehouse.controller';
import { requireAuth, requireRole } from '../../middleware/authMiddleware';

const router = Router();

router.get('/locations', warehouseController.getWarehouses.bind(warehouseController));
router.get('/locations/:id', warehouseController.getWarehouseById.bind(warehouseController));
router.get('/inventory', warehouseController.getInventory.bind(warehouseController));
router.get('/transfers', warehouseController.getTransfers.bind(warehouseController));
router.post('/transfers', requireAuth, requireRole('ADMIN'), warehouseController.createTransfer.bind(warehouseController));

export const warehouseRoutes = router;
