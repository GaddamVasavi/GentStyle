import { prisma } from '../../database/prisma';
import { NotFoundError, ConflictError, AppError } from '../../utils/errors';
import { CreateProductInput, UpdateProductInput, ProductQueryFilter } from './product.types';
import { logger } from '../../config/logger';
import { Prisma } from '@prisma/client';

export class ProductService {
  /**
   * Helper to generate a URL slug
   */
  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  /**
   * Get filtered, paginated products for catalog browsing & discovery
   */
  async getProducts(filter: ProductQueryFilter) {
    const page = Math.max(1, Number(filter.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(filter.limit) || 24));
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {
      deletedAt: null,
    };

    // Filter by active status by default unless admin queries
    if (filter.status) {
      where.status = filter.status;
    } else {
      where.status = 'ACTIVE';
    }

    if (filter.search) {
      const searchTerms = filter.search.trim();
      where.OR = [
        { name: { contains: searchTerms, mode: 'insensitive' } },
        { sku: { contains: searchTerms, mode: 'insensitive' } },
        { description: { contains: searchTerms, mode: 'insensitive' } },
        { material: { contains: searchTerms, mode: 'insensitive' } },
        { fabric: { contains: searchTerms, mode: 'insensitive' } },
        { brand: { name: { contains: searchTerms, mode: 'insensitive' } } },
        { category: { name: { contains: searchTerms, mode: 'insensitive' } } },
      ];
    }

    if (filter.categoryId) {
      where.categoryId = filter.categoryId;
    } else if (filter.categorySlug) {
      where.category = { slug: filter.categorySlug };
    }

    if (filter.subCategoryId) {
      where.subCategoryId = filter.subCategoryId;
    } else if (filter.subCategorySlug) {
      where.subCategory = { slug: filter.subCategorySlug };
    }

    if (filter.brandId) {
      where.brandId = filter.brandId;
    } else if (filter.brandSlug) {
      where.brand = { slug: filter.brandSlug };
    }

    if (filter.collectionSlug) {
      where.collections = {
        some: {
          collection: { slug: filter.collectionSlug },
        },
      };
    }

    // Price range filters
    if (filter.minPrice !== undefined || filter.maxPrice !== undefined) {
      where.basePrice = {};
      if (filter.minPrice !== undefined) {
        where.basePrice.gte = filter.minPrice;
      }
      if (filter.maxPrice !== undefined) {
        where.basePrice.lte = filter.maxPrice;
      }
    }

    // Rating filter
    if (filter.minRating !== undefined) {
      where.averageRating = { gte: filter.minRating };
    }

    // Specific menswear attributes
    if (filter.material) {
      where.material = { contains: filter.material, mode: 'insensitive' };
    }
    if (filter.fabric) {
      where.fabric = { contains: filter.fabric, mode: 'insensitive' };
    }
    if (filter.fit) {
      where.fit = { contains: filter.fit, mode: 'insensitive' };
    }
    if (filter.gender) {
      where.gender = filter.gender;
    }

    // Flag filters
    if (filter.isFeatured !== undefined) where.isFeatured = filter.isFeatured;
    if (filter.isNewArrival !== undefined) where.isNewArrival = filter.isNewArrival;
    if (filter.isBestSeller !== undefined) where.isBestSeller = filter.isBestSeller;

    // Variant attributes (Size, Color, Stock)
    if (filter.size || filter.color || filter.inStock) {
      where.variants = {
        some: {
          ...(filter.size ? { size: filter.size } : {}),
          ...(filter.color ? { colorName: { contains: filter.color, mode: 'insensitive' } } : {}),
          ...(filter.inStock ? { inventory: { quantity: { gt: 0 } } } : {}),
        },
      };
    }

    // Sorting order
    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' };
    if (filter.sortBy === 'price_asc') {
      orderBy = { basePrice: 'asc' };
    } else if (filter.sortBy === 'price_desc') {
      orderBy = { basePrice: 'desc' };
    } else if (filter.sortBy === 'popular') {
      orderBy = { viewCount: 'desc' };
    } else if (filter.sortBy === 'rating') {
      orderBy = { averageRating: 'desc' };
    } else if (filter.sortBy === 'discount') {
      orderBy = { discountPrice: 'desc' };
    } else if (filter.sortBy === 'name_asc') {
      orderBy = { name: 'asc' };
    }

    const [total, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          brand: { select: { id: true, name: true, slug: true, logoUrl: true } },
          category: { select: { id: true, name: true, slug: true } },
          subCategory: { select: { id: true, name: true, slug: true } },
          images: {
            orderBy: [{ isPrimary: 'desc' }, { displayOrder: 'asc' }],
          },
          variants: {
            include: {
              inventory: true,
            },
          },
        },
      }),
    ]);

    return {
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get single product by slug with complete details, related items, and reviews
   */
  async getProductBySlug(slug: string) {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        brand: true,
        category: true,
        subCategory: true,
        images: {
          orderBy: [{ isPrimary: 'desc' }, { displayOrder: 'asc' }],
        },
        variants: {
          include: {
            inventory: true,
          },
        },
        attributes: true,
        reviews: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: {
            user: {
              select: { firstName: true, lastName: true, avatar: true },
            },
          },
        },
        collections: {
          include: {
            collection: true,
          },
        },
      },
    });

    if (!product || product.deletedAt) {
      throw new NotFoundError('Product not found in luxury catalog');
    }

    // Increment view count asynchronously
    prisma.product
      .update({
        where: { id: product.id },
        data: { viewCount: { increment: 1 } },
      })
      .catch((err) => logger.warn('Failed to increment view count', err));

    // Fetch related products in the same category
    const relatedProducts = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id },
        status: 'ACTIVE',
        deletedAt: null,
      },
      take: 4,
      include: {
        brand: true,
        images: {
          where: { isPrimary: true },
        },
        variants: {
          include: { inventory: true },
        },
      },
    });

    return {
      ...product,
      relatedProducts,
    };
  }

  /**
   * Get product by ID
   */
  async getProductById(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        brand: true,
        category: true,
        subCategory: true,
        images: { orderBy: [{ isPrimary: 'desc' }, { displayOrder: 'asc' }] },
        variants: { include: { inventory: true } },
        attributes: true,
        collections: { include: { collection: true } },
      },
    });

    if (!product || product.deletedAt) {
      throw new NotFoundError('Product not found');
    }

    return product;
  }

  /**
   * Create a new product with variants, inventory, and images
   */
  async createProduct(input: CreateProductInput) {
    let baseSlug = this.generateSlug(input.name);
    let uniqueSlug = baseSlug;
    let counter = 1;

    while (await prisma.product.findUnique({ where: { slug: uniqueSlug } })) {
      uniqueSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    const existingSku = await prisma.product.findUnique({
      where: { sku: input.sku },
    });

    if (existingSku) {
      throw new ConflictError(`A product with SKU ${input.sku} already exists`);
    }

    return prisma.$transaction(async (tx) => {
      const product = await tx.product.create({
        data: {
          name: input.name,
          slug: uniqueSlug,
          sku: input.sku,
          description: input.description,
          summary: input.summary,
          brandId: input.brandId,
          categoryId: input.categoryId,
          subCategoryId: input.subCategoryId,
          basePrice: new Prisma.Decimal(input.basePrice),
          discountPrice: input.discountPrice ? new Prisma.Decimal(input.discountPrice) : null,
          taxRate: input.taxRate !== undefined ? new Prisma.Decimal(input.taxRate) : new Prisma.Decimal(0),
          gender: input.gender || 'MEN',
          material: input.material,
          fabric: input.fabric,
          pattern: input.pattern,
          fit: input.fit,
          style: input.style,
          careInstructions: input.careInstructions,
          isFeatured: input.isFeatured || false,
          isNewArrival: input.isNewArrival !== undefined ? input.isNewArrival : true,
          isBestSeller: input.isBestSeller || false,
          status: input.status || 'ACTIVE',
        },
      });

      // Insert images
      if (input.images && input.images.length > 0) {
        await tx.productImage.createMany({
          data: input.images.map((img, index) => ({
            productId: product.id,
            imageUrl: img.imageUrl,
            altText: img.altText || `${input.name} Image ${index + 1}`,
            isPrimary: img.isPrimary || index === 0,
            displayOrder: img.displayOrder || index,
          })),
        });
      }

      // Insert attributes
      if (input.attributes && input.attributes.length > 0) {
        await tx.productAttribute.createMany({
          data: input.attributes.map((attr) => ({
            productId: product.id,
            name: attr.name,
            value: attr.value,
          })),
        });
      }

      // Insert variants with inventory
      if (input.variants && input.variants.length > 0) {
        for (const variantData of input.variants) {
          const variant = await tx.productVariant.create({
            data: {
              productId: product.id,
              sku: variantData.sku,
              size: variantData.size,
              colorName: variantData.colorName,
              colorHex: variantData.colorHex,
              priceAdjustment: variantData.priceAdjustment
                ? new Prisma.Decimal(variantData.priceAdjustment)
                : new Prisma.Decimal(0),
            },
          });

          await tx.inventory.create({
            data: {
              variantId: variant.id,
              quantity: variantData.stockQuantity || 0,
              lowStockThreshold: variantData.lowStockThreshold || 5,
              warehouseLocation: variantData.warehouseLocation || 'Main Hub 1',
            },
          });
        }
      }

      // Link collections
      if (input.collectionIds && input.collectionIds.length > 0) {
        await tx.collectionProduct.createMany({
          data: input.collectionIds.map((colId) => ({
            collectionId: colId,
            productId: product.id,
          })),
        });
      }

      logger.info(`Product created: ${product.name} (${product.id})`);
      return product;
    });
  }

  /**
   * Update product details
   */
  async updateProduct(id: string, input: UpdateProductInput) {
    const existing = await prisma.product.findUnique({
      where: { id },
    });

    if (!existing || existing.deletedAt) {
      throw new NotFoundError('Product not found');
    }

    return prisma.$transaction(async (tx) => {
      const dataToUpdate: any = {};

      if (input.name !== undefined) dataToUpdate.name = input.name;
      if (input.description !== undefined) dataToUpdate.description = input.description;
      if (input.summary !== undefined) dataToUpdate.summary = input.summary;
      if (input.brandId !== undefined) dataToUpdate.brandId = input.brandId;
      if (input.categoryId !== undefined) dataToUpdate.categoryId = input.categoryId;
      if (input.subCategoryId !== undefined) dataToUpdate.subCategoryId = input.subCategoryId;
      if (input.basePrice !== undefined) dataToUpdate.basePrice = new Prisma.Decimal(input.basePrice);
      if (input.discountPrice !== undefined)
        dataToUpdate.discountPrice = input.discountPrice ? new Prisma.Decimal(input.discountPrice) : null;
      if (input.taxRate !== undefined) dataToUpdate.taxRate = new Prisma.Decimal(input.taxRate);
      if (input.gender !== undefined) dataToUpdate.gender = input.gender;
      if (input.material !== undefined) dataToUpdate.material = input.material;
      if (input.fabric !== undefined) dataToUpdate.fabric = input.fabric;
      if (input.pattern !== undefined) dataToUpdate.pattern = input.pattern;
      if (input.fit !== undefined) dataToUpdate.fit = input.fit;
      if (input.style !== undefined) dataToUpdate.style = input.style;
      if (input.careInstructions !== undefined) dataToUpdate.careInstructions = input.careInstructions;
      if (input.isFeatured !== undefined) dataToUpdate.isFeatured = input.isFeatured;
      if (input.isNewArrival !== undefined) dataToUpdate.isNewArrival = input.isNewArrival;
      if (input.isBestSeller !== undefined) dataToUpdate.isBestSeller = input.isBestSeller;
      if (input.status !== undefined) dataToUpdate.status = input.status;

      const updated = await tx.product.update({
        where: { id },
        data: dataToUpdate,
      });

      logger.info(`Product updated: ${id}`);
      return updated;
    });
  }

  /**
   * Soft-delete product
   */
  async deleteProduct(id: string) {
    const existing = await prisma.product.findUnique({
      where: { id },
    });

    if (!existing || existing.deletedAt) {
      throw new NotFoundError('Product not found');
    }

    await prisma.product.update({
      where: { id },
      data: { deletedAt: new Date(), status: 'ARCHIVED' },
    });

    logger.info(`Product soft-deleted: ${id}`);
    return { success: true, message: 'Product archived successfully' };
  }
}

export const productService = new ProductService();
