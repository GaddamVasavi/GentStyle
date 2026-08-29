import { Address } from './auth.types';
import { Product } from './product.types';

export type OrderStatus =
  | 'PENDING_PAYMENT'
  | 'PAYMENT_CONFIRMED'
  | 'PROCESSING_TAILORING'
  | 'QUALITY_INSPECTION'
  | 'PACKED'
  | 'DISPATCHED_CARRIER'
  | 'IN_TRANSIT'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'RETURN_REQUESTED'
  | 'RETURNED'
  | 'EXCHANGED';

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  variantId: string;
  productName: string;
  sku: string;
  size: string;
  color: string;
  quantity: number;
  unitPrice: number | string;
  totalPrice: number | string;
  product?: Product;
}

export interface Shipment {
  id: string;
  orderId: string;
  carrier: string;
  trackingNumber: string;
  status: string;
  estimatedDelivery?: string | null;
  shippedAt?: string | null;
  deliveredAt?: string | null;
}

export interface Invoice {
  id: string;
  orderId: string;
  invoiceNumber: string;
  amount: number | string;
  taxAmount: number | string;
  status: string;
  issuedAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  shippingAddressId: string;
  shippingAddress: Address;
  billingAddressId?: string | null;
  billingAddress?: Address | null;
  subtotal: number | string;
  discountAmount: number | string;
  shippingAmount: number | string;
  taxAmount: number | string;
  totalAmount: number | string;
  status: OrderStatus;
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  items: OrderItem[];
  shipments?: Shipment[];
  invoices?: Invoice[];
  createdAt: string;
}
