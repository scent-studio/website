import api from './api';
import type { Blog, ApiResponse, PaginatedResponse } from '../types';

export const blogService = {
  async getAll(params?: { page?: number; limit?: number; tag?: string; category?: string; search?: string }) {
    const response = await api.get<PaginatedResponse<Blog>>('/blogs', { params });
    return response.data;
  },

  async getBySlug(slug: string) {
    const response = await api.get<ApiResponse<Blog>>(`/blogs/slug/${slug}`);
    return response.data;
  },

  async getById(id: string) {
    const response = await api.get<ApiResponse<Blog>>(`/blogs/${id}`);
    return response.data;
  },

  async create(data: FormData | Partial<Blog>) {
    const response = await api.post<ApiResponse<Blog>>('/blogs', data, {
      headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
    });
    return response.data;
  },

  async update(id: string, data: FormData | Partial<Blog>) {
    const response = await api.put<ApiResponse<Blog>>(`/blogs/${id}`, data, {
      headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
    });
    return response.data;
  },

  async delete(id: string) {
    const response = await api.delete<ApiResponse<null>>(`/blogs/${id}`);
    return response.data;
  },
};
