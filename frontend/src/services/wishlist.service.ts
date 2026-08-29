import { apiClient } from './api';

export const wishlistService = {
  async getWishlist() {
    const res = await apiClient.get('/wishlist');
    return res.data;
  },

  async addToWishlist(productId: string) {
    const res = await apiClient.post('/wishlist', { productId });
    return res.data;
  },

  async removeFromWishlist(productId: string) {
    const res = await apiClient.delete(`/wishlist/${productId}`);
    return res.data;
  },
};
