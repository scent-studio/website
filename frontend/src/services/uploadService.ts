import api from './api';

export const uploadService = {
  uploadImages: async (files: File[]): Promise<string[]> => {
    const formData = new FormData();
    files.forEach((file) => formData.append('images', file));
    const res = await api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data.urls;
  },

  uploadBanner: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);
    const res = await api.post('/upload/banner', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data.url;
  },
};
