import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Linking } from 'react-native';
import ProfileScreen from '../../app/(tabs)/profile';
import { router } from 'expo-router';

// Mock expo-router
jest.mock('expo-router', () => ({
  router: {
    back: jest.fn(),
    canGoBack: jest.fn(() => true),
    push: jest.fn(),
  },
}));

describe('Integration Test: ProfileScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Linking, 'openURL').mockImplementation(() => Promise.resolve());
  });

  it('renders student profile information correctly', async () => {
    const { getByText } = await render(<ProfileScreen />);
    expect(getByText('Chaiyut Tavon')).toBeTruthy();
    expect(getByText('Computer and Information Science')).toBeTruthy();
    expect(getByText('Active Student')).toBeTruthy();
    expect(getByText('ID: 2024-CIS-8492')).toBeTruthy();
    expect(getByText('Year 3 • Sem 1')).toBeTruthy();
    expect(getByText('@chaiyut-kun')).toBeTruthy();
  });

  it('renders enrolled subject details', async () => {
    const { getByText } = await render(<ProfileScreen />);
    expect(getByText('ENROLLED SUBJECT')).toBeTruthy();
    expect(getByText('IN405109')).toBeTruthy();
    expect(getByText('3.0 Credits')).toBeTruthy();
    expect(getByText('Hybrid Mobile Application Programming')).toBeTruthy();
  });

  it('renders all interest chips with emojis', async () => {
    const { getByText } = await render(<ProfileScreen />);
    expect(getByText('INTERESTED IN')).toBeTruthy();
    expect(getByText('5 topics')).toBeTruthy();
    expect(getByText('💻 Programming')).toBeTruthy();
    expect(getByText('⚙️ Software Engineering')).toBeTruthy();
    expect(getByText('🌐 Networking')).toBeTruthy();
    expect(getByText('🏸 Badminton')).toBeTruthy();
    expect(getByText('⚽ Football')).toBeTruthy();
  });

  it('opens GitHub profile link when Open button is pressed', async () => {
    const { getByLabelText } = await render(<ProfileScreen />);
    const githubBtn = getByLabelText('Open GitHub Profile');
    fireEvent.press(githubBtn);
    expect(Linking.openURL).toHaveBeenCalledWith('https://github.com/chaiyut-kun');
  });

  it('navigates back when back button is pressed', async () => {
    const { getByLabelText } = await render(<ProfileScreen />);
    const backBtn = getByLabelText('Go back');
    fireEvent.press(backBtn);
    expect(router.back).toHaveBeenCalled();
  });
});
