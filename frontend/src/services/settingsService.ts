import api from './api';
import type { Settings, ApiResponse } from '../types';

export const settingsService = {
  async get() {
    const response = await api.get<ApiResponse<Settings>>('/settings');
    return response.data;
  },

  async update(data: Partial<Settings>) {
    const response = await api.put<ApiResponse<Settings>>('/settings', data);
    return response.data;
  },
};
