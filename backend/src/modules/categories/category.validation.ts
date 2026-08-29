import { z } from 'zod';

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Category name is required'),
    description: z.string().optional(),
    imageUrl: z.string().url().optional(),
    isFeatured: z.boolean().optional().default(false),
  }),
});

export const createSubCategorySchema = z.object({
  body: z.object({
    categoryId: z.string().uuid('Valid Category ID is required'),
    name: z.string().min(2, 'Subcategory name is required'),
    description: z.string().optional(),
    imageUrl: z.string().url().optional(),
  }),
});
