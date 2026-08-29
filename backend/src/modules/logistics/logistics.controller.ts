import { Request, Response, NextFunction } from 'express';
import { logisticsService } from './logistics.service';
import { sendSuccess } from '../../utils/response';

export class LogisticsController {
  public getQuotes(req: Request, res: Response, next: NextFunction) {
    try {
      const { originCountry, destinationCountry, weightKg } = req.body;
      const quotes = logisticsService.calculateRates(
        originCountry || 'United States',
        destinationCountry || 'United States',
        weightKg || 2.5
      );
      return sendSuccess(res, quotes, 'Logistics carrier quotes computed');
    } catch (err) {
      next(err);
    }
  }

  public getCustomsDoc(req: Request, res: Response, next: NextFunction) {
    try {
      const { orderNumber, value, origin } = req.query;
      const doc = logisticsService.generateCustomsDeclaration(
        (orderNumber as string) || 'ORD-TEST',
        Number(value) || 1500,
        (origin as string) || 'Italy'
      );
      return sendSuccess(res, doc, 'Commercial customs declaration generated');
    } catch (err) {
      next(err);
    }
  }
}

export const logisticsController = new LogisticsController();
