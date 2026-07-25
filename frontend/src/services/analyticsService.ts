import api from './api';
import type { ApiResponse } from '../types';

export interface DashboardData {
  todayOrders: number;
  todayRevenue: number;
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  lowStockCount: number;
  pendingOrders: number;
  revenueByDay: Array<{ date: string; revenue: number; orders: number }>;
  ordersByMonth: Array<{ month: string; count: number }>;
  recentOrders: Array<{
    _id: string;
    user?: { name: string; email: string };
    guestInfo?: { name: string; email?: string; phone?: string };
    orderItems: Array<{ name: string; quantity: number; price: number; image: string }>;
    total: number;
    status: string;
    orderStatus: string;
    createdAt: string;
    isGuestOrder: boolean;
  }>;
  topProducts: Array<{
    _id: string;
    name: string;
    slug: string;
    totalSales: number;
    price: number;
    images: string[];
  }>;
  latestReviews: Array<{
    _id: string;
    user: { name: string; avatar?: string };
    product: { name: string; slug: string };
    rating: number;
    title: string;
    comment: string;
    isApproved: boolean;
    createdAt: string;
  }>;
  lowStockProducts: Array<{
    _id: string;
    name: string;
    slug: string;
    stock: number;
    lowStockThreshold: number;
    images: string[];
  }>;
}

export const analyticsService = {
  async getDashboard(params?: { startDate?: string; endDate?: string }) {
    const response = await api.get<ApiResponse<DashboardData>>('/analytics/dashboard', { params });
    return response.data;
  },
};
