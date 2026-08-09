import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserSession, Role } from '../types';

interface AuthContextType {
  session: UserSession;
  isAdmin: boolean;
  login: (email?: string, password?: string, role?: Role) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'dh_user_session_2026';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<UserSession>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return { role: 'customer' };
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(session));
    } catch (e) {
      console.error(e);
    }
  }, [session]);

  // Verify admin session if token exists
  useEffect(() => {
    if (session.role === 'admin' && session.token) {
      fetch('/api/admin/verify', {
        headers: {
          Authorization: `Bearer ${session.token}`
        }
      }).then(res => {
        if (!res.ok) {
          // Token expired or invalid
          setSession({ role: 'customer' });
        }
      }).catch(err => {
        console.error('Session verify failed:', err);
      });
    }
  }, []);

  const login = async (email?: string, password?: string, role: Role = 'admin'): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role })
      });
      const data = await res.json();
      if (data.success && data.session) {
        setSession(data.session);
        setIsLoading(false);
        return true;
      } else {
        setError(data.message || 'Login failed');
        setIsLoading(false);
        return false;
      }
    } catch (err) {
      setError('Network connection error');
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setSession({ role: 'customer' });
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  };

  const isAdmin = session.role === 'admin' && !!session.token;

  return (
    <AuthContext.Provider value={{ session, isAdmin, login, logout, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
