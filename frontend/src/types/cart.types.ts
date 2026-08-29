import { Product, ProductVariant } from './product.types';

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  variantId: string;
  quantity: number;
  unitPrice: number | string;
  product: Product;
  variant: ProductVariant;
  createdAt: string;
}

export interface CartSummary {
  subtotal: number;
  taxTotal: number;
  shippingFee: number;
  discountTotal: number;
  grandTotal: number;
  itemCount: number;
  appliedCoupon?: {
    code: string;
    discountType: 'PERCENTAGE' | 'FIXED_AMOUNT';
    discountValue: number;
  } | null;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  summary?: CartSummary;
}
