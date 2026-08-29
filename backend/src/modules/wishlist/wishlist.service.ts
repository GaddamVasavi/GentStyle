import { prisma } from '../../database/prisma';
import { NotFoundError } from '../../utils/errors';
import { logger } from '../../config/logger';

export class WishlistService {
  /**
   * Get wishlist for user
   */
  async getUserWishlist(userId: string) {
    const fullInclude = {
      items: {
        include: {
          product: {
            include: {
              brand: true,
              category: true,
              images: { where: { isPrimary: true } },
              variants: { include: { inventory: true } },
            },
          },
        },
        orderBy: { createdAt: 'desc' as const },
      },
    };

    let wishlist = await prisma.wishlist.findUnique({
      where: { userId },
      include: fullInclude,
    });

    if (!wishlist) {
      wishlist = await prisma.wishlist.create({
        data: { userId },
        include: fullInclude,
      });
    }

    return wishlist;
  }

  /**
   * Add product to wishlist
   */
  async addToWishlist(userId: string, productId: string) {
    let wishlist = await prisma.wishlist.findUnique({
      where: { userId },
    });

    if (!wishlist) {
      wishlist = await prisma.wishlist.create({
        data: { userId },
      });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundError('Product not found');
    }

    const item = await prisma.wishlistItem.upsert({
      where: {
        wishlistId_productId: {
          wishlistId: wishlist.id,
          productId,
        },
      },
      update: {},
      create: {
        wishlistId: wishlist.id,
        productId,
      },
      include: { product: true },
    });

    logger.info(`Product ${productId} added to wishlist for user ${userId}`);
    return item;
  }

  /**
   * Remove item from wishlist
   */
  async removeFromWishlist(userId: string, productId: string) {
    const wishlist = await prisma.wishlist.findUnique({
      where: { userId },
    });

    if (!wishlist) return { success: true };

    await prisma.wishlistItem.deleteMany({
      where: {
        wishlistId: wishlist.id,
        productId,
      },
    });

    return { success: true, message: 'Item removed from wishlist' };
  }
}

export const wishlistService = new WishlistService();
