import { Response, NextFunction } from 'express';
import { userService } from './user.service';
import { sendSuccess } from '../../utils/response';
import { AuthenticatedRequest } from '../../middleware/authMiddleware';

export class UserController {
  async getProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const profile = await userService.getProfile(req.user!.userId);
      return sendSuccess(res, profile, 'User profile fetched');
    } catch (error) {
      return next(error);
    }
  }

  async updateProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const updated = await userService.updateProfile(req.user!.userId, req.body);
      return sendSuccess(res, updated, 'Profile updated successfully');
    } catch (error) {
      return next(error);
    }
  }

  async getLoginHistory(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const history = await userService.getLoginHistory(req.user!.userId);
      return sendSuccess(res, history, 'Login history retrieved');
    } catch (error) {
      return next(error);
    }
  }

  // Admin handlers
  async adminListUsers(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { users, pagination } = await userService.adminListUsers(req.query);
      return sendSuccess(res, users, 'Users retrieved successfully', 200, pagination);
    } catch (error) {
      return next(error);
    }
  }

  async adminUpdateUser(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const user = await userService.adminUpdateUser(req.params.id, req.body);
      return sendSuccess(res, user, 'User updated successfully');
    } catch (error) {
      return next(error);
    }
  }
}

export const userController = new UserController();
