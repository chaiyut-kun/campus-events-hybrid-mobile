import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import FavoritesScreen from '../../app/(tabs)/favorites';
import { FavoritesProvider, useFavorites } from '../../context/FavoritesContext';
import { EventsProvider } from '../../context/EventsContext';
import { router } from 'expo-router';

// Mock expo-router
jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
    replace: jest.fn(),
  },
}));

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <EventsProvider>
      <FavoritesProvider>{children}</FavoritesProvider>
    </EventsProvider>
  );
}

describe('Integration Test: FavoritesScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders header and empty state when no favorites exist', async () => {
    const { getByText, getByTestId } = await render(
      <Wrapper>
        <FavoritesScreen />
      </Wrapper>,
    );

    expect(getByText('รายการโปรด')).toBeTruthy();
    expect(getByTestId('favorites-count-badge')).toBeTruthy();
    expect(getByText('ยังไม่มีกิจกรรมที่บันทึกไว้')).toBeTruthy();
  });

  it('navigates to /events when pressing action button on empty state', async () => {
    const { getByText } = await render(
      <Wrapper>
        <FavoritesScreen />
      </Wrapper>,
    );

    const actionBtn = getByText('ดูกิจกรรมทั้งหมด');
    fireEvent.press(actionBtn);
    expect(router.push).toHaveBeenCalledWith('/events');
  });

  it('displays favorited events and allows opening event detail', async () => {
    function SeedChild({ children }: { children: React.ReactNode }) {
      const { toggleFavorite, favorites } = useFavorites();
      React.useEffect(() => {
        if (!favorites.includes('evt-001')) {
          toggleFavorite('evt-001');
        }
      }, [favorites, toggleFavorite]);
      return <>{children}</>;
    }

    const { getByText } = await render(
      <EventsProvider>
        <FavoritesProvider>
          <SeedChild>
            <FavoritesScreen />
          </SeedChild>
        </FavoritesProvider>
      </EventsProvider>,
    );

    // Event title should be rendered
    await waitFor(() => {
      expect(getByText('Campus Hackathon 2026: AI for Good')).toBeTruthy();
    });

    // Open detail
    const card = getByText('Campus Hackathon 2026: AI for Good');
    fireEvent.press(card);
    expect(router.push).toHaveBeenCalledWith({
      pathname: '/events/[id]',
      params: { id: 'evt-001' },
    });
  });
});
