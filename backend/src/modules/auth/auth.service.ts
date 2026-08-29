import crypto from 'crypto';
import { prisma } from '../../database/prisma';
import { hashPassword, comparePassword } from '../../utils/password';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../../utils/jwt';
import { ConflictError, UnauthorizedError, NotFoundError, AppError } from '../../utils/errors';
import { RegisterInput, LoginInput, AuthResult, ChangePasswordInput } from './auth.types';
import { logger } from '../../config/logger';

export class AuthService {
  /**
   * Register a new customer
   */
  async register(input: RegisterInput): Promise<AuthResult> {
    const existing = await prisma.user.findUnique({
      where: { email: input.email.toLowerCase() },
    });

    if (existing) {
      throw new ConflictError('A user with this email address already exists');
    }

    const passwordHash = await hashPassword(input.password);
    const emailVerifyToken = crypto.randomBytes(32).toString('hex');

    // Create user inside a transaction with cart and wishlist
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email: input.email.toLowerCase(),
          passwordHash,
          firstName: input.firstName,
          lastName: input.lastName,
          phone: input.phone,
          role: 'CUSTOMER',
          status: 'ACTIVE',
          emailVerifyToken,
        },
      });

      // Automatically initialize user's Cart and Wishlist
      await tx.cart.create({
        data: { userId: newUser.id },
      });

      await tx.wishlist.create({
        data: { userId: newUser.id },
      });

      return newUser;
    });

    const tokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // Save refresh token hash
    const refreshTokenHash = await hashPassword(refreshToken);
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshTokenHash, lastLoginAt: new Date() },
    });

    logger.info(`New user registered: ${user.email} (${user.id})`);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        avatar: user.avatar,
        isEmailVerified: user.isEmailVerified,
      },
      tokens: {
        accessToken,
        refreshToken,
        expiresIn: '15m',
      },
    };
  }

  /**
   * Login user with credentials
   */
  async login(input: LoginInput): Promise<AuthResult> {
    const user = await prisma.user.findUnique({
      where: { email: input.email.toLowerCase() },
    });

    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    if (user.status === 'SUSPENDED') {
      throw new UnauthorizedError('Your account has been suspended. Please contact customer support.');
    }

    if (user.status === 'INACTIVE') {
      throw new UnauthorizedError('Your account is currently inactive.');
    }

    const isValidPassword = await comparePassword(input.password, user.passwordHash);

    // Record login attempt in LoginHistory
    await prisma.loginHistory.create({
      data: {
        userId: user.id,
        ipAddress: input.ipAddress,
        userAgent: input.userAgent,
        isSuccess: isValidPassword,
      },
    });

    if (!isValidPassword) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const tokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    const refreshTokenHash = await hashPassword(refreshToken);
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshTokenHash, lastLoginAt: new Date() },
    });

    logger.info(`User logged in: ${user.email}`);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        avatar: user.avatar,
        isEmailVerified: user.isEmailVerified,
      },
      tokens: {
        accessToken,
        refreshToken,
        expiresIn: '15m',
      },
    };
  }

  /**
   * Refresh JWT Access Token using valid Refresh Token
   */
  async refreshTokens(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      throw new UnauthorizedError('Invalid or expired refresh token', 'INVALID_REFRESH_TOKEN');
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user || !user.refreshTokenHash) {
      throw new UnauthorizedError('Session expired. Please log in again.');
    }

    const isValidRefresh = await comparePassword(refreshToken, user.refreshTokenHash);
    if (!isValidRefresh) {
      throw new UnauthorizedError('Invalid refresh token.');
    }

    const tokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const newAccessToken = generateAccessToken(tokenPayload);
    const newRefreshToken = generateRefreshToken(tokenPayload);

    const newRefreshTokenHash = await hashPassword(newRefreshToken);
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshTokenHash: newRefreshTokenHash },
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  /**
   * Logout user by clearing stored refresh token
   */
  async logout(userId: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash: null },
    });
    logger.info(`User logged out: ${userId}`);
  }

  /**
   * Initiate forgot password flow
   */
  async forgotPassword(email: string): Promise<{ resetToken: string }> {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      // Return dummy token or success message to prevent user enumeration
      return { resetToken: 'token_sent_if_email_exists' };
    }

    const rawToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: hashedToken,
        passwordResetExpires: expiresAt,
      },
    });

    logger.info(`Password reset requested for ${email}. Reset token generated.`);

    return { resetToken: rawToken };
  }

  /**
   * Reset password with valid token
   */
  async resetPassword(rawToken: string, newPass: string): Promise<void> {
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken: hashedToken,
        passwordResetExpires: { gt: new Date() },
      },
    });

    if (!user) {
      throw new AppError('Password reset token is invalid or has expired', 400, 'INVALID_RESET_TOKEN');
    }

    const passwordHash = await hashPassword(newPass);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        passwordResetToken: null,
        passwordResetExpires: null,
        refreshTokenHash: null, // Revoke active sessions for security
      },
    });

    logger.info(`Password successfully reset for user: ${user.email}`);
  }

  /**
   * Change password for logged-in user
   */
  async changePassword(userId: string, input: ChangePasswordInput): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    const isMatch = await comparePassword(input.currentPassword, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedError('Incorrect current password');
    }

    const passwordHash = await hashPassword(input.newPassword);

    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });

    logger.info(`Password updated for user: ${user.email}`);
  }
}

export const authService = new AuthService();
