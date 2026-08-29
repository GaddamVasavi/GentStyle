import { Router } from 'express';
import { wishlistController } from './wishlist.controller';
import { requireAuth } from '../../middleware/authMiddleware';

const router = Router();

router.use(requireAuth);

router.get('/', (req, res, next) => wishlistController.getWishlist(req, res, next));
router.post('/', (req, res, next) => wishlistController.addToWishlist(req, res, next));
router.delete('/:productId', (req, res, next) =>
  wishlistController.removeFromWishlist(req, res, next)
);

export const wishlistRoutes = router;
