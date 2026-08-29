import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { config } from './config';
import { logger } from './config/logger';
import { apiRouter } from './routes';
import { errorHandler } from './middleware/errorHandler';
import { globalLimiter } from './middleware/rateLimiter';
import { setupSwagger } from './docs/swagger';
import { connectDatabase } from './database/prisma';

export const app = express();

// Security and compression middlewares
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

app.use(cors({
  origin: [config.clientUrl, 'http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// HTTP Request logging
if (config.env !== 'test') {
  app.use(morgan('combined', {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  }));
}

// Global Rate Limiter
app.use(config.apiPrefix, globalLimiter);

// API Documentation
setupSwagger(app);

// Mount API Routes
app.use(config.apiPrefix, apiRouter);

// 404 Catch-All
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
    data: null,
    error: {
      code: 'ROUTE_NOT_FOUND',
    },
  });
});

// Global Error Handler
app.use(errorHandler);

// Start server if executed directly
if (process.env.NODE_ENV !== 'test') {
  const server = app.listen(config.port, async () => {
    logger.info(`====================================================`);
    logger.info(`GentStyle Backend API running on port ${config.port}`);
    logger.info(`Environment: ${config.env}`);
    logger.info(`API Base URL: http://localhost:${config.port}${config.apiPrefix}`);
    logger.info(`Swagger Docs: http://localhost:${config.port}/api/docs`);
    logger.info(`====================================================`);
    await connectDatabase();
  });

  // Graceful shutdown handling
  const shutdown = async () => {
    logger.info('Shutting down server gracefully...');
    server.close(() => {
      logger.info('HTTP server closed.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}
