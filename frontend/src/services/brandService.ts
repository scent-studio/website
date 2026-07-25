import api from './api';
import type { Brand, ApiResponse, PaginatedResponse } from '../types';

export const brandService = {
  async getAll(params?: { page?: number; limit?: number; isActive?: boolean }) {
    const response = await api.get<PaginatedResponse<Brand> | ApiResponse<Brand[]>>('/brands', { params });
    return response.data;
  },

  async getBySlug(slug: string) {
    const response = await api.get<ApiResponse<Brand>>(`/brands/slug/${slug}`);
    return response.data;
  },

  async getById(id: string) {
    const response = await api.get<ApiResponse<Brand>>(`/brands/${id}`);
    return response.data;
  },

  async create(data: FormData | Partial<Brand>) {
    const response = await api.post<ApiResponse<Brand>>('/brands', data, {
      headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
    });
    return response.data;
  },

  async update(id: string, data: FormData | Partial<Brand>) {
    const response = await api.put<ApiResponse<Brand>>(`/brands/${id}`, data, {
      headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
    });
    return response.data;
  },

  async delete(id: string) {
    const response = await api.delete<ApiResponse<null>>(`/brands/${id}`);
    return response.data;
  },
};
