import AsyncStorage from '@react-native-async-storage/async-storage';

export const FAVORITES_STORAGE_KEY = 'campus-events/favorite-ids/v1';

/**
 * Loads favorite event IDs from local AsyncStorage.
 * Safely handles missing data, invalid JSON, and non-string array schemas without throwing.
 */
export async function loadFavoriteIds(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!raw) return [];

    const value: unknown = JSON.parse(raw);
    return Array.isArray(value) && value.every((id) => typeof id === 'string')
      ? value
      : [];
  } catch (error) {
    console.warn('[favorites-storage] Failed to parse favorite IDs from storage:', error);
    return [];
  }
}

/**
 * Persists favorite event IDs to AsyncStorage.
 */
export async function saveFavoriteIds(ids: string[]): Promise<void> {
  try {
    await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(ids));
  } catch (error) {
    console.error('[favorites-storage] Failed to save favorite IDs to storage:', error);
  }
}

/**
 * Clears stored favorite IDs from AsyncStorage.
 */
export async function clearFavoriteIds(): Promise<void> {
  try {
    await AsyncStorage.removeItem(FAVORITES_STORAGE_KEY);
  } catch (error) {
    console.error('[favorites-storage] Failed to clear favorite IDs from storage:', error);
  }
}
