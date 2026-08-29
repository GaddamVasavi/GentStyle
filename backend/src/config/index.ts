import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  apiPrefix: process.env.API_PREFIX || '/api',
  
  jwt: {
    secret: process.env.JWT_SECRET || 'super_secret_jwt_access_key_change_in_production_987654321',
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'super_secret_jwt_refresh_key_change_in_production_123456789',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10),
  },

  database: {
    url: process.env.DATABASE_URL || 'postgresql://gentstyle_user:gentstyle_secret@localhost:5432/gentstyle_db?schema=public',
  },

  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },

  payments: {
    provider: process.env.PAYMENT_PROVIDER || 'stripe',
    stripe: {
      secretKey: process.env.STRIPE_SECRET_KEY || 'sk_test_mock_secret_key_gentstyle',
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || 'whsec_mock_webhook_secret_gentstyle',
    },
    razorpay: {
      keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_mock_key_id',
      keySecret: process.env.RAZORPAY_KEY_SECRET || 'rzp_test_mock_secret',
    },
  },

  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || 'gentstyle-cloud',
    apiKey: process.env.CLOUDINARY_API_KEY || 'mock_cloudinary_key',
    apiSecret: process.env.CLOUDINARY_API_SECRET || 'mock_cloudinary_secret',
  },

  email: {
    host: process.env.EMAIL_HOST || 'smtp.mailtrap.io',
    port: parseInt(process.env.EMAIL_PORT || '2525', 10),
    user: process.env.EMAIL_USER || 'mock_smtp_user',
    password: process.env.EMAIL_PASSWORD || 'mock_smtp_password',
    from: process.env.EMAIL_FROM || '"GentStyle Luxury" <noreply@gentstyle.com>',
  },

  adminSeed: {
    email: process.env.DEFAULT_ADMIN_EMAIL || 'admin@gentstyle.com',
    password: process.env.DEFAULT_ADMIN_PASSWORD || 'AdminSecurePassword123!',
  }
};
