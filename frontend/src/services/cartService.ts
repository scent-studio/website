import api from './api';
import type { ApiResponse } from '../types';

interface CartResponse {
  _id: string;
  user: string;
  items: Array<{
    product: {
      _id: string;
      name: string;
      price: number;
      images: string[];
      slug: string;
      inStock: boolean;
      stockQuantity: number;
    };
    quantity: number;
    size?: string;
  }>;
  totalQuantity: number;
  totalPrice: number;
  coupon?: {
    code: string;
    discount: number;
    discountType: 'percentage' | 'fixed';
  };
  discount: number;
  shipping: number;
}

export const cartService = {
  async getCart() {
    const response = await api.get<ApiResponse<CartResponse>>('/cart');
    return response.data;
  },

  async addToCart(data: { product: string; quantity: number; size?: string }) {
    const response = await api.post<ApiResponse<CartResponse>>('/cart', data);
    return response.data;
  },

  async updateCartItem(itemId: string, data: { quantity: number; size?: string }) {
    const response = await api.put<ApiResponse<CartResponse>>(`/cart/${itemId}`, data);
    return response.data;
  },

  async removeFromCart(itemId: string) {
    const response = await api.delete<ApiResponse<CartResponse>>(`/cart/${itemId}`);
    return response.data;
  },

  async clearCart() {
    const response = await api.delete<ApiResponse<null>>('/cart');
    return response.data;
  },
};
