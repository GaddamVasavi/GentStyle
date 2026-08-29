import { apiClient } from './api';
import { Product } from '../types/product.types';

export interface ProductQuery {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  categorySlug?: string;
  subCategorySlug?: string;
  brandSlug?: string;
  collectionSlug?: string;
  minPrice?: number;
  maxPrice?: number;
  size?: string;
  color?: string;
  material?: string;
  fabric?: string;
  fit?: string;
  gender?: string;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  minRating?: number;
  inStock?: boolean;
  sortBy?: string;
}

export const productService = {
  async getProducts(params: ProductQuery = {}) {
    const res = await apiClient.get('/products', { params });
    return res.data;
  },

  async getProductBySlug(slug: string): Promise<{ data: Product }> {
    const res = await apiClient.get(`/products/slug/${slug}`);
    return res.data;
  },

  async getProductById(id: string): Promise<{ data: Product }> {
    const res = await apiClient.get(`/products/${id}`);
    return res.data;
  },

  async createProduct(data: any) {
    const res = await apiClient.post('/products', data);
    return res.data;
  },

  async updateProduct(id: string, data: any) {
    const res = await apiClient.put(`/products/${id}`, data);
    return res.data;
  },

  async deleteProduct(id: string) {
    const res = await apiClient.delete(`/products/${id}`);
    return res.data;
  },
};
