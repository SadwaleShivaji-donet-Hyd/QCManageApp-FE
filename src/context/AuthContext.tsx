import { createContext, useCallback, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Session } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  session: Session | null;
  isAuthenticated: boolean;
  role: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getStoredSession = (): Session | null => {
  const access_token = localStorage.getItem('access_token');
  const role = localStorage.getItem('role');
  if (access_token && role) return { access_token, role };
  return null;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(getStoredSession);

  const login = useCallback(async (username: string, password: string) => {
    const res = await authService.login(username, password);
    if (!res.ok || !res.data) {
      throw new Error(res.error || 'Login failed');
    }
    localStorage.setItem('access_token', res.data.access_token);
    localStorage.setItem('role', res.data.role);
    setSession({ access_token: res.data.access_token, role: res.data.role });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('role');
    setSession(null);
  }, []);

  return (
    <AuthContext.Provider value={{
      session,
      isAuthenticated: !!session,
      role: session?.role ?? null,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};