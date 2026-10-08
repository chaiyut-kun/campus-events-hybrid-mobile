import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { SessionState, User } from '../types/auth';
import {
  saveTokens,
  getAccessToken,
  getRefreshToken,
  clearTokens,
} from '../services/auth-storage';
import {
  loginApi,
  getCurrentUserApi,
  refreshTokenApi,
  logoutApi,
} from '../services/auth-api';
import { studentProfile } from '../data/profile';

export type AuthContextValue = {
  session: SessionState;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<boolean>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<SessionState>({ status: 'loading' });

  // ── Session Restoration (Lab 8: Restore session on app start) ───────────
  const restoreSession = useCallback(async () => {
    try {
      const [accessToken, refreshToken] = await Promise.all([
        getAccessToken(),
        getRefreshToken(),
      ]);

      if (!accessToken) {
        setSession({ status: 'anonymous' });
        return;
      }

      try {
        const user = await getCurrentUserApi(accessToken);
        setSession({
          status: 'authenticated',
          accessToken,
          refreshToken: refreshToken || '',
          user,
        });
      } catch (err) {
        // If token verification failed, try refreshing token if available
        if (refreshToken) {
          try {
            const newTokens = await refreshTokenApi(refreshToken);
            await saveTokens(newTokens.accessToken, newTokens.refreshToken);
            const user = await getCurrentUserApi(newTokens.accessToken);
            setSession({
              status: 'authenticated',
              accessToken: newTokens.accessToken,
              refreshToken: newTokens.refreshToken,
              user,
            });
            return;
          } catch {
            // Failed refresh
          }
        }

        // Clean up invalid tokens and return to anonymous
        await clearTokens();
        setSession({ status: 'anonymous' });
      }
    } catch {
      setSession({ status: 'anonymous' });
    }
  }, []);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  // ── Login Action ────────────────────────────────────────────────────────
  const login = useCallback(async (email: string, password: string) => {
    const res = await loginApi(email, password);
    await saveTokens(res.accessToken, res.refreshToken);
    setSession({
      status: 'authenticated',
      accessToken: res.accessToken,
      refreshToken: res.refreshToken,
      user: res.user,
    });
  }, []);

  // ── Logout Action ───────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    const currentToken =
      session.status === 'authenticated' ? session.accessToken : undefined;

    await clearTokens();
    setSession({ status: 'anonymous' });

    if (currentToken) {
      logoutApi(currentToken).catch(() => {});
    }
  }, [session]);

  // ── Refresh Action ──────────────────────────────────────────────────────
  const refreshSession = useCallback(async (): Promise<boolean> => {
    if (session.status !== 'authenticated' || !session.refreshToken) {
      return false;
    }

    try {
      const newTokens = await refreshTokenApi(session.refreshToken);
      await saveTokens(newTokens.accessToken, newTokens.refreshToken);
      setSession((prev) =>
        prev.status === 'authenticated'
          ? {
              ...prev,
              accessToken: newTokens.accessToken,
              refreshToken: newTokens.refreshToken,
            }
          : prev,
      );
      return true;
    } catch {
      await logout();
      return false;
    }
  }, [session, logout]);

  const value = useMemo(
    () => ({
      session,
      login,
      logout,
      refreshSession,
    }),
    [session, login, logout, refreshSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

const defaultAuthContext: AuthContextValue = {
  session: {
    status: 'authenticated',
    accessToken: 'mock-access-token',
    refreshToken: 'mock-refresh-token',
    user: {
      id: 'usr-001',
      email: 'student@campus.ac.th',
      studentId: studentProfile.studentId,
      name: studentProfile.name,
      faculty: studentProfile.branch,
      role: 'student',
    },
  },
  login: async () => {},
  logout: async () => {},
  refreshSession: async () => true,
};

/**
 * Custom hook to consume the AuthContext.
 * Falls back to defaultAuthContext in test environments without AuthProvider.
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    return defaultAuthContext;
  }
  return context;
}
