import { apiClient } from './api';
import {
  LoyaltyAccount,
  GarmentProvenanceCertificate,
  Customer360Profile,
  SartorialKPISummary,
  MonthlyRevenueForecast,
  OutfitRecommendation,
} from '../types/crmAnalytics.types';

export const crmAnalyticsService = {
  // Loyalty
  async getMyLoyalty() {
    const res = await apiClient.get<{ data: LoyaltyAccount }>('/loyalty/my-account');
    return res.data;
  },

  async getProvenanceCertificates() {
    const res = await apiClient.get<{ data: GarmentProvenanceCertificate[] }>('/loyalty/provenance-certificates');
    return res.data;
  },

  // CRM
  async getCustomers(params?: { search?: string; segment?: string }) {
    const res = await apiClient.get<{ data: Customer360Profile[] }>('/crm/customers', { params });
    return res.data;
  },

  // Analytics
  async getKPISummary() {
    const res = await apiClient.get<{ data: SartorialKPISummary }>('/analytics/kpi-summary');
    return res.data;
  },

  async getRevenueForecasts() {
    const res = await apiClient.get<{ data: MonthlyRevenueForecast[] }>('/analytics/revenue-forecasts');
    return res.data;
  },

  // AI Stylist
  async getOutfitRecommendations(occasion?: string) {
    const res = await apiClient.get<{ data: OutfitRecommendation[] }>('/stylist/recommendations', {
      params: { occasion },
    });
    return res.data;
  }
};
