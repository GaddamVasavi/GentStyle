import { z } from 'zod';

export const productVariantSchema = z.object({
  id: z.string().uuid().optional(),
  sku: z.string().min(2, 'SKU is required'),
  size: z.string().min(1, 'Size is required'),
  colorName: z.string().min(1, 'Color name is required'),
  colorHex: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Valid HEX color required'),
  priceAdjustment: z.number().optional().default(0),
  stockQuantity: z.number().int().min(0).optional().default(0),
  lowStockThreshold: z.number().int().min(0).optional().default(5),
  warehouseLocation: z.string().optional(),
});

export const productAttributeSchema = z.object({
  name: z.string().min(1),
  value: z.string().min(1),
});

export const productImageSchema = z.object({
  imageUrl: z.string().url('Valid image URL required'),
  altText: z.string().optional(),
  isPrimary: z.boolean().optional().default(false),
  displayOrder: z.number().int().optional().default(0),
});

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Product name must be at least 2 characters'),
    sku: z.string().min(2, 'Product SKU is required'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    summary: z.string().optional(),
    brandId: z.string().uuid('Valid Brand ID is required'),
    categoryId: z.string().uuid('Valid Category ID is required'),
    subCategoryId: z.string().uuid().optional(),
    basePrice: z.number().positive('Price must be greater than 0'),
    discountPrice: z.number().positive().optional(),
    taxRate: z.number().min(0).optional().default(0),
    gender: z.enum(['MEN', 'UNISEX']).optional().default('MEN'),
    material: z.string().optional(),
    fabric: z.string().optional(),
    pattern: z.string().optional(),
    fit: z.string().optional(),
    style: z.string().optional(),
    careInstructions: z.string().optional(),
    isFeatured: z.boolean().optional().default(false),
    isNewArrival: z.boolean().optional().default(true),
    isBestSeller: z.boolean().optional().default(false),
    status: z.enum(['DRAFT', 'ACTIVE', 'ARCHIVED', 'OUT_OF_STOCK']).optional().default('ACTIVE'),
    images: z.array(productImageSchema).optional(),
    variants: z.array(productVariantSchema).optional(),
    attributes: z.array(productAttributeSchema).optional(),
    collectionIds: z.array(z.string().uuid()).optional(),
  }),
});

export const updateProductSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: createProductSchema.shape.body.partial(),
});

export const productIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const productSlugParamSchema = z.object({
  params: z.object({
    slug: z.string().min(1),
  }),
});
