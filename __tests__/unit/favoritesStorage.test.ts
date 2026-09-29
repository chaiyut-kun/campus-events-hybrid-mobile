import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  loadFavoriteIds,
  saveFavoriteIds,
  clearFavoriteIds,
  FAVORITES_STORAGE_KEY,
} from '../../services/favorites-storage';

describe('Unit Test: favorites-storage', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.clearAllMocks();
  });

  it('returns empty array when storage has no favorites', async () => {
    const favorites = await loadFavoriteIds();
    expect(favorites).toEqual([]);
  });

  it('persists and loads valid favorite IDs', async () => {
    const sampleIds = ['evt-001', 'evt-002'];
    await saveFavoriteIds(sampleIds);

    const loaded = await loadFavoriteIds();
    expect(loaded).toEqual(sampleIds);
  });

  it('handles corrupted non-JSON strings gracefully without throwing', async () => {
    await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, 'corrupted{json');
    const result = await loadFavoriteIds();
    expect(result).toEqual([]);
  });

  it('handles non-array JSON payload safely', async () => {
    await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify({ ids: ['evt-001'] }));
    const result = await loadFavoriteIds();
    expect(result).toEqual([]);
  });

  it('handles array with non-string elements safely', async () => {
    await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify([123, null, { id: 'evt-1' }]));
    const result = await loadFavoriteIds();
    expect(result).toEqual([]);
  });

  it('clears stored favorites from AsyncStorage', async () => {
    await saveFavoriteIds(['evt-001', 'evt-002']);
    await clearFavoriteIds();

    const loaded = await loadFavoriteIds();
    expect(loaded).toEqual([]);
  });
});
