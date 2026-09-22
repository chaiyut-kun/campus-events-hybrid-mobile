import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import HomeScreen from '../../app/(tabs)/index';
import { router } from 'expo-router';

// Mock expo-router
jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
  },
  usePathname: jest.fn(() => '/'),
}));

describe('Integration Test: HomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders brand logo and title "DevFolio"', async () => {
    const { getByText } = await render(<HomeScreen />);
    expect(getByText('<>')).toBeTruthy();
    expect(getByText('DevFolio')).toBeTruthy();
  });

  it('navigates to /profile when avatar button is pressed', async () => {
    const { getByLabelText } = await render(<HomeScreen />);
    const avatarButton = getByLabelText('Open Profile by Avatar');
    fireEvent.press(avatarButton);
    expect(router.push).toHaveBeenCalledWith('/profile');
  });

  it('opens burger navigation menu and navigates to events and profile', async () => {
    const { getByLabelText, getByText } = await render(<HomeScreen />);
    const menuButton = getByLabelText('Open navigation menu');
    fireEvent.press(menuButton);

    // Verify modal content appears
    await waitFor(() => {
      expect(getByText('Navigation')).toBeTruthy();
      expect(getByText('Campus Events')).toBeTruthy();
    });

    // Navigate to Campus Events
    const eventsLink = getByLabelText('Navigate to Campus Events');
    fireEvent.press(eventsLink);
    expect(router.push).toHaveBeenCalledWith('/events');
  });
});
