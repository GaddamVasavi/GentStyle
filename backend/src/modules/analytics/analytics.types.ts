export interface SartorialKPISummary {
  grossMerchandiseVolumeYTD: number;
  averageOrderValue: number;
  bespokeCommissionRatePercent: number;
  repeatPurchaseRatePercent: number;
  returnRatePercent: number;
  grossMarginPercent: number;
  totalActiveVIPMembers: number;
  tailorBenchUtilizationPercent: number;
}

export interface MonthlyRevenueForecast {
  month: string;
  actualRevenueUsd?: number;
  forecastedRevenueUsd: number;
  bespokeRevenueUsd: number;
  readyToWearRevenueUsd: number;
  accessoriesRevenueUsd: number;
  growthRateYoYPercent: number;
}

export interface CategoryProfitMargin {
  categoryName: string;
  revenueUsd: number;
  costOfGoodsUsd: number;
  grossProfitUsd: number;
  marginPercent: number;
}
