import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useMemo,
  useState,
  useEffect,
} from 'react';
import { FavoriteAction } from '../types/event';
import {
  loadFavoriteIds,
  saveFavoriteIds,
  clearFavoriteIds as clearFavoriteIdsFromStorage,
} from '../services/favorites-storage';

// ── Reducer (exported for unit testing) ──────────────────────────────

/**
 * Pure reducer for favorite IDs.
 * Discriminated union ensures TypeScript validates each action payload.
 */
export function favoriteReducer(state: string[], action: FavoriteAction): string[] {
  switch (action.type) {
    case 'hydrate':
      return action.ids;
    case 'toggle':
      return state.includes(action.id)
        ? state.filter((id) => id !== action.id)
        : [...state, action.id];
    case 'clear':
      return [];
  }
}

// ── Context & Provider ───────────────────────────────────────────────

export type FavoritesContextValue = {
  favorites: string[];
  isHydrated: boolean;
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => void;
  clearFavorites: () => void;
  savedCount: number;
};

export const FavoritesContext = createContext<FavoritesContextValue | null>(null);

/**
 * Wrap this around the route tree that needs favorites.
 * Placed at Root Layout per design decision.
 */
export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, dispatch] = useReducer(favoriteReducer, []);
  const [isHydrated, setIsHydrated] = useState(false);

  // ── Hydrate from AsyncStorage on mount ────────────────────────────
  useEffect(() => {
    let mounted = true;
    (async () => {
      const storedIds = await loadFavoriteIds();
      if (mounted) {
        dispatch({ type: 'hydrate', ids: storedIds });
        setIsHydrated(true);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // ── Sync to AsyncStorage on change (only after hydration completes) ─
  useEffect(() => {
    if (isHydrated) {
      saveFavoriteIds(favorites);
    }
  }, [favorites, isHydrated]);

  const isFavorite = useCallback(
    (id: string) => favorites.includes(id),
    [favorites],
  );

  const toggleFavorite = useCallback(
    (id: string) => dispatch({ type: 'toggle', id }),
    [],
  );

  const clearFavorites = useCallback(() => {
    dispatch({ type: 'clear' });
    clearFavoriteIdsFromStorage();
  }, []);

  const savedCount = favorites.length;

  const value = useMemo<FavoritesContextValue>(
    () => ({ favorites, isHydrated, isFavorite, toggleFavorite, clearFavorites, savedCount }),
    [favorites, isHydrated, isFavorite, toggleFavorite, clearFavorites, savedCount],
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

/**
 * Access favorites from any descendant of FavoritesProvider.
 * Throws if Provider is missing — fail fast instead of silent undefined.
 */
export function useFavorites(): FavoritesContextValue {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return ctx;
}
