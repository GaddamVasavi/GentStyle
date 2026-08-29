import { Request, Response, NextFunction } from 'express';
import { inventoryService } from './inventory.service';
import { sendSuccess } from '../../utils/response';
import { AuthenticatedRequest } from '../../middleware/authMiddleware';

export class InventoryController {
  async getInventoryList(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 50;
      const lowStockOnly = req.query.lowStockOnly === 'true';

      const result = await inventoryService.getInventoryList(page, limit, lowStockOnly);
      return sendSuccess(res, result.items, 'Inventory list retrieved', 200, result.pagination);
    } catch (error) {
      return next(error);
    }
  }

  async updateStock(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const updated = await inventoryService.updateStock(req.params.variantId, req.body);
      return sendSuccess(res, updated, 'Inventory updated successfully');
    } catch (error) {
      return next(error);
    }
  }
}

export const inventoryController = new InventoryController();
