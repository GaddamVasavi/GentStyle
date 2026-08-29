import { cartService } from '../src/modules/cart/cart.service';
import { prisma } from '../src/database/prisma';

jest.mock('../src/database/prisma', () => {
  const mockPrisma: any = {
    cart: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    cartItem: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      deleteMany: jest.fn(),
      findFirst: jest.fn(),
    },
    productVariant: {
      findUnique: jest.fn(),
    },
  };
  return { prisma: mockPrisma };
});

describe('CartModule - Unit & Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('CartService.getCart', () => {
    it('should retrieve active cart and compute financial summary', async () => {
      (prisma.cart.findUnique as jest.Mock).mockResolvedValue({
        id: 'cart-1',
        userId: 'usr-1',
        items: [
          {
            id: 'ci-1',
            quantity: 1,
            product: { basePrice: 500, discountPrice: null, name: 'Cashmere Overcoat', images: [] },
            variant: { size: '40R', colorName: 'Camel', priceAdjustment: 0 },
          },
        ],
      });

      const res = await cartService.getCart('usr-1');
      expect(res.cart.id).toBe('cart-1');
      expect(res.summary.subtotal).toBe(500);
      expect(res.summary.shippingFee).toBe(0); // Free for > $250
      expect(res.summary.grandTotal).toBeGreaterThan(500);
    });
  });

  describe('CartService.addItem', () => {
    it('should add an item to cart if stock is available', async () => {
      (prisma.cart.findUnique as jest.Mock).mockResolvedValue({ id: 'cart-1', userId: 'usr-1' });
      (prisma.productVariant.findUnique as jest.Mock).mockResolvedValue({
        id: 'var-1',
        productId: 'prod-1',
        size: '38R',
        colorName: 'Navy',
        product: { id: 'prod-1', name: 'Navy Suit', basePrice: 450, discountPrice: null },
        inventory: { quantity: 10, reservedQuantity: 0 },
      });
      (prisma.cartItem.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.cartItem.create as jest.Mock).mockResolvedValue({ id: 'ci-new', quantity: 1 });

      (prisma.cart.findUnique as jest.Mock).mockResolvedValueOnce({
        id: 'cart-1',
        userId: 'usr-1',
      }).mockResolvedValueOnce({
        id: 'cart-1',
        userId: 'usr-1',
        items: [{
          id: 'ci-new',
          quantity: 1,
          product: { basePrice: 450, discountPrice: null },
          variant: { priceAdjustment: 0 },
        }],
      });

      const res = await cartService.addItem('usr-1', {
        productId: 'prod-1',
        variantId: 'var-1',
        quantity: 1,
      });

      expect(res).toBeDefined();
    });
  });
});
