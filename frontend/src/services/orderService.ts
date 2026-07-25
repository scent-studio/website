import api from './api';
import type { Order, ApiResponse, PaginatedResponse, CreateOrderPayload, OrderStatus } from '../types';

export const orderService = {
  async createOrder(data: CreateOrderPayload) {
    const response = await api.post<ApiResponse<Order>>('/orders', data);
    return response.data;
  },

  async getOrders(params?: { page?: number; limit?: number; status?: OrderStatus }) {
    const response = await api.get<PaginatedResponse<Order>>('/orders/my-orders', { params });
    return response.data;
  },

  async getOrder(id: string) {
    const response = await api.get<ApiResponse<Order>>(`/orders/${id}`);
    return response.data;
  },

  async cancelOrder(id: string) {
    const response = await api.put<ApiResponse<Order>>(`/orders/${id}/cancel`);
    return response.data;
  },

  async adminGetOrders(params?: { page?: number; limit?: number; status?: OrderStatus; search?: string }) {
    const response = await api.get<PaginatedResponse<Order>>('/orders', { params });
    return response.data;
  },

  async adminUpdateOrderStatus(id: string, status: OrderStatus) {
    const response = await api.put<ApiResponse<Order>>(`/orders/${id}/status`, { status });
    return response.data;
  },

  async adminUpdatePaymentStatus(id: string, paymentStatus: string) {
    const response = await api.put<ApiResponse<Order>>(`/orders/${id}/payment`, { paymentStatus });
    return response.data;
  },

  async claimGuestOrders() {
    const response = await api.post<ApiResponse<{ claimed: number }>>('/orders/claim');
    return response.data;
  },
};
