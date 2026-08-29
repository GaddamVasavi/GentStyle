import { apiClient } from './api';
import { LuxuryFabricSwatch, BespokeGarmentConfig, BespokeQuote, TailorAppointment } from '../types/bespoke.types';

export const bespokeService = {
  async getFabrics(params?: { mill?: string; season?: string; weavePattern?: string }) {
    const res = await apiClient.get<{ data: LuxuryFabricSwatch[] }>('/bespoke/fabrics', { params });
    return res.data;
  },

  async calculateQuote(config: BespokeGarmentConfig) {
    const res = await apiClient.post<{ data: BespokeQuote }>('/bespoke/calculate-quote', config);
    return res.data;
  },

  async analyzeMeasurements(measurements: any) {
    const res = await apiClient.post('/bespoke/analyze-measurements', measurements);
    return res.data;
  },

  async getAppointments() {
    const res = await apiClient.get<{ data: TailorAppointment[] }>('/bespoke/appointments');
    return res.data;
  },

  async bookAppointment(data: {
    tailorName?: string;
    serviceType: string;
    appointmentDate: string;
    timeSlot: string;
    clientAddress?: string;
    notes?: string;
  }) {
    const res = await apiClient.post<{ data: TailorAppointment }>('/bespoke/appointments', data);
    return res.data;
  },

  async cancelAppointment(id: string) {
    const res = await apiClient.delete(`/bespoke/appointments/${id}`);
    return res.data;
  }
};
