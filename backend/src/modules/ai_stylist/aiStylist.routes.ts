import { Router } from 'express';
import { aiStylistController } from './aiStylist.controller';

const router = Router();

router.get('/recommendations', aiStylistController.getOutfits.bind(aiStylistController));

export const aiStylistRoutes = router;
