import { Response, NextFunction } from 'express';
import { wishlistService } from './wishlist.service';
import { sendSuccess } from '../../utils/response';
import { AuthenticatedRequest } from '../../middleware/authMiddleware';

export class WishlistController {
  async getWishlist(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const wishlist = await wishlistService.getUserWishlist(req.user!.userId);
      return sendSuccess(res, wishlist, 'Wishlist retrieved');
    } catch (error) {
      return next(error);
    }
  }

  async addToWishlist(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const item = await wishlistService.addToWishlist(req.user!.userId, req.body.productId);
      return sendSuccess(res, item, 'Item added to wishlist', 201);
    } catch (error) {
      return next(error);
    }
  }

  async removeFromWishlist(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await wishlistService.removeFromWishlist(req.user!.userId, req.params.productId);
      return sendSuccess(res, result, 'Item removed from wishlist');
    } catch (error) {
      return next(error);
    }
  }
}

export const wishlistController = new WishlistController();
