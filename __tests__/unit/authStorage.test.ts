import * as SecureStore from 'expo-secure-store';
import {
  saveTokens,
  getAccessToken,
  getRefreshToken,
  hasTokens,
  clearTokens,
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
} from '../../services/auth-storage';

describe('Unit Test: authStorage', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    await clearTokens();
  });

  it('saves and retrieves access and refresh tokens from SecureStore', async () => {
    await saveTokens('test-access-token-123', 'test-refresh-token-456');

    expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
      ACCESS_TOKEN_KEY,
      'test-access-token-123',
    );
    expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
      REFRESH_TOKEN_KEY,
      'test-refresh-token-456',
    );

    const accessToken = await getAccessToken();
    const refreshToken = await getRefreshToken();

    expect(accessToken).toBe('test-access-token-123');
    expect(refreshToken).toBe('test-refresh-token-456');
  });

  it('returns true for hasTokens when access token is present', async () => {
    expect(await hasTokens()).toBe(false);

    await saveTokens('access-token', 'refresh-token');
    expect(await hasTokens()).toBe(true);
  });

  it('clears both tokens from SecureStore', async () => {
    await saveTokens('token-to-delete', 'refresh-to-delete');
    await clearTokens();

    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith(ACCESS_TOKEN_KEY);
    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith(REFRESH_TOKEN_KEY);

    const accessToken = await getAccessToken();
    expect(accessToken).toBeNull();
  });

  it('uses SecureStore keys complying with Expo regex ^[\\w.-]+$', () => {
    const validKeyRegex = /^[\w.-]+$/;
    expect(ACCESS_TOKEN_KEY).toMatch(validKeyRegex);
    expect(REFRESH_TOKEN_KEY).toMatch(validKeyRegex);
    expect(ACCESS_TOKEN_KEY).not.toContain('/');
    expect(REFRESH_TOKEN_KEY).not.toContain('/');
  });

  it('throws an error if an invalid key with slash is supplied to SecureStore', async () => {
    await expect(SecureStore.setItemAsync('invalid/key', 'val')).rejects.toThrow(
      'Invalid key provided to SecureStore. Keys must not be empty and contain only alphanumeric characters, ".", "-", and "_".',
    );
  });
});
