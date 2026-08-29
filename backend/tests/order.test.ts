import { orderService } from '../src/modules/orders/order.service';
import { prisma } from '../src/database/prisma';

jest.mock('../src/database/prisma', () => {
  const mockPrisma: any = {
    cart: { findUnique: jest.fn() },
    address: { findFirst: jest.fn() },
    coupon: { findUnique: jest.fn(), update: jest.fn() },
    couponUsage: { create: jest.fn() },
    inventory: { update: jest.fn() },
    order: { create: jest.fn(), count: jest.fn(), findMany: jest.fn(), findFirst: jest.fn(), findUnique: jest.fn(), update: jest.fn() },
    payment: { create: jest.fn() },
    invoice: { create: jest.fn() },
    cartItem: { deleteMany: jest.fn() },
    notification: { create: jest.fn() },
    $transaction: jest.fn(),
  };
  return { prisma: mockPrisma };
});

describe('OrderModule - Unit & Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (prisma.$transaction as jest.Mock).mockImplementation(async (cb: any) => await cb(prisma));
  });

  describe('OrderService.createOrder', () => {
    it('should place order, reserve stock, generate invoice, and clear cart', async () => {
      (prisma.cart.findUnique as jest.Mock).mockResolvedValue({
        id: 'cart-1',
        userId: 'usr-1',
        items: [
          {
            productId: 'prod-1',
            variantId: 'var-1',
            quantity: 1,
            product: { name: 'Cashmere Blazer', basePrice: 650, discountPrice: null },
            variant: {
              sku: 'CB-001',
              size: '40R',
              colorName: 'Camel',
              priceAdjustment: 0,
              inventory: { id: 'inv-1', quantity: 5, reservedQuantity: 0 },
            },
          },
        ],
      });

      (prisma.address.findFirst as jest.Mock).mockResolvedValue({
        id: 'addr-1',
        userId: 'usr-1',
        street: '123 Fashion Ave',
      });

      (prisma.order.create as jest.Mock).mockResolvedValue({
        id: 'ord-1',
        orderNumber: 'GS-2026-ABC1234',
        totalAmount: 703.62,
        status: 'PENDING',
      });

      const order = await orderService.createOrder('usr-1', {
        shippingAddressId: 'addr-1',
        paymentMethod: 'STRIPE',
      });

      expect(order.orderNumber).toContain('GS-2026-');
      expect(prisma.inventory.update).toHaveBeenCalled();
      expect(prisma.cartItem.deleteMany).toHaveBeenCalled();
      expect(prisma.invoice.create).toHaveBeenCalled();
    });
  });
});
