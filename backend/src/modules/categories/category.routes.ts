import { Router } from 'express';
import { categoryController } from './category.controller';
import { requireAuth, requireRole } from '../../middleware/authMiddleware';
import { validateRequest } from '../../middleware/validateRequest';
import { createCategorySchema, createSubCategorySchema } from './category.validation';

const router = Router();

router.get('/', (req, res, next) => categoryController.getAllCategories(req, res, next));
router.get('/:slug', (req, res, next) => categoryController.getCategoryBySlug(req, res, next));

router.post(
  '/',
  requireAuth,
  requireRole('ADMIN'),
  validateRequest(createCategorySchema),
  (req, res, next) => categoryController.createCategory(req, res, next)
);

router.post(
  '/subcategories',
  requireAuth,
  requireRole('ADMIN'),
  validateRequest(createSubCategorySchema),
  (req, res, next) => categoryController.createSubCategory(req, res, next)
);

export const categoryRoutes = router;
