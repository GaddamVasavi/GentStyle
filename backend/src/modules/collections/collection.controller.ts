import { Request, Response, NextFunction } from 'express';
import { collectionService } from './collection.service';
import { sendSuccess } from '../../utils/response';
import { AuthenticatedRequest } from '../../middleware/authMiddleware';

export class CollectionController {
  async getAllCollections(req: Request, res: Response, next: NextFunction) {
    try {
      const collections = await collectionService.getAllCollections();
      return sendSuccess(res, collections, 'Collections retrieved');
    } catch (error) {
      return next(error);
    }
  }

  async getCollectionBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const collection = await collectionService.getCollectionBySlug(req.params.slug);
      return sendSuccess(res, collection, 'Collection details retrieved');
    } catch (error) {
      return next(error);
    }
  }

  async createCollection(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const collection = await collectionService.createCollection(req.body);
      return sendSuccess(res, collection, 'Collection created', 201);
    } catch (error) {
      return next(error);
    }
  }
}

export const collectionController = new CollectionController();
