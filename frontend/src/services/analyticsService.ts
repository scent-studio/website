import api from './api';
import type { ApiResponse } from '../types';

export interface AnalyticsData {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  revenueByDay: Array<{ date: string; revenue: number }>;
  ordersByStatus: Array<{ status: string; count: number }>;
  topProducts: Array<{ _id: string; name: string; soldCount: number; revenue: number }>;
  salesByCategory: Array<{ _id: string; name: string; sales: number; revenue: number }>;
  recentOrders: Array<{ _id: string; total: number; status: string; createdAt: string }>;
}

export const analyticsService = {
  async getDashboard(params?: { startDate?: string; endDate?: string }) {
    const response = await api.get<ApiResponse<AnalyticsData>>('/analytics/dashboard', { params });
    return response.data;
  },

  async getRevenue(params?: { startDate?: string; endDate?: string; groupBy?: 'day' | 'week' | 'month' }) {
    const response = await api.get<ApiResponse<{ data: Array<{ date: string; revenue: number }> }>>('/analytics/revenue', { params });
    return response.data;
  },

  async getTopProducts(params?: { limit?: number; startDate?: string; endDate?: string }) {
    const response = await api.get<ApiResponse<AnalyticsData['topProducts']>>('/analytics/top-products', { params });
    return response.data;
  },

  async getSalesByCategory(params?: { startDate?: string; endDate?: string }) {
    const response = await api.get<ApiResponse<AnalyticsData['salesByCategory']>>('/analytics/sales-by-category', { params });
    return response.data;
  },
};
