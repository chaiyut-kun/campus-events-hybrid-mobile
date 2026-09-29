import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import NotFoundScreen from '../../app/+not-found';
import { router } from 'expo-router';

// Mock expo-router
jest.mock('expo-router', () => ({
  router: {
    replace: jest.fn(),
  },
  Link: 'Link',
}));

describe('Integration Test: NotFoundScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders not found title and description', async () => {
    const { getByTestId, getByText } = await render(<NotFoundScreen />);

    expect(getByTestId('not-found-screen')).toBeTruthy();
    expect(getByTestId('not-found-title')).toHaveTextContent('ไม่พบหน้าที่ต้องการ');
    expect(getByText('ขออภัย เส้นทางหรือหน้าที่คุณกำลังเข้าถึงไม่มีอยู่ในระบบ')).toBeTruthy();
  });

  it('navigates back to /events when return button is pressed', async () => {
    const { getByTestId } = await render(<NotFoundScreen />);

    const backBtn = getByTestId('not-found-back-home-btn');
    fireEvent.press(backBtn);
    expect(router.replace).toHaveBeenCalledWith('/events');
  });
});
