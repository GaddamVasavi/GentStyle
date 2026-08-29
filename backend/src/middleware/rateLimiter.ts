import rateLimit from 'express-rate-limit';
import { sendError } from '../utils/response';

export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 1000 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return sendError(
      res,
      'Too many requests from this IP, please try again after 15 minutes.',
      429,
      'RATE_LIMIT_EXCEEDED'
    );
  },
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Limit each IP to 30 login/register requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return sendError(
      res,
      'Too many authentication attempts, please try again in 15 minutes.',
      429,
      'AUTH_RATE_LIMIT_EXCEEDED'
    );
  },
});
