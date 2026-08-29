import { Router } from 'express';
import { bespokeController } from './bespoke.controller';
import { requireAuth } from '../../middleware/authMiddleware';

const router = Router();

// Public bespoke catalog endpoints
router.get('/fabrics', bespokeController.getFabrics.bind(bespokeController));
router.get('/fabrics/:id', bespokeController.getFabricById.bind(bespokeController));
router.post('/calculate-quote', bespokeController.calculateConfigPrice.bind(bespokeController));
router.post('/analyze-measurements', bespokeController.analyzeMeasurements.bind(bespokeController));

// Authenticated Master Tailor Appointments
router.get('/appointments', requireAuth, bespokeController.getAppointments.bind(bespokeController));
router.post('/appointments', requireAuth, bespokeController.bookAppointment.bind(bespokeController));
router.delete('/appointments/:id', requireAuth, bespokeController.cancelAppointment.bind(bespokeController));

export const bespokeRoutes = router;
