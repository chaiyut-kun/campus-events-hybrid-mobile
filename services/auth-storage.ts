import * as SecureStore from 'expo-secure-store';

/**
 * Storage keys matching Lab 8 specifications.
 * Tokens MUST be stored in SecureStore (Keychain/Keystore), NEVER in AsyncStorage.
 */
export const ACCESS_TOKEN_KEY = 'auth_access_token';
export const REFRESH_TOKEN_KEY = 'auth_refresh_token';

/**
 * Saves both access and refresh tokens to SecureStore.
 */
export async function saveTokens(accessToken: string, refreshToken: string): Promise<void> {
  await Promise.all([
    SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken),
    SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken),
  ]);
}

/**
 * Retrieves the stored access token.
 */
export async function getAccessToken(): Promise<string | null> {
  return SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
}

/**
 * Retrieves the stored refresh token.
 */
export async function getRefreshToken(): Promise<string | null> {
  return SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
}

/**
 * Checks whether session tokens are present in SecureStore.
 */
export async function hasTokens(): Promise<boolean> {
  const token = await getAccessToken();
  return Boolean(token);
}

/**
 * Clears all auth session tokens from SecureStore on logout or token expiry.
 */
export async function clearTokens(): Promise<void> {
  await Promise.all([
    SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
    SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
  ]);
}
