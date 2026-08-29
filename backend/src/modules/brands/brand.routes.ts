import { Router } from 'express';
import { brandController } from './brand.controller';
import { requireAuth, requireRole } from '../../middleware/authMiddleware';

const router = Router();

router.get('/', (req, res, next) => brandController.getAllBrands(req, res, next));
router.get('/:slug', (req, res, next) => brandController.getBrandBySlug(req, res, next));
router.post('/', requireAuth, requireRole('ADMIN'), (req, res, next) =>
  brandController.createBrand(req, res, next)
);

export const brandRoutes = router;
