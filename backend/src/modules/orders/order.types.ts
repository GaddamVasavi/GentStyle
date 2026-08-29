export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'TAILORING'
  | 'QUALITY_CHECK'
  | 'PACKED'
  | 'SHIPPED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED'
  | 'RETURNED'
  | 'EXCHANGED';

export type PaymentMethod = 'STRIPE' | 'RAZORPAY' | 'CASH_ON_DELIVERY';

export interface CreateOrderInput {
  shippingAddressId: string;
  billingAddressId?: string;
  paymentMethod: PaymentMethod;
  couponCode?: string;
  specialInstructions?: string;
}

export interface UpdateOrderStatusInput {
  status: OrderStatus;
  notes?: string;
  carrierTrackingNumber?: string;
  carrierName?: string;
}

export interface OrderQueryFilter {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  startDate?: string;
  endDate?: string;
  search?: string;
  userId?: string;
}
