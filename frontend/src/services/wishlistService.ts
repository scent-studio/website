import api from './api';
import type { Wishlist, ApiResponse } from '../types';

export const wishlistService = {
  async getWishlist() {
    const response = await api.get<ApiResponse<Wishlist>>('/wishlist');
    return response.data;
  },

  async addToWishlist(productId: string) {
    const response = await api.post<ApiResponse<Wishlist>>('/wishlist/add', { productId });
    return response.data;
  },

  async removeFromWishlist(productId: string) {
    const response = await api.delete<ApiResponse<Wishlist>>(`/wishlist/product/${productId}`);
    return response.data;
  },

  async clearWishlist() {
    const response = await api.delete<ApiResponse<null>>('/wishlist');
    return response.data;
  },
};
