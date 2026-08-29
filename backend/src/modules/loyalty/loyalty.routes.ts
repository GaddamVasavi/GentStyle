import { Router } from 'express';
import { loyaltyController } from './loyalty.controller';
import { requireAuth } from '../../middleware/authMiddleware';

const router = Router();

router.get('/my-account', requireAuth, loyaltyController.getMyAccount.bind(loyaltyController));
router.get('/tiers', loyaltyController.getTiers.bind(loyaltyController));
router.get('/provenance-certificates', requireAuth, loyaltyController.getCertificates.bind(loyaltyController));

export const loyaltyRoutes = router;
