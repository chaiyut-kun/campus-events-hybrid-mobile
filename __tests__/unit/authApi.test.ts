import {
  loginApi,
  getCurrentUserApi,
  refreshTokenApi,
  logoutApi,
} from '../../services/auth-api';
import { ApiError } from '../../services/events-api';

declare const global: any;

const originalFetch = global.fetch;

describe('Unit Test: authApi', () => {
  const originalEnv = process.env.EXPO_PUBLIC_API_URL;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = 'https://api.campus-events.test';
  });

  afterAll(() => {
    global.fetch = originalFetch;
    process.env.EXPO_PUBLIC_API_URL = originalEnv;
  });

  it('throws ApiError if EXPO_PUBLIC_API_URL is missing', async () => {
    delete process.env.EXPO_PUBLIC_API_URL;

    await expect(loginApi('test@test.com', 'pass')).rejects.toThrow(ApiError);
  });

  it('loginApi sends credentials and returns tokens and user', async () => {
    const mockResponse = {
      accessToken: 'access-123',
      refreshToken: 'refresh-456',
      user: {
        id: 'usr-1',
        name: 'Test Student',
        email: 'student@test.com',
        studentId: '65000001',
        faculty: 'IT',
        role: 'student',
      },
    };

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockResponse),
    } as any);

    const result = await loginApi('student@test.com', 'password123');

    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.campus-events.test/auth/login',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'student@test.com', password: 'password123' }),
      }),
    );
    expect(result.accessToken).toBe('access-123');
    expect(result.user.name).toBe('Test Student');
  });

  it('loginApi throws ApiError when response is not ok (e.g. 401)', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 401,
      json: jest.fn().mockResolvedValue({ message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' }),
    } as any);

    await expect(loginApi('wrong@test.com', 'wrong')).rejects.toThrow('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
  });

  it('getCurrentUserApi sends Bearer token and returns user', async () => {
    const mockUser = {
      id: 'usr-1',
      name: 'Test Student',
      email: 'student@test.com',
      studentId: '65000001',
      faculty: 'IT',
      role: 'student',
    };

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ user: mockUser }),
    } as any);

    const user = await getCurrentUserApi('token-abc');

    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.campus-events.test/auth/me',
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          Authorization: 'Bearer token-abc',
        }),
      }),
    );
    expect(user.id).toBe('usr-1');
  });

  it('refreshTokenApi sends refreshToken and returns new tokens', async () => {
    const mockTokens = {
      accessToken: 'new-access-token',
      refreshToken: 'new-refresh-token',
    };

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockTokens),
    } as any);

    const tokens = await refreshTokenApi('old-refresh-token');

    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.campus-events.test/auth/refresh',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ refreshToken: 'old-refresh-token' }),
      }),
    );
    expect(tokens.accessToken).toBe('new-access-token');
  });

  it('logoutApi sends request and swallows network errors safely', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('Network offline'));

    await expect(logoutApi('token-xyz')).resolves.not.toThrow();
  });
});
