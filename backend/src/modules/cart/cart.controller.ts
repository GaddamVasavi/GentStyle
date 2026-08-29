import { Response, NextFunction } from 'express';
import { cartService } from './cart.service';
import { sendSuccess } from '../../utils/response';
import { AuthenticatedRequest } from '../../middleware/authMiddleware';

export class CartController {
  async getCart(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await cartService.getCart(req.user!.userId);
      return sendSuccess(res, result, 'Cart fetched successfully');
    } catch (error) {
      return next(error);
    }
  }

  async addItem(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await cartService.addItem(req.user!.userId, req.body);
      return sendSuccess(res, result, 'Item added to wardrobe cart', 201);
    } catch (error) {
      return next(error);
    }
  }

  async updateItemQuantity(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await cartService.updateItemQuantity(
        req.user!.userId,
        req.params.itemId,
        req.body
      );
      return sendSuccess(res, result, 'Cart item quantity updated');
    } catch (error) {
      return next(error);
    }
  }

  async removeItem(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await cartService.removeItem(req.user!.userId, req.params.itemId);
      return sendSuccess(res, result, 'Item removed from cart');
    } catch (error) {
      return next(error);
    }
  }

  async clearCart(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await cartService.clearCart(req.user!.userId);
      return sendSuccess(res, result, 'Wardrobe cart emptied');
    } catch (error) {
      return next(error);
    }
  }
}

export const cartController = new CartController();
