import { Request, Response, NextFunction } from 'express';
import { analyticsService } from './analytics.service';
import { sendSuccess } from '../../utils/response';

export class AnalyticsController {
  public getKPISummary(req: Request, res: Response, next: NextFunction) {
    try {
      const kpis = analyticsService.getKPISummary();
      return sendSuccess(res, kpis, 'Executive KPI metrics retrieved');
    } catch (err) {
      next(err);
    }
  }

  public getForecasts(req: Request, res: Response, next: NextFunction) {
    try {
      const forecasts = analyticsService.getRevenueForecasts();
      return sendSuccess(res, forecasts, '12-Month revenue forecasts retrieved');
    } catch (err) {
      next(err);
    }
  }

  public getMargins(req: Request, res: Response, next: NextFunction) {
    try {
      const margins = analyticsService.getCategoryMargins();
      return sendSuccess(res, margins, 'Category profit margins retrieved');
    } catch (err) {
      next(err);
    }
  }
}

export const analyticsController = new AnalyticsController();
