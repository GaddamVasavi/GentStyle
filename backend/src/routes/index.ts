import { Router } from 'express';
import { authRoutes } from '../modules/auth/auth.routes';
import { userRoutes } from '../modules/users/user.routes';
import { addressRoutes } from '../modules/addresses/address.routes';
import { sendSuccess } from '../utils/response';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  return sendSuccess(res, {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0',
    service: 'GentStyle Backend API',
  }, 'GentStyle API is operational');
});

// Mount Module 1 Routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/addresses', addressRoutes);

export const apiRouter = router;
