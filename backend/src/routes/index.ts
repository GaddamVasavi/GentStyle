import { Router } from 'express';
import { authRoutes } from '../modules/auth/auth.routes';
import { userRoutes } from '../modules/users/user.routes';
import { addressRoutes } from '../modules/addresses/address.routes';
import { productRoutes } from '../modules/products/product.routes';
import { categoryRoutes } from '../modules/categories/category.routes';
import { brandRoutes } from '../modules/brands/brand.routes';
import { collectionRoutes } from '../modules/collections/collection.routes';
import { inventoryRoutes } from '../modules/inventory/inventory.routes';
import { wishlistRoutes } from '../modules/wishlist/wishlist.routes';
import { sendSuccess } from '../utils/response';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  return sendSuccess(
    res,
    {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: '1.0.0',
      service: 'GentStyle Backend API',
    },
    'GentStyle API is operational'
  );
});

// Mount Module Endpoints
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/addresses', addressRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/brands', brandRoutes);
router.use('/collections', collectionRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/wishlist', wishlistRoutes);

export const apiRouter = router;
