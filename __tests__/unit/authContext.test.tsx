import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { AuthProvider, useAuth } from '../../context/AuthContext';
import * as authStorage from '../../services/auth-storage';
import * as authApi from '../../services/auth-api';

jest.mock('../../services/auth-storage');
jest.mock('../../services/auth-api');

describe('Unit Test: AuthContext & Provider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('restores session to anonymous when no tokens are found in SecureStore', async () => {
    (authStorage.getAccessToken as jest.Mock).mockResolvedValue(null);
    (authStorage.getRefreshToken as jest.Mock).mockResolvedValue(null);

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = await renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.session.status).toBe('anonymous');
    });
  });

  it('restores session to authenticated when valid token is present in SecureStore', async () => {
    (authStorage.getAccessToken as jest.Mock).mockResolvedValue('stored-token');
    (authStorage.getRefreshToken as jest.Mock).mockResolvedValue('stored-refresh');

    const mockUser = {
      id: 'usr-001',
      name: 'สมชาย ใจดี',
      email: 'student@campus.ac.th',
      studentId: '65070001',
      faculty: 'IT',
      role: 'student' as const,
    };

    (authApi.getCurrentUserApi as jest.Mock).mockResolvedValue(mockUser);

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = await renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.session.status).toBe('authenticated');
    });

    if (result.current.session.status === 'authenticated') {
      expect(result.current.session.user.name).toBe('สมชาย ใจดี');
      expect(result.current.session.accessToken).toBe('stored-token');
    }
  });

  it('login updates session state to authenticated and saves tokens', async () => {
    (authStorage.getAccessToken as jest.Mock).mockResolvedValue(null);
    (authStorage.getRefreshToken as jest.Mock).mockResolvedValue(null);

    const mockLoginRes = {
      accessToken: 'new-access-token',
      refreshToken: 'new-refresh-token',
      user: {
        id: 'usr-001',
        name: 'สมชาย ใจดี',
        email: 'student@campus.ac.th',
        studentId: '65070001',
        faculty: 'IT',
        role: 'student' as const,
      },
    };

    (authApi.loginApi as jest.Mock).mockResolvedValue(mockLoginRes);

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = await renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.session.status).toBe('anonymous');
    });

    await act(async () => {
      await result.current.login('student@campus.ac.th', 'password123');
    });

    expect(authStorage.saveTokens).toHaveBeenCalledWith(
      'new-access-token',
      'new-refresh-token',
    );
    expect(result.current.session.status).toBe('authenticated');
  });

  it('logout clears tokens and sets session state to anonymous', async () => {
    (authStorage.getAccessToken as jest.Mock).mockResolvedValue('stored-token');
    (authStorage.getRefreshToken as jest.Mock).mockResolvedValue('stored-refresh');
    (authApi.getCurrentUserApi as jest.Mock).mockResolvedValue({
      id: 'usr-001',
      name: 'สมชาย',
      email: 'student@campus.ac.th',
      studentId: '65070001',
      faculty: 'IT',
      role: 'student' as const,
    });
    (authApi.logoutApi as jest.Mock).mockResolvedValue(undefined);

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = await renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.session.status).toBe('authenticated');
    });

    await act(async () => {
      await result.current.logout();
    });

    expect(authStorage.clearTokens).toHaveBeenCalled();
    expect(result.current.session.status).toBe('anonymous');
  });
});
