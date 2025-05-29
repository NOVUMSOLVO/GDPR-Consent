import 'reflect-metadata'; // Required for TypeORM
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';

// Load environment variables
dotenv.config();

// Import routes
import authRoutes from './routes/auth.routes';
import consentRoutes from './routes/consent.routes';
import adminRoutes from './routes/admin.routes';

// Import services and middleware
import { SERVER_CONFIG } from './config';
import { initializeDatabaseAndSeed } from './database/init';
import { requestLogger } from './services/logger.service';
import webSocketService from './services/websocket.service';
import {
  globalErrorHandler,
  notFoundHandler,
  handleUnhandledRejection,
  handleUncaughtException
} from './middleware/error.middleware';
import { validate, schemas } from './services/validation.service';

const app = express();
const startPort = SERVER_CONFIG.PORT_START;
const maxPort = SERVER_CONFIG.PORT_MAX;

// Setup global error handlers
handleUnhandledRejection();
handleUncaughtException();

// Initialize database
initializeDatabaseAndSeed().catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "ws:", "wss:"],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Request logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(requestLogger);

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: Math.ceil(parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000') / 1000)
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to auth routes
app.use('/api/auth', apiLimiter);

// Body parsing middleware
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// API info endpoint
app.get('/api', (_req, res) => {
  res.json({
    message: 'GDPR-Compliant Patient Engagement System API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth/login',
      consent: '/api/consent',
      admin: '/api/admin'
    }
  });
});

// Routes with validation
app.use('/api/auth', authRoutes);
app.use('/api/consent', consentRoutes);
app.use('/api/admin', adminRoutes);

// Simple hello world endpoint
app.get('/', (_req, res) => {
  res.json({ message: 'GDPR-Compliant Patient Engagement System API' });
});

// Health check endpoint
app.get('/health', (_, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// 404 handler for undefined routes
app.use(notFoundHandler);

// Global error handling middleware (must be last)
app.use(globalErrorHandler);

// Try to find an available port
const tryPort = (port: number) => {
  const server = createServer(app);

  // Initialize WebSocket service
  webSocketService.initialize(server);

  server.on('error', (e: NodeJS.ErrnoException) => {
    if (e.code === 'EADDRINUSE') {
      console.log(`Port ${port} is in use, trying ${port + 1}...`);
      tryPort(port + 1);
    } else {
      console.error('Server error:', e);
    }
  });

  server.on('listening', () => {
    console.log(`🚀 Server running on port ${port}`);
    console.log(`📡 API available at http://localhost:${port}/api`);
    console.log(`🔌 WebSocket available at ws://localhost:${port}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  });

  if (port <= maxPort) {
    server.listen(port);
  } else {
    console.error(`Could not find an available port between ${startPort} and ${maxPort}`);
    process.exit(1);
  }
};

// Start trying ports
tryPort(startPort);
