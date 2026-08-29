import { apiClient } from './api';

export interface AddressDto {
  fullName: string;
  phone: string;
  streetAddress1: string;
  streetAddress2?: string;
  city: string;
  state: string;
  postalCode: string;
  country?: string;
  isDefaultShipping?: boolean;
  isDefaultBilling?: boolean;
}

export const addressService = {
  async getAddresses() {
    const res = await apiClient.get('/addresses');
    return res.data;
  },

  async createAddress(data: AddressDto) {
    const res = await apiClient.post('/addresses', data);
    return res.data;
  },

  async updateAddress(id: string, data: Partial<AddressDto>) {
    const res = await apiClient.put(`/addresses/${id}`, data);
    return res.data;
  },

  async setDefaultShipping(id: string) {
    const res = await apiClient.patch(`/addresses/${id}/default-shipping`);
    return res.data;
  },

  async setDefaultBilling(id: string) {
    const res = await apiClient.patch(`/addresses/${id}/default-billing`);
    return res.data;
  },

  async deleteAddress(id: string) {
    const res = await apiClient.delete(`/addresses/${id}`);
    return res.data;
  },
};
