import { Router } from 'express';
import { logisticsController } from './logistics.controller';

const router = Router();

router.post('/calculate-rates', logisticsController.getQuotes.bind(logisticsController));
router.get('/customs-declaration', logisticsController.getCustomsDoc.bind(logisticsController));

export const logisticsRoutes = router;
