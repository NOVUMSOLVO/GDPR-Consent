import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import jwt from 'jsonwebtoken';
import { JWT_CONFIG } from '../config';
import { logInfo, logError } from './logger.service';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  userRole?: string;
}

class WebSocketService {
  private io: SocketIOServer | null = null;
  private connectedAdmins: Set<string> = new Set();

  initialize(server: HttpServer) {
    if (!process.env.ENABLE_REAL_TIME_UPDATES) {
      logInfo('Real-time updates are disabled');
      return;
    }

    this.io = new SocketIOServer(server, {
      cors: {
        origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });

    this.setupMiddleware();
    this.setupEventHandlers();

    logInfo('WebSocket service initialized');
  }

  private setupMiddleware() {
    if (!this.io) return;

    // Authentication middleware
    this.io.use((socket: any, next) => {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      try {
        const decoded = (jwt as any).verify(token, JWT_CONFIG.SECRET);
        socket.userId = decoded.userId;
        socket.userRole = decoded.role;
        next();
      } catch (error) {
        next(new Error('Authentication error: Invalid token'));
      }
    });
  }

  private setupEventHandlers() {
    if (!this.io) return;

    this.io.on('connection', (socket: AuthenticatedSocket) => {
      logInfo('Client connected', {
        socketId: socket.id,
        userId: socket.userId,
        role: socket.userRole
      });

      // Add admin to connected admins set
      if (socket.userRole === 'admin' && socket.userId) {
        this.connectedAdmins.add(socket.userId);
        socket.join('admins');
      }

      // Handle admin dashboard subscription
      socket.on('subscribe:dashboard', () => {
        if (socket.userRole === 'admin') {
          socket.join('dashboard');
          logInfo('Admin subscribed to dashboard updates', { userId: socket.userId });
        }
      });

      // Handle audit logs subscription
      socket.on('subscribe:audit', () => {
        if (socket.userRole === 'admin') {
          socket.join('audit');
          logInfo('Admin subscribed to audit updates', { userId: socket.userId });
        }
      });

      // Handle consent records subscription
      socket.on('subscribe:consents', () => {
        if (socket.userRole === 'admin') {
          socket.join('consents');
          logInfo('Admin subscribed to consent updates', { userId: socket.userId });
        }
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        logInfo('Client disconnected', {
          socketId: socket.id,
          userId: socket.userId
        });

        if (socket.userId) {
          this.connectedAdmins.delete(socket.userId);
        }
      });

      // Handle ping for connection health
      socket.on('ping', () => {
        socket.emit('pong');
      });
    });
  }

  // Emit new consent record to admins
  emitNewConsent(consentData: any) {
    if (!this.io) return;

    this.io.to('consents').emit('consent:new', {
      type: 'NEW_CONSENT',
      data: consentData,
      timestamp: new Date().toISOString(),
    });

    this.io.to('dashboard').emit('dashboard:update', {
      type: 'CONSENT_STATS_UPDATE',
      timestamp: new Date().toISOString(),
    });

    logInfo('Emitted new consent notification', { consentId: consentData.id });
  }

  // Emit consent update to admins
  emitConsentUpdate(consentData: any) {
    if (!this.io) return;

    this.io.to('consents').emit('consent:updated', {
      type: 'CONSENT_UPDATED',
      data: consentData,
      timestamp: new Date().toISOString(),
    });

    this.io.to('dashboard').emit('dashboard:update', {
      type: 'CONSENT_STATS_UPDATE',
      timestamp: new Date().toISOString(),
    });

    logInfo('Emitted consent update notification', { consentId: consentData.id });
  }

  // Emit new audit log to admins
  emitAuditLog(auditData: any) {
    if (!this.io) return;

    this.io.to('audit').emit('audit:new', {
      type: 'NEW_AUDIT_LOG',
      data: auditData,
      timestamp: new Date().toISOString(),
    });

    logInfo('Emitted new audit log notification', { auditId: auditData.id });
  }

  // Emit system alert to all admins
  emitSystemAlert(message: string, severity: 'info' | 'warning' | 'error' = 'info') {
    if (!this.io) return;

    this.io.to('admins').emit('system:alert', {
      type: 'SYSTEM_ALERT',
      message,
      severity,
      timestamp: new Date().toISOString(),
    });

    logInfo('Emitted system alert', { message, severity });
  }

  // Get connected admins count
  getConnectedAdminsCount(): number {
    return this.connectedAdmins.size;
  }

  // Check if service is available
  isAvailable(): boolean {
    return this.io !== null;
  }
}

export const webSocketService = new WebSocketService();
export default webSocketService;
