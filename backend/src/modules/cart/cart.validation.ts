import { z } from 'zod';

export const addCartItemSchema = z.object({
  body: z.object({
    productId: z.string().uuid('Valid Product ID is required'),
    variantId: z.string().uuid('Valid Variant ID is required'),
    quantity: z.number().int().min(1, 'Quantity must be at least 1').max(10, 'Maximum 10 units per garment'),
  }),
});

export const updateCartItemSchema = z.object({
  params: z.object({
    itemId: z.string().uuid('Valid Cart Item ID is required'),
  }),
  body: z.object({
    quantity: z.number().int().min(1, 'Quantity must be at least 1').max(10, 'Maximum 10 units per garment'),
  }),
});

export const cartItemIdParamSchema = z.object({
  params: z.object({
    itemId: z.string().uuid('Valid Cart Item ID is required'),
  }),
});
