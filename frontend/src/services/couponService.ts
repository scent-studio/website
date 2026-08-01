import api from './api';
import type { Coupon, ApiResponse } from '../types';

export const couponService = {
  async validate(code: string, orderAmount?: number) {
    const response = await api.post<ApiResponse<{ coupon: Coupon; discountAmount: number; finalAmount?: number }>>('/coupons/validate', {
      code,
      orderAmount,
    });
    return response.data;
  },

  async validateCoupon(code: string, orderAmount?: number) {
    return this.validate(code, orderAmount);
  },

  async getAll(params?: { page?: number; limit?: number; isActive?: boolean }) {
    const response = await api.get<ApiResponse<Coupon[]>>('/coupons', { params });
    return response.data;
  },

  async create(data: Partial<Coupon>) {
    const response = await api.post<ApiResponse<Coupon>>('/coupons', data);
    return response.data;
  },

  async update(id: string, data: Partial<Coupon>) {
    const response = await api.put<ApiResponse<Coupon>>(`/coupons/${id}`, data);
    return response.data;
  },

  async delete(id: string) {
    const response = await api.delete<ApiResponse<null>>(`/coupons/${id}`);
    return response.data;
  },
};
