import api from './api';
import type { Product, PaginatedResponse, ApiResponse, FilterState, SortOption } from '../types';

interface GetProductsParams {
  page?: number;
  limit?: number;
  sort?: SortOption;
  search?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  gender?: string;
  fragranceFamily?: string;
  inStock?: boolean;
  tags?: string;
  isFeatured?: boolean;
  isTrending?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  isGiftSet?: boolean;
}

export const productService = {
  async getProducts(params: GetProductsParams = {}) {
    const response = await api.get<PaginatedResponse<Product>>('/products', {
      params: {
        ...params,
        isFeatured: params.isFeatured ? 'true' : undefined,
        isTrending: params.isTrending ? 'true' : undefined,
        isBestSeller: params.isBestSeller ? 'true' : undefined,
        isNewArrival: params.isNewArrival ? 'true' : undefined,
        isGiftSet: params.isGiftSet ? 'true' : undefined,
      },
    });
    return response.data;
  },

  async getProduct(id: string) {
    const response = await api.get<ApiResponse<Product>>(`/products/${id}`);
    return response.data;
  },

  async getProductBySlug(slug: string) {
    const response = await api.get<ApiResponse<Product>>(`/products/slug/${slug}`);
    return response.data;
  },

  async getFeatured() {
    const response = await api.get<PaginatedResponse<Product>>('/products/featured');
    return response.data;
  },

  async getTrending() {
    const response = await api.get<PaginatedResponse<Product>>('/products/trending');
    return response.data;
  },

  async getBestSellers() {
    const response = await api.get<PaginatedResponse<Product>>('/products/best-sellers');
    return response.data;
  },

  async getNewArrivals() {
    const response = await api.get<PaginatedResponse<Product>>('/products/new-arrivals');
    return response.data;
  },

  async getRelated(productId: string) {
    const response = await api.get<ApiResponse<Product[]>>(`/products/${productId}/related`);
    return response.data;
  },

  async createProduct(data: FormData | Partial<Product>) {
    const response = await api.post<ApiResponse<Product>>('/products', data, {
      headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
    });
    return response.data;
  },

  async updateProduct(id: string, data: FormData | Partial<Product>) {
    const response = await api.put<ApiResponse<Product>>(`/products/${id}`, data, {
      headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
    });
    return response.data;
  },

  async deleteProduct(id: string) {
    const response = await api.delete<ApiResponse<null>>(`/products/${id}`);
    return response.data;
  },
};

export type { GetProductsParams };
