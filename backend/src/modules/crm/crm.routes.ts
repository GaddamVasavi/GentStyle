import { Router } from 'express';
import { crmController } from './crm.controller';
import { requireAuth, requireRole } from '../../middleware/authMiddleware';

const router = Router();

router.get('/customers', requireAuth, requireRole('ADMIN'), crmController.getCustomers.bind(crmController));
router.get('/customers/:id', requireAuth, requireRole('ADMIN'), crmController.getCustomerById.bind(crmController));

export const crmRoutes = router;
