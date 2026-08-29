import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { crmAnalyticsService } from '../../services/crmAnalytics.service';
import {
  LoyaltyAccount,
  GarmentProvenanceCertificate,
  Customer360Profile,
  SartorialKPISummary,
  MonthlyRevenueForecast,
  OutfitRecommendation,
} from '../../types/crmAnalytics.types';

interface CRMAnalyticsState {
  loyaltyAccount: LoyaltyAccount | null;
  certificates: GarmentProvenanceCertificate[];
  customers: Customer360Profile[];
  kpis: SartorialKPISummary | null;
  forecasts: MonthlyRevenueForecast[];
  outfits: OutfitRecommendation[];
  isLoading: boolean;
  error: string | null;
}

const initialState: CRMAnalyticsState = {
  loyaltyAccount: null,
  certificates: [],
  customers: [],
  kpis: null,
  forecasts: [],
  outfits: [],
  isLoading: false,
  error: null,
};

export const fetchMyLoyalty = createAsyncThunk('crmAnalytics/fetchLoyalty', async () => {
  const res = await crmAnalyticsService.getMyLoyalty();
  return res.data;
});

export const fetchProvenanceCertificates = createAsyncThunk('crmAnalytics/fetchCertificates', async () => {
  const res = await crmAnalyticsService.getProvenanceCertificates();
  return res.data;
});

export const fetchCustomers = createAsyncThunk('crmAnalytics/fetchCustomers', async (params: { search?: string; segment?: string } | void) => {
  const res = await crmAnalyticsService.getCustomers(params || {});
  return res.data;
});

export const fetchExecutiveKPIs = createAsyncThunk('crmAnalytics/fetchKPIs', async () => {
  const res = await crmAnalyticsService.getKPISummary();
  return res.data;
});

export const fetchRevenueForecasts = createAsyncThunk('crmAnalytics/fetchForecasts', async () => {
  const res = await crmAnalyticsService.getRevenueForecasts();
  return res.data;
});

export const fetchOutfitRecommendations = createAsyncThunk('crmAnalytics/fetchOutfits', async (occasion?: string) => {
  const res = await crmAnalyticsService.getOutfitRecommendations(occasion);
  return res.data;
});

export const crmAnalyticsSlice = createSlice({
  name: 'crmAnalytics',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyLoyalty.fulfilled, (state, action) => {
        state.loyaltyAccount = action.payload;
      })
      .addCase(fetchProvenanceCertificates.fulfilled, (state, action) => {
        state.certificates = action.payload;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.customers = action.payload;
      })
      .addCase(fetchExecutiveKPIs.fulfilled, (state, action) => {
        state.kpis = action.payload;
      })
      .addCase(fetchRevenueForecasts.fulfilled, (state, action) => {
        state.forecasts = action.payload;
      })
      .addCase(fetchOutfitRecommendations.fulfilled, (state, action) => {
        state.outfits = action.payload;
      });
  },
});

export default crmAnalyticsSlice.reducer;
