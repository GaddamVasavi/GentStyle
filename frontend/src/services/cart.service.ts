import { apiClient } from './api';

export const cartService = {
  async getCart() {
    const res = await apiClient.get('/cart');
    return res.data;
  },

  async addItem(data: { productId: string; variantId: string; quantity: number }) {
    const res = await apiClient.post('/cart/items', data);
    return res.data;
  },

  async updateQuantity(itemId: string, quantity: number) {
    const res = await apiClient.put(`/cart/items/${itemId}`, { quantity });
    return res.data;
  },

  async removeItem(itemId: string) {
    const res = await apiClient.delete(`/cart/items/${itemId}`);
    return res.data;
  },

  async clearCart() {
    const res = await apiClient.delete('/cart');
    return res.data;
  },
};
