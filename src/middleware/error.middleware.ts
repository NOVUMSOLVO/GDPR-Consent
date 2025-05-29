import { Request, Response, NextFunction } from 'express';
import { logError } from '../services/logger.service';
import emailService from '../services/email.service';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

// Custom error classes
export class ValidationError extends Error {
  statusCode = 400;
  isOperational = true;

  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends Error {
  statusCode = 401;
  isOperational = true;

  constructor(message: string = 'Authentication failed') {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends Error {
  statusCode = 403;
  isOperational = true;

  constructor(message: string = 'Access denied') {
    super(message);
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends Error {
  statusCode = 404;
  isOperational = true;

  constructor(message: string = 'Resource not found') {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends Error {
  statusCode = 409;
  isOperational = true;

  constructor(message: string = 'Resource conflict') {
    super(message);
    this.name = 'ConflictError';
  }
}

export class RateLimitError extends Error {
  statusCode = 429;
  isOperational = true;

  constructor(message: string = 'Too many requests') {
    super(message);
    this.name = 'RateLimitError';
  }
}

export class DatabaseError extends Error {
  statusCode = 500;
  isOperational = false;

  constructor(message: string = 'Database operation failed') {
    super(message);
    this.name = 'DatabaseError';
  }
}

// Error response interface
interface ErrorResponse {
  success: false;
  error: {
    message: string;
    code?: string;
    details?: any;
  };
  timestamp: string;
  path: string;
  method: string;
}

// Development error response (includes stack trace)
interface DevErrorResponse extends ErrorResponse {
  stack?: string;
}

// Send error response for development
const sendErrorDev = (err: AppError, req: Request, res: Response) => {
  const errorResponse: DevErrorResponse = {
    success: false,
    error: {
      message: err.message,
      code: err.name,
    },
    timestamp: new Date().toISOString(),
    path: req.path,
    method: req.method,
    stack: err.stack,
  };

  res.status(err.statusCode || 500).json(errorResponse);
};

// Send error response for production
const sendErrorProd = (err: AppError, req: Request, res: Response) => {
  // Operational errors: send message to client
  if (err.isOperational) {
    const errorResponse: ErrorResponse = {
      success: false,
      error: {
        message: err.message,
        code: err.name,
      },
      timestamp: new Date().toISOString(),
      path: req.path,
      method: req.method,
    };

    res.status(err.statusCode || 500).json(errorResponse);
  } else {
    // Programming or unknown errors: don't leak error details
    const errorResponse: ErrorResponse = {
      success: false,
      error: {
        message: 'Something went wrong!',
        code: 'INTERNAL_SERVER_ERROR',
      },
      timestamp: new Date().toISOString(),
      path: req.path,
      method: req.method,
    };

    res.status(500).json(errorResponse);
  }
};

// Global error handling middleware
export const globalErrorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Set default error properties
  err.statusCode = err.statusCode || 500;
  err.isOperational = err.isOperational || false;

  // Log the error
  logError('Global error handler caught error', err, {
    path: req.path,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: (req as any).user?.id,
  });

  // Send alert for critical errors
  if (!err.isOperational && process.env.NODE_ENV === 'production') {
    emailService.sendAdminAlert('Critical application error occurred', {
      message: err.message,
      stack: err.stack,
      path: req.path,
      method: req.method,
      timestamp: new Date().toISOString(),
    });
  }

  // Send appropriate error response
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else {
    sendErrorProd(err, req, res);
  }
};

// Async error wrapper
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// 404 handler
export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  const error = new NotFoundError(`Route ${req.originalUrl} not found`);
  next(error);
};

// Unhandled promise rejection handler
export const handleUnhandledRejection = () => {
  process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
    logError('Unhandled Promise Rejection', new Error(reason), { promise });
    
    // Send alert
    emailService.sendAdminAlert('Unhandled Promise Rejection', {
      reason: reason?.toString(),
      timestamp: new Date().toISOString(),
    });

    // Graceful shutdown
    process.exit(1);
  });
};

// Uncaught exception handler
export const handleUncaughtException = () => {
  process.on('uncaughtException', (error: Error) => {
    logError('Uncaught Exception', error);
    
    // Send alert
    emailService.sendAdminAlert('Uncaught Exception', {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    });

    // Graceful shutdown
    process.exit(1);
  });
};
