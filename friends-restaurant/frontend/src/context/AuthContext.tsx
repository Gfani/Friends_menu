import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminUser } from '../types/menu';
import { api } from '../api/client';

interface AuthContextType {
  user: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (usernameOrEmail: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Purge any old persistent localStorage tokens immediately to ensure login is always requested
if (typeof window !== 'undefined') {
  try {
    localStorage.removeItem('friends_admin_token');
    localStorage.removeItem('friends_admin_user');
  } catch {
    // Ignore storage errors
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Use sessionStorage so credentials never persist across tab/browser restarts
  const [user, setUser] = useState<AdminUser | null>(() => {
    try {
      const saved = sessionStorage.getItem('friends_admin_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    try {
      return sessionStorage.getItem('friends_admin_token');
    } catch {
      return null;
    }
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = sessionStorage.getItem('friends_admin_token');
      if (storedToken) {
        try {
          const res = await api.getMe();
          setUser(res.admin);
          sessionStorage.setItem('friends_admin_user', JSON.stringify(res.admin));
        } catch (err) {
          console.error('Session expired or invalid:', err);
          logout();
        }
      } else {
        setUser(null);
        setToken(null);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (usernameOrEmail: string, password: string) => {
    const res = await api.login(usernameOrEmail, password);
    setToken(res.token);
    setUser(res.admin);
    sessionStorage.setItem('friends_admin_token', res.token);
    sessionStorage.setItem('friends_admin_user', JSON.stringify(res.admin));
    // Explicitly ensure localStorage does not retain credentials
    localStorage.removeItem('friends_admin_token');
    localStorage.removeItem('friends_admin_user');
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    sessionStorage.removeItem('friends_admin_token');
    sessionStorage.removeItem('friends_admin_user');
    localStorage.removeItem('friends_admin_token');
    localStorage.removeItem('friends_admin_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        logout,
      }}
    >
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

