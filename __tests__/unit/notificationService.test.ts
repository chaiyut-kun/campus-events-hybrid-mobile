import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import {
  ensureNotificationPermission,
  scheduleEventReminder,
  cancelEventReminder,
  extractEventIdFromResponse,
  REMINDER_CHANNEL,
} from '../../services/notification';
import { CampusEvent } from '../../types/event';

describe('Unit Test: notificationService', () => {
  const mockFutureEvent: CampusEvent = {
    id: 'test-evt-future',
    title: 'Future Tech Summit',
    description: 'An upcoming future event',
    startsAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours in future
    imageUrl: 'https://example.com/banner.jpg',
    location: {
      name: 'Main Auditorium',
      latitude: 13.7563,
      longitude: 100.5018,
    },
    category: 'Technology',
  };

  const mockPastEvent: CampusEvent = {
    ...mockFutureEvent,
    id: 'test-evt-past',
    startsAt: new Date(Date.now() - 60 * 1000).toISOString(), // 1 minute in past
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('ensureNotificationPermission', () => {
    it('requests permission and creates Android notification channel with HIGH importance', async () => {
      const origOS = Platform.OS;
      (Platform as any).OS = 'android';

      const granted = await ensureNotificationPermission();

      expect(Notifications.setNotificationChannelAsync).toHaveBeenCalledWith(
        REMINDER_CHANNEL,
        expect.objectContaining({
          name: 'การเตือนกิจกรรม',
          importance: Notifications.AndroidImportance.HIGH,
        }),
      );
      expect(granted).toBe(true);

      (Platform as any).OS = origOS;
    });

    it('returns false when user denies permission', async () => {
      (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValueOnce({
        granted: false,
        canAskAgain: true,
      });
      (Notifications.requestPermissionsAsync as jest.Mock).mockResolvedValueOnce({
        granted: false,
        canAskAgain: false,
      });

      const granted = await ensureNotificationPermission();
      expect(granted).toBe(false);
    });
  });

  describe('scheduleEventReminder', () => {
    it('schedules notification 30 minutes before event startsAt', async () => {
      (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValueOnce({
        granted: true,
      });

      const notifId = await scheduleEventReminder(mockFutureEvent);

      expect(notifId).toBe('mock-notification-id-123');
      expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          content: expect.objectContaining({
            title: `ใกล้ถึงเวลา: ${mockFutureEvent.title}`,
            body: expect.stringContaining(mockFutureEvent.location.name),
            data: { eventId: mockFutureEvent.id },
          }),
          trigger: expect.objectContaining({
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            channelId: REMINDER_CHANNEL,
          }),
        }),
      );
    });

    it('throws reminder-time-has-passed when event starts in less than 30 minutes or already past', async () => {
      (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValueOnce({
        granted: true,
      });

      await expect(scheduleEventReminder(mockPastEvent)).rejects.toThrow(
        'reminder-time-has-passed',
      );
    });

    it('schedules quick test notification when secondsOffset is provided', async () => {
      (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValueOnce({
        granted: true,
      });

      const notifId = await scheduleEventReminder(mockFutureEvent, 5);

      expect(notifId).toBe('mock-notification-id-123');
      expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          trigger: expect.objectContaining({
            type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds: 5,
            channelId: REMINDER_CHANNEL,
          }),
        }),
      );
    });

    it('throws notification-permission-denied if permission is not granted', async () => {
      (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValueOnce({
        granted: false,
      });
      (Notifications.requestPermissionsAsync as jest.Mock).mockResolvedValueOnce({
        granted: false,
      });

      await expect(scheduleEventReminder(mockFutureEvent)).rejects.toThrow(
        'notification-permission-denied',
      );
    });
  });

  describe('cancelEventReminder', () => {
    it('cancels scheduled notification using notificationId', async () => {
      await cancelEventReminder('notif-to-cancel-999');

      expect(Notifications.cancelScheduledNotificationAsync).toHaveBeenCalledWith(
        'notif-to-cancel-999',
      );
    });

    it('does nothing if empty notificationId is provided', async () => {
      await cancelEventReminder('');
      expect(Notifications.cancelScheduledNotificationAsync).not.toHaveBeenCalled();
    });
  });

  describe('extractEventIdFromResponse', () => {
    it('extracts eventId from valid notification response', () => {
      const response = {
        actionIdentifier: Notifications.DEFAULT_ACTION_IDENTIFIER,
        notification: {
          request: {
            content: {
              data: { eventId: 'evt-001' },
            },
          },
        },
      } as any;

      expect(extractEventIdFromResponse(response)).toBe('evt-001');
    });

    it('returns null for null response or missing eventId', () => {
      expect(extractEventIdFromResponse(null)).toBeNull();
      expect(
        extractEventIdFromResponse({
          actionIdentifier: Notifications.DEFAULT_ACTION_IDENTIFIER,
          notification: { request: { content: { data: {} } } },
        } as any),
      ).toBeNull();
    });

    it('returns null if actionIdentifier is not default tap', () => {
      const response = {
        actionIdentifier: 'custom-dismiss-action',
        notification: {
          request: {
            content: {
              data: { eventId: 'evt-001' },
            },
          },
        },
      } as any;

      expect(extractEventIdFromResponse(response)).toBeNull();
    });
  });
});
