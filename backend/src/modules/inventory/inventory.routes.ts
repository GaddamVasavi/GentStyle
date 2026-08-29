import { Router } from 'express';
import { inventoryController } from './inventory.controller';
import { requireAuth, requireRole } from '../../middleware/authMiddleware';

const router = Router();

router.use(requireAuth, requireRole('ADMIN'));

router.get('/', (req, res, next) => inventoryController.getInventoryList(req, res, next));
router.put('/:variantId', (req, res, next) => inventoryController.updateStock(req, res, next));

export const inventoryRoutes = router;
