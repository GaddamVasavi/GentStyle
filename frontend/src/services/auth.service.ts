import { apiClient } from './api';

export interface RegisterDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export const authService = {
  async register(data: RegisterDto) {
    const res = await apiClient.post('/auth/register', data);
    return res.data;
  },

  async login(data: LoginDto) {
    const res = await apiClient.post('/auth/login', data);
    return res.data;
  },

  async logout() {
    const res = await apiClient.post('/auth/logout');
    return res.data;
  },

  async getMe() {
    const res = await apiClient.get('/auth/me');
    return res.data;
  },

  async forgotPassword(email: string) {
    const res = await apiClient.post('/auth/forgot-password', { email });
    return res.data;
  },

  async resetPassword(token: string, newPassword: string) {
    const res = await apiClient.post('/auth/reset-password', { token, newPassword });
    return res.data;
  },

  async changePassword(currentPassword: string, newPassword: string) {
    const res = await apiClient.post('/auth/change-password', { currentPassword, newPassword });
    return res.data;
  },
};
