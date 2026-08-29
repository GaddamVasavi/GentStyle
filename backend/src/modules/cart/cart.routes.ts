import { Router } from 'express';
import { cartController } from './cart.controller';
import { requireAuth } from '../../middleware/authMiddleware';
import { validateRequest } from '../../middleware/validateRequest';
import {
  addCartItemSchema,
  updateCartItemSchema,
  cartItemIdParamSchema,
} from './cart.validation';

const router = Router();

router.use(requireAuth);

router.get('/', (req, res, next) => cartController.getCart(req, res, next));
router.post('/items', validateRequest(addCartItemSchema), (req, res, next) =>
  cartController.addItem(req, res, next)
);
router.put('/items/:itemId', validateRequest(updateCartItemSchema), (req, res, next) =>
  cartController.updateItemQuantity(req, res, next)
);
router.delete('/items/:itemId', validateRequest(cartItemIdParamSchema), (req, res, next) =>
  cartController.removeItem(req, res, next)
);
router.delete('/', (req, res, next) => cartController.clearCart(req, res, next));

export const cartRoutes = router;
