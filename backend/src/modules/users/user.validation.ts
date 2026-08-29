import { z } from 'zod';

export const updateProfileSchema = z.object({
  body: z.object({
    firstName: z.string().min(2).optional(),
    lastName: z.string().min(2).optional(),
    phone: z.string().optional(),
    avatar: z.string().url().optional().or(z.literal('')),
    dateOfBirth: z.string().datetime().optional().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).optional(),
  }),
});

export const adminUpdateUserStatusSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']),
    role: z.enum(['CUSTOMER', 'ADMIN']).optional(),
  }),
});
