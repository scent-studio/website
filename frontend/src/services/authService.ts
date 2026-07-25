import api from './api';
import type { ApiResponse, User, LoginFormData, RegisterFormData } from '../types';

export const authService = {
  async register(data: RegisterFormData) {
    const response = await api.post<ApiResponse<{ user: User; token: string; refreshToken: string }>>('/auth/register', data);
    return response.data;
  },

  async login(data: LoginFormData) {
    const response = await api.post<ApiResponse<{ user: User; token: string; refreshToken: string }>>('/auth/login', data);
    return response.data;
  },

  async logout() {
    const response = await api.post<ApiResponse<null>>('/auth/logout');
    return response.data;
  },

  async getMe() {
    const response = await api.get<ApiResponse<User>>('/auth/me');
    return response.data;
  },

  async updateProfile(data: Partial<User>) {
    const response = await api.put<ApiResponse<User>>('/auth/update-profile', data);
    return response.data;
  },

  async updatePassword(data: { currentPassword: string; newPassword: string; passwordConfirm: string }) {
    const response = await api.put<ApiResponse<{ message: string }>>('/auth/update-password', data);
    return response.data;
  },

  async forgotPassword(email: string) {
    const response = await api.post<ApiResponse<{ message: string }>>('/auth/forgot-password', { email });
    return response.data;
  },

  async resetPassword(token: string, password: string, passwordConfirm: string) {
    const response = await api.put<ApiResponse<{ message: string }>>(`/auth/reset-password/${token}`, { password, passwordConfirm });
    return response.data;
  },

  async verifyEmail(token: string) {
    const response = await api.post<ApiResponse<{ message: string }>>(`/auth/verify-email/${token}`);
    return response.data;
  },
};
