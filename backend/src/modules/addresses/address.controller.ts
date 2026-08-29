import { Response, NextFunction } from 'express';
import { addressService } from './address.service';
import { sendSuccess } from '../../utils/response';
import { AuthenticatedRequest } from '../../middleware/authMiddleware';

export class AddressController {
  async getUserAddresses(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const addresses = await addressService.getUserAddresses(req.user!.userId);
      return sendSuccess(res, addresses, 'Addresses fetched successfully');
    } catch (error) {
      return next(error);
    }
  }

  async getAddressById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const address = await addressService.getAddressById(req.params.id, req.user!.userId);
      return sendSuccess(res, address, 'Address fetched');
    } catch (error) {
      return next(error);
    }
  }

  async createAddress(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const address = await addressService.createAddress(req.user!.userId, req.body);
      return sendSuccess(res, address, 'Address added successfully', 201);
    } catch (error) {
      return next(error);
    }
  }

  async updateAddress(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const address = await addressService.updateAddress(req.params.id, req.user!.userId, req.body);
      return sendSuccess(res, address, 'Address updated successfully');
    } catch (error) {
      return next(error);
    }
  }

  async setDefaultShipping(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const address = await addressService.setDefaultShipping(req.params.id, req.user!.userId);
      return sendSuccess(res, address, 'Default shipping address updated');
    } catch (error) {
      return next(error);
    }
  }

  async setDefaultBilling(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const address = await addressService.setDefaultBilling(req.params.id, req.user!.userId);
      return sendSuccess(res, address, 'Default billing address updated');
    } catch (error) {
      return next(error);
    }
  }

  async deleteAddress(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await addressService.deleteAddress(req.params.id, req.user!.userId);
      return sendSuccess(res, result, 'Address deleted successfully');
    } catch (error) {
      return next(error);
    }
  }
}

export const addressController = new AddressController();
