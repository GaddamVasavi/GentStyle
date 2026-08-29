import { Router } from 'express';
import { addressController } from './address.controller';
import { requireAuth } from '../../middleware/authMiddleware';
import { validateRequest } from '../../middleware/validateRequest';
import {
  createAddressSchema,
  updateAddressSchema,
  addressIdParamSchema,
} from './address.validation';

const router = Router();

router.use(requireAuth);

router.get('/', (req, res, next) =>
  addressController.getUserAddresses(req, res, next)
);

router.post('/', validateRequest(createAddressSchema), (req, res, next) =>
  addressController.createAddress(req, res, next)
);

router.get('/:id', validateRequest(addressIdParamSchema), (req, res, next) =>
  addressController.getAddressById(req, res, next)
);

router.put('/:id', validateRequest(updateAddressSchema), (req, res, next) =>
  addressController.updateAddress(req, res, next)
);

router.patch('/:id/default-shipping', validateRequest(addressIdParamSchema), (req, res, next) =>
  addressController.setDefaultShipping(req, res, next)
);

router.patch('/:id/default-billing', validateRequest(addressIdParamSchema), (req, res, next) =>
  addressController.setDefaultBilling(req, res, next)
);

router.delete('/:id', validateRequest(addressIdParamSchema), (req, res, next) =>
  addressController.deleteAddress(req, res, next)
);

export const addressRoutes = router;
