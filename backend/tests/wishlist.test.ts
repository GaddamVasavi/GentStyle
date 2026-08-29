import { wishlistService } from '../src/modules/wishlist/wishlist.service';
import { prisma } from '../src/database/prisma';

jest.mock('../src/database/prisma', () => {
  const mockPrisma: any = {
    wishlist: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    product: {
      findUnique: jest.fn(),
    },
    wishlistItem: {
      upsert: jest.fn(),
      deleteMany: jest.fn(),
    },
  };
  return { prisma: mockPrisma };
});

describe('WishlistModule - Unit & Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return user wishlist', async () => {
    (prisma.wishlist.findUnique as jest.Mock).mockResolvedValue({
      id: 'wl-1',
      userId: 'usr-1',
      items: [
        {
          id: 'wli-1',
          productId: 'prod-1',
          product: { id: 'prod-1', name: 'Milano Blazer' },
        },
      ],
    });

    const wishlist = await wishlistService.getUserWishlist('usr-1');
    expect(wishlist.id).toBe('wl-1');
    expect(wishlist.items).toHaveLength(1);
  });

  it('should add product to user wishlist', async () => {
    (prisma.wishlist.findUnique as jest.Mock).mockResolvedValue({ id: 'wl-1', userId: 'usr-1' });
    (prisma.product.findUnique as jest.Mock).mockResolvedValue({ id: 'prod-1', name: 'Milano Blazer' });
    (prisma.wishlistItem.upsert as jest.Mock).mockResolvedValue({
      id: 'wli-1',
      wishlistId: 'wl-1',
      productId: 'prod-1',
      product: { id: 'prod-1', name: 'Milano Blazer' },
    });

    const item = await wishlistService.addToWishlist('usr-1', 'prod-1');
    expect(item.id).toBe('wli-1');
    expect(item.productId).toBe('prod-1');
  });

  it('should remove product from wishlist', async () => {
    (prisma.wishlist.findUnique as jest.Mock).mockResolvedValue({ id: 'wl-1', userId: 'usr-1' });
    (prisma.wishlistItem.deleteMany as jest.Mock).mockResolvedValue({ count: 1 });

    const res = await wishlistService.removeFromWishlist('usr-1', 'prod-1');
    expect(res.success).toBe(true);
  });
});
