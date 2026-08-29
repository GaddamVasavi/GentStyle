import { authService } from '../src/modules/auth/auth.service';
import { prisma } from '../src/database/prisma';
import bcrypt from 'bcrypt';

jest.mock('../src/database/prisma', () => {
  const mockPrisma: any = {
    user: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    loginHistory: {
      create: jest.fn(),
    },
    cart: {
      create: jest.fn(),
    },
    wishlist: {
      create: jest.fn(),
    },
    $transaction: jest.fn(),
  };
  return { prisma: mockPrisma };
});

describe('AuthModule - Unit & Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (prisma.$transaction as jest.Mock).mockImplementation(async (cb: any) => await cb(prisma));
  });

  describe('AuthService.register', () => {
    it('should successfully register a new customer and return tokens', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.user.create as jest.Mock).mockResolvedValue({
        id: 'usr-1234',
        email: 'test@gentstyle.com',
        firstName: 'Alexander',
        lastName: 'Sterling',
        role: 'CUSTOMER',
        avatar: null,
        isEmailVerified: false,
      });
      (prisma.cart.create as jest.Mock).mockResolvedValue({});
      (prisma.wishlist.create as jest.Mock).mockResolvedValue({});
      (prisma.user.update as jest.Mock).mockResolvedValue({});

      const result = await authService.register({
        email: 'test@gentstyle.com',
        password: 'Password123!',
        firstName: 'Alexander',
        lastName: 'Sterling',
      });

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('tokens');
      expect(result.user.email).toBe('test@gentstyle.com');
      expect(result.tokens.accessToken).toBeDefined();
      expect(result.tokens.refreshToken).toBeDefined();
    });

    it('should throw ConflictError if user email already exists', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 'existing-id',
        email: 'test@gentstyle.com',
      });

      await expect(
        authService.register({
          email: 'test@gentstyle.com',
          password: 'Password123!',
          firstName: 'Alexander',
          lastName: 'Sterling',
        })
      ).rejects.toThrow('A user with this email address already exists');
    });
  });

  describe('AuthService.login', () => {
    it('should login an active user with valid credentials', async () => {
      const hashedPass = await bcrypt.hash('Password123!', 10);
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 'usr-1234',
        email: 'test@gentstyle.com',
        passwordHash: hashedPass,
        firstName: 'Alexander',
        lastName: 'Sterling',
        role: 'CUSTOMER',
        status: 'ACTIVE',
        avatar: null,
        isEmailVerified: true,
      });
      (prisma.loginHistory.create as jest.Mock).mockResolvedValue({});
      (prisma.user.update as jest.Mock).mockResolvedValue({});

      const result = await authService.login({
        email: 'test@gentstyle.com',
        password: 'Password123!',
      });

      expect(result.user.email).toBe('test@gentstyle.com');
      expect(result.tokens.accessToken).toBeDefined();
    });

    it('should reject login if password does not match', async () => {
      const hashedPass = await bcrypt.hash('DifferentPassword!', 10);
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 'usr-1234',
        email: 'test@gentstyle.com',
        passwordHash: hashedPass,
        status: 'ACTIVE',
      });
      (prisma.loginHistory.create as jest.Mock).mockResolvedValue({});

      await expect(
        authService.login({
          email: 'test@gentstyle.com',
          password: 'WrongPassword!',
        })
      ).rejects.toThrow('Invalid email or password');
    });
  });
});
