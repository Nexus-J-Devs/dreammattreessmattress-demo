import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { WSNotification } from '../types';

interface WebSocketContextType {
  isConnected: boolean;
  notifications: WSNotification[];
  toastNotifications: WSNotification[];
  dismissToast: (id: string) => void;
  clearAllNotifications: () => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState<WSNotification[]>([]);
  const [toastNotifications, setToastNotifications] = useState<WSNotification[]>([]);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    let isMounted = true;
    let retryCount = 0;
    const MAX_RETRIES = 5;

    const connectWebSocket = () => {
      if (!isMounted) return;

      try {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${window.location.host}/ws`;

        const ws = new WebSocket(wsUrl);
        socketRef.current = ws;

        ws.onopen = () => {
          if (!isMounted) return;
          setIsConnected(true);
          retryCount = 0;
        };

        ws.onmessage = (event) => {
          if (!isMounted) return;
          try {
            const notification: WSNotification = JSON.parse(event.data);
            setNotifications(prev => [notification, ...prev]);

            // Trigger floating toast for important alerts
            if (notification.type === 'LOW_STOCK' || notification.type === 'QUIZ_SUBMISSION' || notification.type === 'NEW_SALE') {
              setToastNotifications(prev => [notification, ...prev.slice(0, 4)]);
            }
          } catch (e) {
            console.warn('Failed to parse WS message:', e);
          }
        };

        ws.onclose = () => {
          if (!isMounted) return;
          setIsConnected(false);

          if (retryCount < MAX_RETRIES) {
            retryCount++;
            reconnectTimer = setTimeout(connectWebSocket, Math.min(10000, 2000 * retryCount));
          }
        };

        ws.onerror = () => {
          if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
            try {
              ws.close();
            } catch (_) {
              // Ignore close errors
            }
          }
        };
      } catch (err) {
        console.warn('WebSocket connection notice:', err);
      }
    };

    connectWebSocket();

    return () => {
      isMounted = false;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      if (socketRef.current) {
        try {
          socketRef.current.close();
        } catch (_) {
          // Ignore close errors
        }
      }
    };
  }, []);

  const dismissToast = (id: string) => {
    setToastNotifications(prev => prev.filter(t => t.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <WebSocketContext.Provider
      value={{
        isConnected,
        notifications,
        toastNotifications,
        dismissToast,
        clearAllNotifications
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

