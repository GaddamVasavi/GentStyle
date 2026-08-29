import { Request, Response, NextFunction } from 'express';
import { brandService } from './brand.service';
import { sendSuccess } from '../../utils/response';
import { AuthenticatedRequest } from '../../middleware/authMiddleware';

export class BrandController {
  async getAllBrands(req: Request, res: Response, next: NextFunction) {
    try {
      const brands = await brandService.getAllBrands();
      return sendSuccess(res, brands, 'Brands fetched successfully');
    } catch (error) {
      return next(error);
    }
  }

  async getBrandBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const brand = await brandService.getBrandBySlug(req.params.slug);
      return sendSuccess(res, brand, 'Brand details fetched');
    } catch (error) {
      return next(error);
    }
  }

  async createBrand(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const brand = await brandService.createBrand(req.body);
      return sendSuccess(res, brand, 'Brand created successfully', 201);
    } catch (error) {
      return next(error);
    }
  }
}

export const brandController = new BrandController();
