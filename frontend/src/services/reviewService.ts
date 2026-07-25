import api from './api';
import type { Review, ApiResponse, PaginatedResponse } from '../types';

export const reviewService = {
  async getProductReviews(productId: string, params?: { page?: number; limit?: number }) {
    const response = await api.get<PaginatedResponse<Review>>(`/reviews/product/${productId}`, { params });
    return response.data;
  },

  async createReview(data: { product: string; rating: number; title: string; comment: string }) {
    const response = await api.post<ApiResponse<Review>>('/reviews', data);
    return response.data;
  },

  async updateReview(id: string, data: { rating?: number; title?: string; comment?: string }) {
    const response = await api.put<ApiResponse<Review>>(`/reviews/${id}`, data);
    return response.data;
  },

  async deleteReview(id: string) {
    const response = await api.delete<ApiResponse<null>>(`/reviews/${id}`);
    return response.data;
  },

  async markHelpful(id: string) {
    const response = await api.put<ApiResponse<Review>>(`/reviews/${id}/helpful`);
    return response.data;
  },
};
