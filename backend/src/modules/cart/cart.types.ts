export interface AddCartItemInput {
  productId: string;
  variantId: string;
  quantity: number;
}

export interface UpdateCartItemInput {
  quantity: number;
}

export interface CartCalculationResult {
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
