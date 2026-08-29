import { z } from 'zod';

export const createOrderSchema = z.object({
  body: z.object({
    shippingAddressId: z.string().uuid('Valid Shipping Address ID is required'),
    billingAddressId: z.string().uuid().optional(),
    paymentMethod: z.enum(['STRIPE', 'RAZORPAY', 'CASH_ON_DELIVERY']),
    couponCode: z.string().optional(),
    specialInstructions: z.string().optional(),
  }),
});

export const updateOrderStatusSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    status: z.enum([
      'PENDING',
      'CONFIRMED',
      'PROCESSING',
      'TAILORING',
      'QUALITY_CHECK',
      'PACKED',
      'SHIPPED',
      'OUT_FOR_DELIVERY',
      'DELIVERED',
      'CANCELLED',
      'REFUNDED',
      'RETURNED',
      'EXCHANGED',
    ]),
    notes: z.string().optional(),
    carrierTrackingNumber: z.string().optional(),
    carrierName: z.string().optional(),
  }),
});

export const orderIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const orderNumberParamSchema = z.object({
  params: z.object({
    orderNumber: z.string().min(3),
  }),
});
