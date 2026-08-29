import { Request, Response, NextFunction } from 'express';
import { authService } from './auth.service';
import { sendSuccess } from '../../utils/response';
import { AuthenticatedRequest } from '../../middleware/authMiddleware';

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.register(req.body);
      
      // Set refresh token in HTTP-only cookie
      res.cookie('refreshToken', result.tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return sendSuccess(res, result, 'User registration successful', 201);
    } catch (error) {
      return next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const ipAddress = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '';
      const userAgent = req.headers['user-agent'] || '';

      const result = await authService.login({
        ...req.body,
        ipAddress,
        userAgent,
      });

      res.cookie('refreshToken', result.tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return sendSuccess(res, result, 'Login successful');
    } catch (error) {
      return next(error);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.body.refreshToken || req.cookies?.refreshToken;
      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'Refresh token required',
          data: null,
        });
      }

      const tokens = await authService.refreshTokens(token);

      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return sendSuccess(res, tokens, 'Tokens refreshed successfully');
    } catch (error) {
      return next(error);
    }
  }

  async logout(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (req.user?.userId) {
        await authService.logout(req.user.userId);
      }
      res.clearCookie('refreshToken');
      res.clearCookie('accessToken');
      return sendSuccess(res, null, 'Logged out successfully');
    } catch (error) {
      return next(error);
    }
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.forgotPassword(req.body.email);
      return sendSuccess(res, result, 'If that email is in our database, a password reset link has been sent.');
    } catch (error) {
      return next(error);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      await authService.resetPassword(req.body.token, req.body.newPassword);
      return sendSuccess(res, null, 'Password reset successfully. You can now login with your new password.');
    } catch (error) {
      return next(error);
    }
  }

  async changePassword(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      await authService.changePassword(req.user!.userId, req.body);
      return sendSuccess(res, null, 'Password changed successfully');
    } catch (error) {
      return next(error);
    }
  }

  async getMe(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      return sendSuccess(res, req.user, 'Current session retrieved');
    } catch (error) {
      return next(error);
    }
  }
}

export const authController = new AuthController();
