import { Router } from 'express';
import { productController } from './product.controller';
import { requireAuth, requireRole } from '../../middleware/authMiddleware';
import { validateRequest } from '../../middleware/validateRequest';
import {
  createProductSchema,
  updateProductSchema,
  productIdParamSchema,
  productSlugParamSchema,
} from './product.validation';

const router = Router();

// Public Catalog Endpoints
router.get('/', (req, res, next) => productController.getProducts(req, res, next));
router.get('/slug/:slug', validateRequest(productSlugParamSchema), (req, res, next) =>
  productController.getProductBySlug(req, res, next)
);
router.get('/:id', validateRequest(productIdParamSchema), (req, res, next) =>
  productController.getProductById(req, res, next)
);

// Admin Protected Endpoints
router.post(
  '/',
  requireAuth,
  requireRole('ADMIN'),
  validateRequest(createProductSchema),
  (req, res, next) => productController.createProduct(req, res, next)
);

router.put(
  '/:id',
  requireAuth,
  requireRole('ADMIN'),
  validateRequest(updateProductSchema),
  (req, res, next) => productController.updateProduct(req, res, next)
);

router.delete(
  '/:id',
  requireAuth,
  requireRole('ADMIN'),
  validateRequest(productIdParamSchema),
  (req, res, next) => productController.deleteProduct(req, res, next)
);

export const productRoutes = router;
