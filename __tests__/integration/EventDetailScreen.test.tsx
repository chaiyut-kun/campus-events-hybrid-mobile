import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert, Linking } from 'react-native';
import EventDetailScreen from '../../app/events/[id]';
import { EventsProvider } from '../../context/EventsContext';
import { FavoritesProvider } from '../../context/FavoritesContext';
import * as Notifications from 'expo-notifications';
import { router, useLocalSearchParams } from 'expo-router';

// Mock expo-router
jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  },
  useLocalSearchParams: jest.fn(),
}));

function renderDetailScreen() {
  return render(
    <EventsProvider>
      <FavoritesProvider>
        <EventDetailScreen />
      </FavoritesProvider>
    </EventsProvider>,
  );
}

describe('Integration Test: EventDetailScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useLocalSearchParams as jest.Mock).mockReturnValue({ id: 'evt-001' });
  });

  it('renders event details, category, venue map, and action buttons for valid event id', async () => {
    const { getByTestId, getByText } = await renderDetailScreen();

    expect(getByTestId('event-detail-screen')).toBeTruthy();
    expect(getByTestId('event-detail-title')).toBeTruthy();
    expect(getByText('Campus Hackathon 2026: AI for Good')).toBeTruthy();
    expect(getByText('Technology')).toBeTruthy();
    expect(getByTestId('event-venue-map')).toBeTruthy();
    expect(getByTestId('schedule-reminder-btn')).toBeTruthy();
    expect(getByTestId('test-reminder-5s-btn')).toBeTruthy();
    expect(getByTestId('delete-event-btn')).toBeTruthy();
  });

  it('schedules 30-min reminder when schedule button is pressed', async () => {
    const alertSpy = jest.spyOn(Alert, 'alert');
    const { getByTestId, findByTestId } = await renderDetailScreen();

    fireEvent.press(getByTestId('schedule-reminder-btn'));

    await waitFor(() => {
      expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          content: expect.objectContaining({
            title: expect.stringContaining('Campus Hackathon'),
            data: { eventId: 'evt-001' },
          }),
        }),
      );
      expect(alertSpy).toHaveBeenCalledWith(
        'ตั้งเตือนสำเร็จ',
        expect.stringContaining('ระบบจะเตือนล่วงหน้า 30 นาที'),
      );
    });

    // Button transitions to cancel button
    expect(await findByTestId('cancel-reminder-btn')).toBeTruthy();
  });

  it('schedules test 5-second reminder when test button is pressed', async () => {
    const alertSpy = jest.spyOn(Alert, 'alert');
    const { getByTestId, findByTestId } = await renderDetailScreen();

    fireEvent.press(getByTestId('test-reminder-5s-btn'));

    await waitFor(() => {
      expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          trigger: expect.objectContaining({
            type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds: 5,
          }),
        }),
      );
      expect(alertSpy).toHaveBeenCalledWith(
        'ตั้งเตือนสำเร็จ',
        expect.stringContaining('5 วินาที'),
      );
    });

    expect(await findByTestId('cancel-reminder-btn')).toBeTruthy();
  });

  it('cancels reminder when cancel button is pressed', async () => {
    const alertSpy = jest.spyOn(Alert, 'alert');
    const { getByTestId, findByTestId } = await renderDetailScreen();

    // 1. First schedule
    fireEvent.press(getByTestId('test-reminder-5s-btn'));
    const cancelBtn = await findByTestId('cancel-reminder-btn');

    // 2. Press cancel
    fireEvent.press(cancelBtn);

    await waitFor(() => {
      expect(Notifications.cancelScheduledNotificationAsync).toHaveBeenCalled();
      expect(alertSpy).toHaveBeenCalledWith(
        'ยกเลิกการเตือนแล้ว',
        expect.any(String),
      );
    });

    // Schedule buttons reappear
    expect(await findByTestId('schedule-reminder-btn')).toBeTruthy();
  });

  it('confirms and deletes event when delete button is pressed', async () => {
    const alertSpy = jest.spyOn(Alert, 'alert');
    const { getByTestId } = await renderDetailScreen();

    fireEvent.press(getByTestId('delete-event-btn'));

    expect(alertSpy).toHaveBeenCalledWith(
      'ยืนยันการลบกิจกรรม',
      expect.stringContaining('Campus Hackathon'),
      expect.arrayContaining([
        expect.objectContaining({ text: 'ยกเลิก' }),
        expect.objectContaining({ text: 'ลบกิจกรรม' }),
      ]),
    );

    // Simulate clicking delete in Alert dialog
    const deleteAction = alertSpy.mock.calls[0][2]?.find(
      (btn) => btn.text === 'ลบกิจกรรม',
    );
    await deleteAction?.onPress?.();

    expect(router.replace).toHaveBeenCalledWith('/events');
  });

  it('renders Not Found state with fallback return button for non-existent event id', async () => {
    (useLocalSearchParams as jest.Mock).mockReturnValue({ id: 'non-existent-evt-999' });

    const { getByTestId, getByText } = await renderDetailScreen();

    expect(getByTestId('event-not-found-screen')).toBeTruthy();
    expect(getByTestId('event-not-found-title')).toBeTruthy();
    expect(getByText('ไม่พบกิจกรรม')).toBeTruthy();

    const returnBtn = getByTestId('return-to-events-btn');
    expect(returnBtn).toBeTruthy();

    fireEvent.press(returnBtn);
    expect(router.replace).toHaveBeenCalledWith('/events');
  });

  it('shows permission denied Alert with Open Settings button when permission is rejected', async () => {
    (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValueOnce({
      granted: false,
      canAskAgain: false,
    });
    (Notifications.requestPermissionsAsync as jest.Mock).mockResolvedValueOnce({
      granted: false,
    });

    const alertSpy = jest.spyOn(Alert, 'alert');
    const openSettingsSpy = jest.spyOn(Linking, 'openSettings').mockResolvedValue(undefined as any);

    const { getByTestId } = await renderDetailScreen();
    fireEvent.press(getByTestId('test-reminder-5s-btn'));

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith(
        'ไม่ได้รับอนุญาต',
        expect.stringContaining('กรุณาเปิดสิทธิ์การแจ้งเตือนในการตั้งค่า'),
        expect.arrayContaining([
          expect.objectContaining({ text: 'ยกเลิก' }),
          expect.objectContaining({ text: 'เปิดการตั้งค่า' }),
        ]),
      );
    });

    const openSettingsAction = alertSpy.mock.calls.find(
      (call) => call[0] === 'ไม่ได้รับอนุญาต',
    )?.[2]?.find((btn) => btn.text === 'เปิดการตั้งค่า');

    await openSettingsAction?.onPress?.();
    expect(openSettingsSpy).toHaveBeenCalled();
  });
});

