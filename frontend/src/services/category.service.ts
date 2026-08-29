import { apiClient } from './api';

export const categoryService = {
  async getCategories() {
    const res = await apiClient.get('/categories');
    return res.data;
  },

  async getCategoryBySlug(slug: string) {
    const res = await apiClient.get(`/categories/${slug}`);
    return res.data;
  },

  async getBrands() {
    const res = await apiClient.get('/brands');
    return res.data;
  },

  async getBrandBySlug(slug: string) {
    const res = await apiClient.get(`/brands/${slug}`);
    return res.data;
  },

  async getCollections() {
    const res = await apiClient.get('/collections');
    return res.data;
  },

  async getCollectionBySlug(slug: string) {
    const res = await apiClient.get(`/collections/${slug}`);
    return res.data;
  },
};
