import { apiClient } from './api';

export interface UpdateProfileDto {
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
  dateOfBirth?: string;
}

export const userService = {
  async getProfile() {
    const res = await apiClient.get('/users/profile');
    return res.data;
  },

  async updateProfile(data: UpdateProfileDto) {
    const res = await apiClient.put('/users/profile', data);
    return res.data;
  },

  async getLoginHistory() {
    const res = await apiClient.get('/users/login-history');
    return res.data;
  },
};
