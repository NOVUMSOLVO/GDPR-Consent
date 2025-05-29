import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { AUTH_CONFIG } from '../config';

interface WebSocketMessage {
  type: string;
  data?: any;
  timestamp: string;
}

interface UseWebSocketOptions {
  autoConnect?: boolean;
  reconnectAttempts?: number;
  reconnectDelay?: number;
}

interface UseWebSocketReturn {
  socket: Socket | null;
  isConnected: boolean;
  error: string | null;
  connect: () => void;
  disconnect: () => void;
  subscribe: (event: string) => void;
  unsubscribe: (event: string) => void;
  emit: (event: string, data?: any) => void;
}

export const useWebSocket = (
  url: string = 'ws://localhost:3002',
  options: UseWebSocketOptions = {}
): UseWebSocketReturn => {
  const {
    autoConnect = true,
    reconnectAttempts = 5,
    reconnectDelay = 1000,
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const reconnectCountRef = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(() => {
    if (socketRef.current?.connected) {
      return;
    }

    const token = localStorage.getItem(AUTH_CONFIG.TOKEN_KEY);
    if (!token) {
      setError('No authentication token available');
      return;
    }

    try {
      socketRef.current = io(url, {
        auth: {
          token,
        },
        transports: ['websocket'],
        timeout: 10000,
      });

      const socket = socketRef.current;

      socket.on('connect', () => {
        setIsConnected(true);
        setError(null);
        reconnectCountRef.current = 0;
        console.log('WebSocket connected');
      });

      socket.on('disconnect', (reason) => {
        setIsConnected(false);
        console.log('WebSocket disconnected:', reason);

        // Attempt to reconnect if disconnection was not intentional
        if (reason === 'io server disconnect') {
          // Server initiated disconnect, don't reconnect
          return;
        }

        if (reconnectCountRef.current < reconnectAttempts) {
          reconnectCountRef.current++;
          const delay = reconnectDelay * Math.pow(2, reconnectCountRef.current - 1);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log(`Attempting to reconnect (${reconnectCountRef.current}/${reconnectAttempts})...`);
            connect();
          }, delay);
        } else {
          setError('Failed to reconnect after maximum attempts');
        }
      });

      socket.on('connect_error', (err) => {
        setError(`Connection error: ${err.message}`);
        setIsConnected(false);
      });

      socket.on('error', (err) => {
        setError(`Socket error: ${err}`);
      });

      // Handle authentication errors
      socket.on('auth_error', (err) => {
        setError(`Authentication error: ${err}`);
        disconnect();
      });

      // Handle pong for connection health
      socket.on('pong', () => {
        // Connection is healthy
      });

    } catch (err) {
      setError(`Failed to create socket connection: ${err}`);
    }
  }, [url, reconnectAttempts, reconnectDelay]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    setIsConnected(false);
    setError(null);
    reconnectCountRef.current = 0;
  }, []);

  const subscribe = useCallback((event: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(`subscribe:${event}`);
    }
  }, []);

  const unsubscribe = useCallback((event: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(`unsubscribe:${event}`);
    }
  }, []);

  const emit = useCallback((event: string, data?: any) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, data);
    }
  }, []);

  // Auto-connect on mount if enabled
  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [autoConnect, connect, disconnect]);

  // Ping server periodically to check connection health
  useEffect(() => {
    if (!isConnected) return;

    const pingInterval = setInterval(() => {
      emit('ping');
    }, 30000); // Ping every 30 seconds

    return () => clearInterval(pingInterval);
  }, [isConnected, emit]);

  return {
    socket: socketRef.current,
    isConnected,
    error,
    connect,
    disconnect,
    subscribe,
    unsubscribe,
    emit,
  };
};

// Hook for admin dashboard real-time updates
export const useAdminWebSocket = () => {
  const { socket, isConnected, error, subscribe, unsubscribe } = useWebSocket();
  const [notifications, setNotifications] = useState<WebSocketMessage[]>([]);

  useEffect(() => {
    if (!socket || !isConnected) return;

    // Subscribe to admin events
    subscribe('dashboard');
    subscribe('audit');
    subscribe('consents');

    // Handle real-time notifications
    const handleNewConsent = (message: WebSocketMessage) => {
      setNotifications(prev => [message, ...prev.slice(0, 49)]); // Keep last 50
    };

    const handleConsentUpdate = (message: WebSocketMessage) => {
      setNotifications(prev => [message, ...prev.slice(0, 49)]);
    };

    const handleNewAuditLog = (message: WebSocketMessage) => {
      setNotifications(prev => [message, ...prev.slice(0, 49)]);
    };

    const handleDashboardUpdate = (message: WebSocketMessage) => {
      setNotifications(prev => [message, ...prev.slice(0, 49)]);
    };

    const handleSystemAlert = (message: WebSocketMessage) => {
      setNotifications(prev => [message, ...prev.slice(0, 49)]);
    };

    socket.on('consent:new', handleNewConsent);
    socket.on('consent:updated', handleConsentUpdate);
    socket.on('audit:new', handleNewAuditLog);
    socket.on('dashboard:update', handleDashboardUpdate);
    socket.on('system:alert', handleSystemAlert);

    return () => {
      socket.off('consent:new', handleNewConsent);
      socket.off('consent:updated', handleConsentUpdate);
      socket.off('audit:new', handleNewAuditLog);
      socket.off('dashboard:update', handleDashboardUpdate);
      socket.off('system:alert', handleSystemAlert);

      unsubscribe('dashboard');
      unsubscribe('audit');
      unsubscribe('consents');
    };
  }, [socket, isConnected, subscribe, unsubscribe]);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return {
    isConnected,
    error,
    notifications,
    clearNotifications,
  };
};
