import { Router } from 'express';
import { collectionController } from './collection.controller';
import { requireAuth, requireRole } from '../../middleware/authMiddleware';

const router = Router();

router.get('/', (req, res, next) => collectionController.getAllCollections(req, res, next));
router.get('/:slug', (req, res, next) => collectionController.getCollectionBySlug(req, res, next));
router.post('/', requireAuth, requireRole('ADMIN'), (req, res, next) =>
  collectionController.createCollection(req, res, next)
);

export const collectionRoutes = router;
