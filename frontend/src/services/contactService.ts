import api from './api';
import type { ContactMessage, ApiResponse } from '../types';

export const contactService = {
  async submit(data: { name: string; email: string; phone?: string; subject: string; message: string }) {
    const response = await api.post<ApiResponse<ContactMessage>>('/contact', data);
    return response.data;
  },

  async getAll(params?: { page?: number; limit?: number; isRead?: boolean }) {
    const response = await api.get<ApiResponse<ContactMessage[]>>('/contact', { params });
    return response.data;
  },

  async markAsRead(id: string) {
    const response = await api.put<ApiResponse<ContactMessage>>(`/contact/${id}/read`);
    return response.data;
  },

  async delete(id: string) {
    const response = await api.delete<ApiResponse<null>>(`/contact/${id}`);
    return response.data;
  },
};
