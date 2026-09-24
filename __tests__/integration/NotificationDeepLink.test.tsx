import React from 'react';
import { render } from '@testing-library/react-native';
import RootLayout from '../../app/_layout';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';

// Mock expo-router
jest.mock('expo-router', () => {
  const React = require('react');
  const { View } = require('react-native');

  const MockStack: any = ({ children }: any) =>
    React.createElement(View, { testID: 'root-stack' }, children);
  MockStack.Screen = ({ name }: any) =>
    React.createElement(View, { testID: `stack-screen-${name}` });

  return {
    Stack: MockStack,
    router: {
      push: jest.fn(),
      replace: jest.fn(),
    },
  };
});

describe('Integration Test: NotificationDeepLink & RootLayout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('handles cold start notification by routing to /events/[id] and clearing response', async () => {
    const mockColdStartResponse = {
      actionIdentifier: Notifications.DEFAULT_ACTION_IDENTIFIER,
      notification: {
        request: {
          content: {
            data: { eventId: 'evt-002' },
          },
        },
      },
    } as any;

    (Notifications.getLastNotificationResponse as jest.Mock).mockReturnValueOnce(
      mockColdStartResponse,
    );

    await render(<RootLayout />);

    expect(router.push).toHaveBeenCalledWith({
      pathname: '/events/[id]',
      params: { id: 'evt-002' },
    });
    expect(Notifications.clearLastNotificationResponse).toHaveBeenCalled();
  });

  it('listens for foreground/background notification responses and navigates', async () => {
    let capturedListener: ((response: any) => void) | null = null;
    (Notifications.addNotificationResponseReceivedListener as jest.Mock).mockImplementationOnce(
      (fn) => {
        capturedListener = fn;
        return { remove: jest.fn() };
      },
    );

    await render(<RootLayout />);

    expect(capturedListener).toBeDefined();

    // Trigger incoming notification tap
    capturedListener!({
      actionIdentifier: Notifications.DEFAULT_ACTION_IDENTIFIER,
      notification: {
        request: {
          content: {
            data: { eventId: 'evt-003' },
          },
        },
      },
    });

    expect(router.push).toHaveBeenCalledWith({
      pathname: '/events/[id]',
      params: { id: 'evt-003' },
    });
  });

  it('ignores notification response when payload does not contain eventId', async () => {
    let capturedListener: ((response: any) => void) | null = null;
    (Notifications.addNotificationResponseReceivedListener as jest.Mock).mockImplementationOnce(
      (fn) => {
        capturedListener = fn;
        return { remove: jest.fn() };
      },
    );

    await render(<RootLayout />);

    capturedListener!({
      actionIdentifier: Notifications.DEFAULT_ACTION_IDENTIFIER,
      notification: {
        request: {
          content: {
            data: {},
          },
        },
      },
    });

    expect(router.push).not.toHaveBeenCalled();
  });
});
