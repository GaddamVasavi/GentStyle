import {
  SartorialKPISummary,
  MonthlyRevenueForecast,
  CategoryProfitMargin,
} from './analytics.types';

export class AnalyticsService {
  public getKPISummary(): SartorialKPISummary {
    return {
      grossMerchandiseVolumeYTD: 14250000.0,
      averageOrderValue: 2840.0,
      bespokeCommissionRatePercent: 46.8,
      repeatPurchaseRatePercent: 68.4,
      returnRatePercent: 2.1,
      grossMarginPercent: 64.5,
      totalActiveVIPMembers: 4820,
      tailorBenchUtilizationPercent: 92.3,
    };
  }

  public getRevenueForecasts(): MonthlyRevenueForecast[] {
    return [
      { month: 'Jan 2026', actualRevenueUsd: 1100000, forecastedRevenueUsd: 1100000, bespokeRevenueUsd: 520000, readyToWearRevenueUsd: 430000, accessoriesRevenueUsd: 150000, growthRateYoYPercent: 24.5 },
      { month: 'Feb 2026', actualRevenueUsd: 1250000, forecastedRevenueUsd: 1250000, bespokeRevenueUsd: 610000, readyToWearRevenueUsd: 480000, accessoriesRevenueUsd: 160000, growthRateYoYPercent: 28.1 },
      { month: 'Mar 2026', actualRevenueUsd: 1450000, forecastedRevenueUsd: 1450000, bespokeRevenueUsd: 720000, readyToWearRevenueUsd: 540000, accessoriesRevenueUsd: 190000, growthRateYoYPercent: 31.4 },
      { month: 'Apr 2026', actualRevenueUsd: 1620000, forecastedRevenueUsd: 1620000, bespokeRevenueUsd: 810000, readyToWearRevenueUsd: 590000, accessoriesRevenueUsd: 220000, growthRateYoYPercent: 33.0 },
      { month: 'May 2026', actualRevenueUsd: 1780000, forecastedRevenueUsd: 1780000, bespokeRevenueUsd: 890000, readyToWearRevenueUsd: 640000, accessoriesRevenueUsd: 250000, growthRateYoYPercent: 35.2 },
      { month: 'Jun 2026', actualRevenueUsd: 1950000, forecastedRevenueUsd: 1950000, bespokeRevenueUsd: 980000, readyToWearRevenueUsd: 690000, accessoriesRevenueUsd: 280000, growthRateYoYPercent: 37.8 },
      { month: 'Jul 2026', actualRevenueUsd: 1820000, forecastedRevenueUsd: 1820000, bespokeRevenueUsd: 890000, readyToWearRevenueUsd: 660000, accessoriesRevenueUsd: 270000, growthRateYoYPercent: 32.1 },
      { month: 'Aug 2026', actualRevenueUsd: 2100000, forecastedRevenueUsd: 2100000, bespokeRevenueUsd: 1050000, readyToWearRevenueUsd: 740000, accessoriesRevenueUsd: 310000, growthRateYoYPercent: 39.4 },
      { month: 'Sep 2026', forecastedRevenueUsd: 2350000, bespokeRevenueUsd: 1190000, readyToWearRevenueUsd: 810000, accessoriesRevenueUsd: 350000, growthRateYoYPercent: 42.0 },
      { month: 'Oct 2026', forecastedRevenueUsd: 2650000, bespokeRevenueUsd: 1350000, readyToWearRevenueUsd: 910000, accessoriesRevenueUsd: 390000, growthRateYoYPercent: 45.3 },
      { month: 'Nov 2026', forecastedRevenueUsd: 3100000, bespokeRevenueUsd: 1600000, readyToWearRevenueUsd: 1050000, accessoriesRevenueUsd: 450000, growthRateYoYPercent: 48.9 },
      { month: 'Dec 2026', forecastedRevenueUsd: 3800000, bespokeRevenueUsd: 1950000, readyToWearRevenueUsd: 1300000, accessoriesRevenueUsd: 550000, growthRateYoYPercent: 52.4 },
    ];
  }

  public getCategoryMargins(): CategoryProfitMargin[] {
    return [
      { categoryName: 'Bespoke Suiting & Tuxedos', revenueUsd: 6850000, costOfGoodsUsd: 2192000, grossProfitUsd: 4658000, marginPercent: 68.0 },
      { categoryName: 'Luxury Sport Coats & Blazers', revenueUsd: 3200000, costOfGoodsUsd: 1120000, grossProfitUsd: 2080000, marginPercent: 65.0 },
      { categoryName: 'Artisanal Dress Shirts', revenueUsd: 1950000, costOfGoodsUsd: 682500, grossProfitUsd: 1267500, marginPercent: 65.0 },
      { categoryName: 'Silk Ties, Pocket Squares & Trims', revenueUsd: 1150000, costOfGoodsUsd: 276000, grossProfitUsd: 874000, marginPercent: 76.0 },
      { categoryName: 'Goodyear Welted Footwear', revenueUsd: 1100000, costOfGoodsUsd: 495000, grossProfitUsd: 605000, marginPercent: 55.0 },
    ];
  }
}

export const analyticsService = new AnalyticsService();
