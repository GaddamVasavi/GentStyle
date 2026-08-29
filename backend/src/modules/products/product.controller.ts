import { Request, Response, NextFunction } from 'express';
import { productService } from './product.service';
import { sendSuccess } from '../../utils/response';
import { AuthenticatedRequest } from '../../middleware/authMiddleware';

export class ProductController {
  async getProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const { products, pagination } = await productService.getProducts(req.query);
      return sendSuccess(res, products, 'Products retrieved successfully', 200, pagination);
    } catch (error) {
      return next(error);
    }
  }

  async getProductBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await productService.getProductBySlug(req.params.slug);
      return sendSuccess(res, product, 'Product details fetched');
    } catch (error) {
      return next(error);
    }
  }

  async getProductById(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await productService.getProductById(req.params.id);
      return sendSuccess(res, product, 'Product fetched');
    } catch (error) {
      return next(error);
    }
  }

  async createProduct(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const product = await productService.createProduct(req.body);
      return sendSuccess(res, product, 'Product created successfully', 201);
    } catch (error) {
      return next(error);
    }
  }

  async updateProduct(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const product = await productService.updateProduct(req.params.id, req.body);
      return sendSuccess(res, product, 'Product updated successfully');
    } catch (error) {
      return next(error);
    }
  }

  async deleteProduct(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await productService.deleteProduct(req.params.id);
      return sendSuccess(res, result, 'Product removed successfully');
    } catch (error) {
      return next(error);
    }
  }
}

export const productController = new ProductController();
