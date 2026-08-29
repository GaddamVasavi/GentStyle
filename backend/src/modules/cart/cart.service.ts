import { prisma } from '../../database/prisma';
import { NotFoundError, AppError } from '../../utils/errors';
import { AddCartItemInput, UpdateCartItemInput, CartCalculationResult } from './cart.types';
import { logger } from '../../config/logger';

export class CartService {
  /**
   * Retrieve active cart for a user with loaded variant, inventory, and images
   */
  async getCart(userId: string) {
    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                brand: true,
                images: { where: { isPrimary: true } },
              },
            },
            variant: {
              include: {
                inventory: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
        include: {
          items: {
            include: {
              product: {
                include: {
                  brand: true,
                  images: { where: { isPrimary: true } },
                },
              },
              variant: {
                include: {
                  inventory: true,
                },
              },
            },
          },
        },
      });
    }

    // Attach calculated unitPrice on items
    const itemsWithUnitPrice = cart.items.map((item) => {
      const p = item.product;
      const v = item.variant;
      const effectiveBase = p.discountPrice !== null ? Number(p.discountPrice) : Number(p.basePrice);
      const adjustment = Number(v?.priceAdjustment || 0);
      const unitPrice = effectiveBase + adjustment;
      return {
        ...item,
        unitPrice,
      };
    });

    const calculations = this.calculateCartSummary(itemsWithUnitPrice);

    return {
      cart: {
        ...cart,
        items: itemsWithUnitPrice,
      },
      summary: calculations,
    };
  }

  /**
   * Add item to cart or increment quantity if already present
   */
  async addItem(userId: string, input: AddCartItemInput) {
    let cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      cart = await prisma.cart.create({ data: { userId } });
    }

    const variant = await prisma.productVariant.findUnique({
      where: { id: input.variantId },
      include: { inventory: true, product: true },
    });

    if (!variant || variant.productId !== input.productId) {
      throw new NotFoundError('Selected garment variant does not exist');
    }

    const availableStock = variant.inventory ? variant.inventory.quantity - variant.inventory.reservedQuantity : 0;
    if (availableStock < input.quantity) {
      throw new AppError(
        `Insufficient stock for ${variant.product.name} (${variant.size}). Only ${availableStock} available.`,
        400,
        'INSUFFICIENT_STOCK'
      );
    }

    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_variantId: {
          cartId: cart.id,
          variantId: input.variantId,
        },
      },
    });

    let cartItem;
    if (existingItem) {
      const newQuantity = existingItem.quantity + input.quantity;
      if (newQuantity > availableStock) {
        throw new AppError(`Total quantity (${newQuantity}) exceeds available stock (${availableStock})`, 400);
      }

      cartItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: newQuantity,
        },
        include: {
          product: true,
          variant: true,
        },
      });
    } else {
      cartItem = await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: input.productId,
          variantId: input.variantId,
          quantity: input.quantity,
        },
        include: {
          product: true,
          variant: true,
        },
      });
    }

    logger.info(`Cart item updated for user ${userId}: variant ${input.variantId} (qty: ${cartItem.quantity})`);
    return this.getCart(userId);
  }

  /**
   * Update quantity of an existing cart item
   */
  async updateItemQuantity(userId: string, itemId: string, input: UpdateCartItemInput) {
    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) throw new NotFoundError('Cart not found');

    const item = await prisma.cartItem.findFirst({
      where: { id: itemId, cartId: cart.id },
      include: { variant: { include: { inventory: true, product: true } } },
    });

    if (!item) {
      throw new NotFoundError('Cart item not found');
    }

    const availableStock = item.variant.inventory
      ? item.variant.inventory.quantity - item.variant.inventory.reservedQuantity
      : 0;

    if (input.quantity > availableStock) {
      throw new AppError(
        `Cannot set quantity to ${input.quantity}. Only ${availableStock} available in stock.`,
        400
      );
    }

    await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity: input.quantity },
    });

    return this.getCart(userId);
  }

  /**
   * Remove item from cart
   */
  async removeItem(userId: string, itemId: string) {
    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) return { success: true };

    await prisma.cartItem.deleteMany({
      where: { id: itemId, cartId: cart.id },
    });

    return this.getCart(userId);
  }

  /**
   * Clear entire cart
   */
  async clearCart(userId: string) {
    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (cart) {
      await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    }
    return { success: true, message: 'Cart cleared successfully' };
  }

  /**
   * Calculate subtotal, taxes, shipping tiers, and grand total
   */
  private calculateCartSummary(items: any[]): CartCalculationResult {
    let subtotal = 0;
    let itemCount = 0;

    for (const item of items) {
      const price = Number(item.unitPrice || 0);
      const qty = Number(item.quantity || 1);
      subtotal += price * qty;
      itemCount += qty;
    }

    const shippingFee = subtotal >= 250 || subtotal === 0 ? 0 : 25;
    const taxTotal = Math.round(subtotal * 0.0825 * 100) / 100;
    const discountTotal = 0;
    const grandTotal = Math.max(0, subtotal + taxTotal + shippingFee - discountTotal);

    return {
      subtotal: Math.round(subtotal * 100) / 100,
      taxTotal,
      shippingFee,
      discountTotal,
      grandTotal: Math.round(grandTotal * 100) / 100,
      itemCount,
      appliedCoupon: null,
    };
  }
}

export const cartService = new CartService();
