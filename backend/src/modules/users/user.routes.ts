import { Router } from 'express';
import { userController } from './user.controller';
import { requireAuth, requireRole } from '../../middleware/authMiddleware';
import { validateRequest } from '../../middleware/validateRequest';
import { updateProfileSchema, adminUpdateUserStatusSchema } from './user.validation';

const router = Router();

// Customer Profile Routes
router.get('/profile', requireAuth, (req, res, next) =>
  userController.getProfile(req, res, next)
);

router.put('/profile', requireAuth, validateRequest(updateProfileSchema), (req, res, next) =>
  userController.updateProfile(req, res, next)
);

router.get('/login-history', requireAuth, (req, res, next) =>
  userController.getLoginHistory(req, res, next)
);

// Admin Routes
router.get('/admin/list', requireAuth, requireRole('ADMIN'), (req, res, next) =>
  userController.adminListUsers(req, res, next)
);

router.patch('/admin/:id', requireAuth, requireRole('ADMIN'), validateRequest(adminUpdateUserStatusSchema), (req, res, next) =>
  userController.adminUpdateUser(req, res, next)
);

export const userRoutes = router;
