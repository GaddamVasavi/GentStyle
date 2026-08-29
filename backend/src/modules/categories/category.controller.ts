import { Request, Response, NextFunction } from 'express';
import { categoryService } from './category.service';
import { sendSuccess } from '../../utils/response';
import { AuthenticatedRequest } from '../../middleware/authMiddleware';

export class CategoryController {
  async getAllCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await categoryService.getAllCategories();
      return sendSuccess(res, categories, 'Categories fetched successfully');
    } catch (error) {
      return next(error);
    }
  }

  async getCategoryBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await categoryService.getCategoryBySlug(req.params.slug);
      return sendSuccess(res, category, 'Category details fetched');
    } catch (error) {
      return next(error);
    }
  }

  async createCategory(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const category = await categoryService.createCategory(req.body);
      return sendSuccess(res, category, 'Category created successfully', 201);
    } catch (error) {
      return next(error);
    }
  }

  async createSubCategory(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const sub = await categoryService.createSubCategory(req.body);
      return sendSuccess(res, sub, 'Subcategory created successfully', 201);
    } catch (error) {
      return next(error);
    }
  }
}

export const categoryController = new CategoryController();
