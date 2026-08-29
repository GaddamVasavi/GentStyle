import { Router } from 'express';
import { authController } from './auth.controller';
import { validateRequest } from '../../middleware/validateRequest';
import { requireAuth } from '../../middleware/authMiddleware';
import { authLimiter } from '../../middleware/rateLimiter';
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
} from './auth.validation';

const router = Router();

router.post('/register', authLimiter, validateRequest(registerSchema), (req, res, next) =>
  authController.register(req, res, next)
);

router.post('/login', authLimiter, validateRequest(loginSchema), (req, res, next) =>
  authController.login(req, res, next)
);

router.post('/refresh', (req, res, next) =>
  authController.refresh(req, res, next)
);

router.post('/logout', requireAuth, (req, res, next) =>
  authController.logout(req, res, next)
);

router.post('/forgot-password', authLimiter, validateRequest(forgotPasswordSchema), (req, res, next) =>
  authController.forgotPassword(req, res, next)
);

router.post('/reset-password', authLimiter, validateRequest(resetPasswordSchema), (req, res, next) =>
  authController.resetPassword(req, res, next)
);

router.post('/change-password', requireAuth, validateRequest(changePasswordSchema), (req, res, next) =>
  authController.changePassword(req, res, next)
);

router.get('/me', requireAuth, (req, res, next) =>
  authController.getMe(req, res, next)
);

export const authRoutes = router;
