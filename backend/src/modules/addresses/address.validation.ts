import { z } from 'zod';

export const createAddressSchema = z.object({
  body: z.object({
    fullName: z.string().min(2, 'Full name is required'),
    phone: z.string().min(6, 'Valid phone number is required'),
    streetAddress1: z.string().min(5, 'Street address is required'),
    streetAddress2: z.string().optional(),
    city: z.string().min(2, 'City is required'),
    state: z.string().min(2, 'State/Province is required'),
    postalCode: z.string().min(3, 'Postal code is required'),
    country: z.string().default('United States'),
    isDefaultShipping: z.boolean().optional().default(false),
    isDefaultBilling: z.boolean().optional().default(false),
  }),
});

export const updateAddressSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: createAddressSchema.shape.body.partial(),
});

export const addressIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});
