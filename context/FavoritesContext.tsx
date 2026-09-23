import React, { createContext, useContext, useReducer, useCallback, useMemo } from 'react';
import { FavoriteAction } from '../types/event';

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

type FavoritesContextValue = {
  favorites: string[];
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => void;
  clearFavorites: () => void;
  savedCount: number;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

/**
 * Wrap this around the route tree that needs favorites.
 * Placed at Root Layout per design decision.
 */
export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, dispatch] = useReducer(favoriteReducer, []);

  const isFavorite = useCallback(
    (id: string) => favorites.includes(id),
    [favorites],
  );

  const toggleFavorite = useCallback(
    (id: string) => dispatch({ type: 'toggle', id }),
    [],
  );

  const clearFavorites = useCallback(
    () => dispatch({ type: 'clear' }),
    [],
  );

  const savedCount = favorites.length;

  const value = useMemo<FavoritesContextValue>(
    () => ({ favorites, isFavorite, toggleFavorite, clearFavorites, savedCount }),
    [favorites, isFavorite, toggleFavorite, clearFavorites, savedCount],
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
