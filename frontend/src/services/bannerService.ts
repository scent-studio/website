import api from './api';
import type { Banner, ApiResponse, PaginatedResponse } from '../types';

export const bannerService = {
  async getAll(params?: { page?: number; limit?: number; isActive?: boolean }) {
    const response = await api.get<PaginatedResponse<Banner>>('/banners', { params });
    return response.data;
  },

  async getActive() {
    const response = await api.get<ApiResponse<Banner[]>>('/banners/active');
    return response.data;
  },

  async getById(id: string) {
    const response = await api.get<ApiResponse<Banner>>(`/banners/${id}`);
    return response.data;
  },

  async create(data: FormData | Partial<Banner>) {
    const response = await api.post<ApiResponse<Banner>>('/banners', data, {
      headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
    });
    return response.data;
  },

  async update(id: string, data: FormData | Partial<Banner>) {
    const response = await api.put<ApiResponse<Banner>>(`/banners/${id}`, data, {
      headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
    });
    return response.data;
  },

  async delete(id: string) {
    const response = await api.delete<ApiResponse<null>>(`/banners/${id}`);
    return response.data;
  },
};
