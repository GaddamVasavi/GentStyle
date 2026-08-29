import { apiClient } from './api';

export interface PlaceOrderPayload {
  shippingAddressId: string;
  billingAddressId?: string;
  paymentMethod: 'STRIPE' | 'RAZORPAY' | 'CASH_ON_DELIVERY';
  couponCode?: string;
  specialInstructions?: string;
}

export const orderService = {
  async placeOrder(payload: PlaceOrderPayload) {
    const res = await apiClient.post('/orders', payload);
    return res.data;
  },

  async getUserOrders(page: number = 1, limit: number = 10) {
    const res = await apiClient.get('/orders/my-orders', { params: { page, limit } });
    return res.data;
  },

  async getOrderDetails(id: string) {
    const res = await apiClient.get(`/orders/${id}`);
    return res.data;
  },

  async submitReturn(payload: {
    orderId: string;
    orderItemId: string;
    reason: string;
    comments?: string;
    type: 'RETURN' | 'EXCHANGE';
    desiredVariantId?: string;
  }) {
    const res = await apiClient.post('/returns', payload);
    return res.data;
  },

  async getInvoice(orderId: string) {
    const res = await apiClient.get(`/invoices/order/${orderId}`);
    return res.data;
  },
};
