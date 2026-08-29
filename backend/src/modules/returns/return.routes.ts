import { Router } from 'express';
import { returnController } from './return.controller';
import { requireAuth, requireRole } from '../../middleware/authMiddleware';

const router = Router();

router.use(requireAuth);

router.post('/', (req, res, next) => returnController.submitRequest(req, res, next));
router.get('/admin', requireRole('ADMIN'), (req, res, next) =>
  returnController.getAdminReturns(req, res, next)
);
router.put('/:id/status', requireRole('ADMIN'), (req, res, next) =>
  returnController.updateReturnStatus(req, res, next)
);

export const returnRoutes = router;
