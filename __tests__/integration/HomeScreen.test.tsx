import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import HomeScreen from '../../app/(tabs)/index';
import { router } from 'expo-router';

// Mock expo-router
jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
  },
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

  it('navigates to /profile when burger menu button is pressed', async () => {
    const { getByLabelText } = await render(<HomeScreen />);
    const menuButton = getByLabelText('Open Profile by Menu');
    fireEvent.press(menuButton);
    expect(router.push).toHaveBeenCalledWith('/profile');
  });
});
