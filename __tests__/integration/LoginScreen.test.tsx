import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginScreen from '../../app/login';
import { AuthContext, AuthContextValue } from '../../context/AuthContext';
import { router } from 'expo-router';

// Mock expo-router
jest.mock('expo-router', () => ({
  router: {
    back: jest.fn(),
    canGoBack: jest.fn(() => true),
    replace: jest.fn(),
  },
}));

describe('Integration Test: LoginScreen', () => {
  const mockLogin = jest.fn();
  const mockLogout = jest.fn();
  const mockRefreshSession = jest.fn();

  const mockAuthContext: AuthContextValue = {
    session: { status: 'anonymous' },
    login: mockLogin,
    logout: mockLogout,
    refreshSession: mockRefreshSession,
  };

  const renderLogin = async () =>
    await render(
      <AuthContext.Provider value={mockAuthContext}>
        <LoginScreen />
      </AuthContext.Provider>,
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all essential login elements', async () => {
    const { getAllByText, getByTestId } = await renderLogin();

    expect(getAllByText('เข้าสู่ระบบ').length).toBeGreaterThanOrEqual(1);
    expect(getByTestId('login-close-btn')).toBeTruthy();
    expect(getByTestId('login-email-input')).toBeTruthy();
    expect(getByTestId('login-password-input')).toBeTruthy();
    expect(getByTestId('demo-account-btn')).toBeTruthy();
    expect(getByTestId('login-submit-btn')).toBeTruthy();
  });

  it('auto-fills demo student credentials when demo button is pressed', async () => {
    const { getByTestId } = await renderLogin();

    const demoBtn = getByTestId('demo-account-btn');
    fireEvent.press(demoBtn);

    await waitFor(() => {
      expect(getByTestId('login-email-input').props.value).toBe('student@campus.ac.th');
      expect(getByTestId('login-password-input').props.value).toBe('password123');
    });
  });

  it('submits login form and navigates back on success', async () => {
    mockLogin.mockResolvedValueOnce(undefined);

    const { getByTestId } = await renderLogin();

    const demoBtn = getByTestId('demo-account-btn');
    fireEvent.press(demoBtn);

    await waitFor(() => {
      expect(getByTestId('login-email-input').props.value).toBe('student@campus.ac.th');
    });

    const submitBtn = getByTestId('login-submit-btn');
    fireEvent.press(submitBtn);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('student@campus.ac.th', 'password123');
      expect(router.back).toHaveBeenCalled();
    });
  });

  it('shows error banner when submitted with empty fields', async () => {
    const { getByTestId, getByText } = await renderLogin();

    const submitBtn = getByTestId('login-submit-btn');
    fireEvent.press(submitBtn);

    await waitFor(() => {
      expect(getByTestId('login-error-banner')).toBeTruthy();
      expect(getByText('กรุณากรอกอีเมล/รหัสนักศึกษา และรหัสผ่าน')).toBeTruthy();
    });

    expect(mockLogin).not.toHaveBeenCalled();
  });
});
