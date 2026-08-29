import { Router } from 'express';
import { analyticsController } from './analytics.controller';
import { requireAuth, requireRole } from '../../middleware/authMiddleware';

const router = Router();

router.get('/kpi-summary', requireAuth, requireRole('ADMIN'), analyticsController.getKPISummary.bind(analyticsController));
router.get('/revenue-forecasts', requireAuth, requireRole('ADMIN'), analyticsController.getForecasts.bind(analyticsController));
router.get('/category-margins', requireAuth, requireRole('ADMIN'), analyticsController.getMargins.bind(analyticsController));

export const analyticsRoutes = router;
