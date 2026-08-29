import { Router } from 'express';
import { orderController } from './order.controller';
import { requireAuth, requireRole } from '../../middleware/authMiddleware';
import { validateRequest } from '../../middleware/validateRequest';
import {
  createOrderSchema,
  updateOrderStatusSchema,
  orderIdParamSchema,
} from './order.validation';

const router = Router();

router.use(requireAuth);

// Customer endpoints
router.post('/', validateRequest(createOrderSchema), (req, res, next) =>
  orderController.createOrder(req, res, next)
);
router.get('/my-orders', (req, res, next) =>
  orderController.getUserOrders(req, res, next)
);
router.get('/:id', validateRequest(orderIdParamSchema), (req, res, next) =>
  orderController.getOrderDetails(req, res, next)
);

// Admin endpoints
router.get('/', requireRole('ADMIN'), (req, res, next) =>
  orderController.getAdminOrders(req, res, next)
);
router.put(
  '/:id/status',
  requireRole('ADMIN'),
  validateRequest(updateOrderStatusSchema),
  (req, res, next) => orderController.updateOrderStatus(req, res, next)
);

export const orderRoutes = router;
