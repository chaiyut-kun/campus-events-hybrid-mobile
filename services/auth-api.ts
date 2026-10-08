import { getApiUrl, ApiError } from './events-api';
import { LoginResponse, User, AuthTokens } from '../types/auth';

/**
 * Calls POST /auth/login with credentials.
 */
export async function loginApi(
  email: string,
  password: string,
  signal?: AbortSignal,
): Promise<LoginResponse> {
  const baseUrl = getApiUrl();

  const response = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
    signal,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new ApiError(
      errorBody.message || `เข้าสู่ระบบไม่สำเร็จ (${response.status})`,
      response.status,
      errorBody.code || 'LOGIN_FAILED',
    );
  }

  const payload = await response.json();
  return payload as LoginResponse;
}

/**
 * Calls GET /auth/me with Bearer token to retrieve current user profile.
 */
export async function getCurrentUserApi(
  token: string,
  signal?: AbortSignal,
): Promise<User> {
  const baseUrl = getApiUrl();

  const response = await fetch(`${baseUrl}/auth/me`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    signal,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new ApiError(
      errorBody.message || `ยืนยันตัวตนไม่สำเร็จ (${response.status})`,
      response.status,
      errorBody.code || 'AUTH_FAILED',
    );
  }

  const payload = await response.json();
  return payload.user as User;
}

/**
 * Calls POST /auth/refresh to exchange a refresh token for new access and refresh tokens.
 */
export async function refreshTokenApi(
  refreshToken: string,
  signal?: AbortSignal,
): Promise<AuthTokens> {
  const baseUrl = getApiUrl();

  const response = await fetch(`${baseUrl}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
    signal,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new ApiError(
      errorBody.message || `ต่ออายุ Token ไม่สำเร็จ (${response.status})`,
      response.status,
      errorBody.code || 'REFRESH_FAILED',
    );
  }

  const payload = await response.json();
  return payload as AuthTokens;
}

/**
 * Calls POST /auth/logout to invalidate the session.
 */
export async function logoutApi(
  token?: string,
  signal?: AbortSignal,
): Promise<void> {
  try {
    const baseUrl = getApiUrl();
    await fetch(`${baseUrl}/auth/logout`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        'Content-Type': 'application/json',
      },
      signal,
    });
  } catch {
    // Ignore network error on logout; local token cleanup still proceeds
  }
}
