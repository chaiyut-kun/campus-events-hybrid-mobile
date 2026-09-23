import { favoriteReducer } from '../../context/FavoritesContext';
import { FavoriteAction } from '../../types/event';

describe('Unit Test: favoriteReducer', () => {
  it('handles hydrate action by replacing state with provided IDs', () => {
    const initialState: string[] = [];
    const action: FavoriteAction = {
      type: 'hydrate',
      ids: ['evt-001', 'evt-002'],
    };

    const newState = favoriteReducer(initialState, action);
    expect(newState).toEqual(['evt-001', 'evt-002']);
  });

  it('handles toggle action by adding id when not present', () => {
    const initialState = ['evt-001'];
    const action: FavoriteAction = {
      type: 'toggle',
      id: 'evt-002',
    };

    const newState = favoriteReducer(initialState, action);
    expect(newState).toEqual(['evt-001', 'evt-002']);
  });

  it('handles toggle action by removing id when already present', () => {
    const initialState = ['evt-001', 'evt-002'];
    const action: FavoriteAction = {
      type: 'toggle',
      id: 'evt-001',
    };

    const newState = favoriteReducer(initialState, action);
    expect(newState).toEqual(['evt-002']);
  });

  it('handles clear action by resetting state to empty array', () => {
    const initialState = ['evt-001', 'evt-002', 'evt-003'];
    const action: FavoriteAction = { type: 'clear' };

    const newState = favoriteReducer(initialState, action);
    expect(newState).toEqual([]);
  });
});
