import api from './api';
import type { ApiResponse } from '../types';

export const newsletterService = {
  async subscribe(email: string) {
    const response = await api.post<ApiResponse<{ message: string }>>('/newsletter/subscribe', { email });
    return response.data;
  },

  async unsubscribe(email: string) {
    const response = await api.post<ApiResponse<{ message: string }>>('/newsletter/unsubscribe', { email });
    return response.data;
  },
};
