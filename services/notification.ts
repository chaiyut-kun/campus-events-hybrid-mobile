import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { CampusEvent } from '../types/event';

export const REMINDER_CHANNEL = 'event-reminders';

/**
 * Configure foreground notification behavior so banners and sounds appear
 * even when the user is actively viewing the application.
 */
export function configureNotificationHandler(): void {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

/**
 * Ensures notification permission is granted.
 * Creates an Android notification channel with HIGH importance before prompting.
 */
export async function ensureNotificationPermission(): Promise<boolean> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(REMINDER_CHANNEL, {
      name: 'การเตือนกิจกรรม',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      sound: 'default',
    });
  }

  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;

  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted;
}

/**
 * Schedules a local notification reminder for a campus event.
 * Supports standard 30-minute advance trigger or optional test seconds offset.
 */
export async function scheduleEventReminder(
  event: CampusEvent,
  secondsOffset?: number,
): Promise<string> {
  const granted = await ensureNotificationPermission();
  if (!granted) {
    throw new Error('notification-permission-denied');
  }

  let trigger: Notifications.NotificationTriggerInput;

  if (typeof secondsOffset === 'number' && secondsOffset > 0) {
    // Quick test trigger for verification & video recording
    trigger = {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: secondsOffset,
      repeats: false,
      channelId: REMINDER_CHANNEL,
    };
  } else {
    // Standard 30-minute advance trigger
    const eventTime = new Date(event.startsAt).getTime();
    const triggerDate = new Date(eventTime - 30 * 60 * 1000);

    if (triggerDate.getTime() <= Date.now()) {
      throw new Error('reminder-time-has-passed');
    }

    trigger = {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: triggerDate,
      channelId: REMINDER_CHANNEL,
    };
  }

  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title: `ใกล้ถึงเวลา: ${event.title}`,
      body: `เริ่มในอีก 30 นาทีที่ ${event.location.name}`,
      sound: 'default',
      data: { eventId: event.id },
    },
    trigger,
  });

  return notificationId;
}

/**
 * Cancels a scheduled local event reminder by its notification ID.
 */
export async function cancelEventReminder(notificationId: string): Promise<void> {
  if (!notificationId) return;
  await Notifications.cancelScheduledNotificationAsync(notificationId);
}

/**
 * Extracts and validates the eventId from a NotificationResponse object.
 * Returns null if the response is invalid or not a default tap action.
 */
export function extractEventIdFromResponse(
  response: Notifications.NotificationResponse | null,
): string | null {
  if (!response) return null;

  if (
    response.actionIdentifier &&
    response.actionIdentifier !== Notifications.DEFAULT_ACTION_IDENTIFIER
  ) {
    return null;
  }

  const eventId = response.notification?.request?.content?.data?.eventId;
  return typeof eventId === 'string' && eventId.trim().length > 0 ? eventId : null;
}
