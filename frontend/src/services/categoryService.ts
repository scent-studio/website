import api from './api';
import type { Category, ApiResponse, PaginatedResponse } from '../types';

export const categoryService = {
  async getAll(params?: { page?: number; limit?: number; isActive?: boolean }) {
    const response = await api.get<PaginatedResponse<Category>>('/categories', { params });
    return response.data;
  },

  async getBySlug(slug: string) {
    const response = await api.get<ApiResponse<Category>>(`/categories/slug/${slug}`);
    return response.data;
  },

  async getById(id: string) {
    const response = await api.get<ApiResponse<Category>>(`/categories/${id}`);
    return response.data;
  },

  async create(data: FormData | Partial<Category>) {
    const response = await api.post<ApiResponse<Category>>('/categories', data, {
      headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
    });
    return response.data;
  },

  async update(id: string, data: FormData | Partial<Category>) {
    const response = await api.put<ApiResponse<Category>>(`/categories/${id}`, data, {
      headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
    });
    return response.data;
  },

  async delete(id: string) {
    const response = await api.delete<ApiResponse<null>>(`/categories/${id}`);
    return response.data;
  },
};
