import { Request, Response, NextFunction } from 'express';
import { aiStylistService } from './aiStylist.service';
import { sendSuccess } from '../../utils/response';
import { DressCodeOccasion } from './aiStylist.types';

export class AIStylistController {
  public getOutfits(req: Request, res: Response, next: NextFunction) {
    try {
      const { occasion } = req.query;
      const outfits = aiStylistService.generateRecommendations(occasion as DressCodeOccasion);
      return sendSuccess(res, outfits, 'AI sartorial ensemble recommendations generated');
    } catch (err) {
      next(err);
    }
  }
}

export const aiStylistController = new AIStylistController();
