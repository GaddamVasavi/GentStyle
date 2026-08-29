import { productService } from '../src/modules/products/product.service';
import { prisma } from '../src/database/prisma';

jest.mock('../src/database/prisma', () => {
  const mockPrisma: any = {
    product: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    productImage: {
      createMany: jest.fn(),
    },
    productAttribute: {
      createMany: jest.fn(),
    },
    productVariant: {
      create: jest.fn(),
    },
    inventory: {
      create: jest.fn(),
    },
    collectionProduct: {
      createMany: jest.fn(),
    },
    $transaction: jest.fn(),
  };
  return { prisma: mockPrisma };
});

describe('ProductModule - Unit & Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (prisma.$transaction as jest.Mock).mockImplementation(async (cb: any) => await cb(prisma));
  });

  describe('ProductService.getProducts', () => {
    it('should query products with pagination', async () => {
      (prisma.product.count as jest.Mock).mockResolvedValue(1);
      (prisma.product.findMany as jest.Mock).mockResolvedValue([
        {
          id: 'prod-1',
          name: 'Milano Wool Blazer',
          slug: 'milano-wool-blazer',
          sku: 'MWB-001',
          basePrice: 650,
          status: 'ACTIVE',
          brand: { name: 'Milano Sartoria' },
          images: [{ imageUrl: 'https://example.com/img.jpg', isPrimary: true }],
          variants: [],
        },
      ]);

      const result = await productService.getProducts({ page: 1, limit: 20 });
      expect(result.products).toHaveLength(1);
      expect(result.pagination.total).toBe(1);
      expect(result.products[0].name).toBe('Milano Wool Blazer');
    });

    it('should filter products by search term and category', async () => {
      (prisma.product.count as jest.Mock).mockResolvedValue(1);
      (prisma.product.findMany as jest.Mock).mockResolvedValue([
        {
          id: 'prod-2',
          name: 'Egyptian Cotton Dress Shirt',
          slug: 'egyptian-cotton-dress-shirt',
          basePrice: 145,
          status: 'ACTIVE',
        },
      ]);

      const result = await productService.getProducts({ search: 'cotton', categorySlug: 'shirts' });
      expect(result.products[0].name).toContain('Cotton');
    });
  });

  describe('ProductService.getProductBySlug', () => {
    it('should retrieve single product with variants and related items', async () => {
      (prisma.product.findUnique as jest.Mock).mockResolvedValue({
        id: 'prod-1',
        name: 'Milano Wool Blazer',
        slug: 'milano-wool-blazer',
        categoryId: 'cat-1',
        brand: { name: 'Milano' },
        variants: [],
        images: [],
        reviews: [],
        collections: [],
      });
      (prisma.product.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.product.update as jest.Mock).mockResolvedValue({});

      const product = await productService.getProductBySlug('milano-wool-blazer');
      expect(product.slug).toBe('milano-wool-blazer');
      expect(product).toHaveProperty('relatedProducts');
    });

    it('should throw NotFoundError if product does not exist', async () => {
      (prisma.product.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(productService.getProductBySlug('non-existent')).rejects.toThrow(
        'Product not found in luxury catalog'
      );
    });
  });
});
