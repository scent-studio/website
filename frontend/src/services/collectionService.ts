import api from './api';
import type { ApiResponse, PaginatedResponse, Collection } from '../types';

export const collectionService = {
  async getAll(params?: { isActive?: boolean }) {
    const response = await api.get<PaginatedResponse<Collection>>('/collections', { params });
    return response.data;
  },

  async getBySlug(slug: string) {
    const response = await api.get<ApiResponse<Collection>>(`/collections/slug/${slug}`);
    return response.data;
  },

  async getById(id: string) {
    const response = await api.get<ApiResponse<Collection>>(`/collections/${id}`);
    return response.data;
  },

  async getActive() {
    const response = await api.get<ApiResponse<Collection[]>>('/collections/active');
    return response.data;
  },

  async create(data: Partial<Collection>) {
    const response = await api.post<ApiResponse<Collection>>('/collections', data);
    return response.data;
  },

  async update(id: string, data: Partial<Collection>) {
    const response = await api.put<ApiResponse<Collection>>(`/collections/${id}`, data);
    return response.data;
  },

  async remove(id: string) {
    const response = await api.delete<ApiResponse<null>>(`/collections/${id}`);
    return response.data;
  },
};
