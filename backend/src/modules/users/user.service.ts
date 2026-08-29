import { prisma } from '../../database/prisma';
import { NotFoundError } from '../../utils/errors';
import { UpdateProfileInput, AdminUserQuery } from './user.types';
import { logger } from '../../config/logger';

export class UserService {
  /**
   * Get user profile by ID
   */
  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatar: true,
        dateOfBirth: true,
        role: true,
        status: true,
        isEmailVerified: true,
        createdAt: true,
        updatedAt: true,
        addresses: {
          orderBy: { isDefaultShipping: 'desc' },
        },
      },
    });

    if (!user) {
      throw new NotFoundError('User profile not found');
    }

    return user;
  }

  /**
   * Update user profile
   */
  async updateProfile(userId: string, input: UpdateProfileInput) {
    const data: any = { ...input };
    if (input.dateOfBirth) {
      data.dateOfBirth = new Date(input.dateOfBirth);
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatar: true,
        dateOfBirth: true,
        role: true,
        status: true,
        isEmailVerified: true,
        updatedAt: true,
      },
    });

    logger.info(`User profile updated: ${userId}`);
    return updated;
  }

  /**
   * Get customer login history
   */
  async getLoginHistory(userId: string, limit: number = 10) {
    return prisma.loginHistory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  /**
   * Admin: List users with pagination and search
   */
  async adminListUsers(query: AdminUserQuery) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(query.limit) || 20));
    const skip = (page - 1) * limit;

    const where: any = {};

    if (query.role) {
      where.role = query.role;
    }
    if (query.status) {
      where.status = query.status;
    }
    if (query.search) {
      where.OR = [
        { email: { contains: query.search, mode: 'insensitive' } },
        { firstName: { contains: query.search, mode: 'insensitive' } },
        { lastName: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [total, users] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          avatar: true,
          role: true,
          status: true,
          isEmailVerified: true,
          createdAt: true,
          lastLoginAt: true,
          _count: {
            select: {
              orders: true,
              reviews: true,
            },
          },
        },
      }),
    ]);

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Admin: Update user status or role
   */
  async adminUpdateUser(id: string, data: { status?: any; role?: any }) {
    const user = await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        updatedAt: true,
      },
    });

    return user;
  }
}

export const userService = new UserService();
