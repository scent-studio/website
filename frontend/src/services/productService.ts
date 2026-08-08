import api from './api';
import { getCached, setCached } from '../lib/apiCache';
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

const CACHE_TTL = 120000;

export const productService = {
  async getProducts(params: GetProductsParams = {}) {
    const query = {
      ...params,
      isFeatured: params.isFeatured ? 'true' : undefined,
      isTrending: params.isTrending ? 'true' : undefined,
      isBestSeller: params.isBestSeller ? 'true' : undefined,
      isNewArrival: params.isNewArrival ? 'true' : undefined,
      isGiftSet: params.isGiftSet ? 'true' : undefined,
    };
    const cacheKey = `products:${JSON.stringify(query)}`;
    const cached = getCached<PaginatedResponse<Product>>(cacheKey);
    if (cached) return cached;

    const response = await api.get<PaginatedResponse<Product>>('/products', { params: query });
    setCached(cacheKey, response.data, CACHE_TTL);
    return response.data;
  },

  async getHomeData() {
    const cacheKey = 'products:home';
    const cached = getCached<ApiResponse<HomeData>>(cacheKey);
    if (cached) return cached;

    const response = await api.get<ApiResponse<HomeData>>('/products/home');
    setCached(cacheKey, response.data, 5 * 60 * 1000);
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

  async search(q: string, limit = 8) {
    const response = await api.get<PaginatedResponse<Product>>('/products/search', {
      params: { q, limit },
    });
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

export interface HomeData {
  bundles: Product[];
  newArrivals: Product[];
  newArrivals100: Product[];
  bestSellers: Product[];
  women: Product[];
  men: Product[];
  unisex: Product[];
}

export type { GetProductsParams };
