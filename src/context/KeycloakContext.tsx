import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import Keycloak from 'keycloak-js';

import {
  initKeycloak,
  keycloakDirectLogin,
  keycloakDirectLogout,
  extractUserFromToken,
  getStoredToken,
  clearStoredTokens,
} from '../utils/keycloakClient';
import type { UserData } from '../utils/keycloakClient';

export type { UserData };

interface KeycloakContextType {
  keycloak: Keycloak | null;
  isInitialized: boolean;
  isAuthenticated: boolean;
  user: UserData | null;
  token: string | undefined;
  loading: boolean;
  login: (username: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const KeycloakContext = createContext<KeycloakContextType | undefined>(undefined);

export const KeycloakProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [keycloak, setKeycloak]               = useState<Keycloak | null>(null);
  const [isInitialized, setIsInitialized]     = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser]                       = useState<UserData | null>(null);
  const [token, setToken]                     = useState<string | undefined>(undefined);
  const [loading, setLoading]                 = useState(true);

  // ── On mount: restore session if tokens exist in localStorage ────────────
  useEffect(() => {
    const restore = async () => {
      try {
        const storedToken = getStoredToken();

        if (storedToken) {
          const userData = extractUserFromToken(storedToken);
          if (userData) {
            // Pre-populate state immediately from stored token
            setToken(storedToken);
            setUser(userData);
            setIsAuthenticated(true);
          } else {
            clearStoredTokens();
          }
        }

        // Init Keycloak JS (no redirect — just loads the SDK with stored tokens)
        const kc = await initKeycloak();
        setKeycloak(kc);
        setIsInitialized(true);

        // Wire Keycloak JS events for token management
        kc.onAuthRefreshSuccess = () => {
          console.log('[Keycloak] Token refreshed via SDK');
          if (kc.token) {
            setToken(kc.token);
            localStorage.setItem('kc_token', kc.token);
          }
        };

        kc.onAuthLogout = () => {
          console.log('[Keycloak] Session ended');
          setIsAuthenticated(false);
          setUser(null);
          setToken(undefined);
          clearStoredTokens();
        };

        kc.onTokenExpired = () => {
          console.log('[Keycloak] Token expired — refreshing via SDK');
          kc.updateToken(30)
            .then(() => {
              if (kc.token) {
                setToken(kc.token);
                localStorage.setItem('kc_token', kc.token);
              }
            })
            .catch(() => {
              setIsAuthenticated(false);
              setUser(null);
              setToken(undefined);
              clearStoredTokens();
            });
        };

      } catch (err) {
        console.error('[Keycloak] Init failed:', err);
        setIsInitialized(false);
      } finally {
        setLoading(false);
      }
    };

    restore();
  }, []);

  // ── Login: Direct Access Grant — no redirect ──────────────────────────────
  const login = useCallback(async (username: string, password: string) => {
    const result = await keycloakDirectLogin(username, password);

    if (result.ok && result.data) {
      const userData = extractUserFromToken(result.data.access_token);
      setToken(result.data.access_token);
      setUser(userData);
      setIsAuthenticated(true);

      // Update Keycloak JS instance with new tokens
      try {
        const kc = await initKeycloak();
        setKeycloak(kc);
      } catch {
        // non-fatal — tokens are stored and will work
      }

      return { ok: true };
    }

    return { ok: false, error: result.error };
  }, []);

  // ── Logout: revoke server-side, clear local state ─────────────────────────
  const logout = useCallback(async () => {
    await keycloakDirectLogout();
    setIsAuthenticated(false);
    setUser(null);
    setToken(undefined);
    setKeycloak(null);
    setIsInitialized(false);
  }, []);

  return (
    <KeycloakContext.Provider value={{
      keycloak,
      isInitialized,
      isAuthenticated,
      user,
      token,
      loading,
      login,
      logout,
    }}>
      {children}
    </KeycloakContext.Provider>
  );
};

export const useKeycloak = (): KeycloakContextType => {
  const context = useContext(KeycloakContext);
  if (!context) throw new Error('useKeycloak must be used within KeycloakProvider');
  return context;
};