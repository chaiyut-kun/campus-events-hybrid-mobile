import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { EventsProvider, useEvents, EventsContextValue } from '../../context/EventsContext';
import * as notificationService from '../../services/notification';
import { CampusEvent } from '../../types/event';

// Spy on notificationService
jest.spyOn(notificationService, 'scheduleEventReminder').mockResolvedValue('notif-id-abc');
jest.spyOn(notificationService, 'cancelEventReminder').mockResolvedValue(undefined);

describe('Unit Test: EventsContext', () => {
  const sampleEvent: CampusEvent = {
    id: 'evt-test-999',
    title: 'Test AI Summit',
    description: 'A test event description',
    startsAt: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
    location: {
      name: 'Auditorium 1',
      latitude: 13.75,
      longitude: 100.5,
    },
    category: 'Technology',
  };

  it('provides default mock events and retrieves event by ID', async () => {
    let capturedCtx!: EventsContextValue;

    function TestConsumer() {
      const ctx = useEvents();
      capturedCtx = ctx;
      return <Text testID="event-count">{ctx.events.length}</Text>;
    }

    const { getByTestId } = await render(
      <EventsProvider>
        <TestConsumer />
      </EventsProvider>,
    );

    expect(Number(getByTestId('event-count').props.children)).toBeGreaterThanOrEqual(4);
    const evt1 = capturedCtx.getEventById('evt-001');
    expect(evt1).toBeDefined();
    expect(evt1?.title).toContain('Campus Hackathon');
  });

  it('adds a new event via addEvent', async () => {
    function TestConsumer() {
      const { events, addEvent, getEventById } = useEvents();
      return (
        <View>
          <Text testID="first-event-id">{events[0]?.id}</Text>
          <Pressable testID="add-btn" onPress={() => addEvent(sampleEvent)}>
            <Text>Add</Text>
          </Pressable>
          <Text testID="found-title">{getEventById('evt-test-999')?.title || 'none'}</Text>
        </View>
      );
    }

    const { getByTestId } = await render(
      <EventsProvider>
        <TestConsumer />
      </EventsProvider>,
    );

    fireEvent.press(getByTestId('add-btn'));

    await waitFor(() => {
      expect(getByTestId('first-event-id').props.children).toBe('evt-test-999');
      expect(getByTestId('found-title').props.children).toBe('Test AI Summit');
    });
  });

  it('schedules a reminder and updates isReminded status', async () => {
    function TestConsumer() {
      const { scheduleReminder, isReminded, reminders } = useEvents();
      return (
        <View>
          <Text testID="reminded">{isReminded(sampleEvent.id) ? 'yes' : 'no'}</Text>
          <Text testID="notif-id">{reminders[sampleEvent.id] || 'none'}</Text>
          <Pressable
            testID="schedule-btn"
            onPress={async () => {
              await scheduleReminder(sampleEvent);
            }}
          >
            <Text>Schedule</Text>
          </Pressable>
        </View>
      );
    }

    const { getByTestId } = await render(
      <EventsProvider>
        <TestConsumer />
      </EventsProvider>,
    );

    expect(getByTestId('reminded').props.children).toBe('no');

    fireEvent.press(getByTestId('schedule-btn'));

    await waitFor(() => {
      expect(getByTestId('reminded').props.children).toBe('yes');
      expect(getByTestId('notif-id').props.children).toBe('notif-id-abc');
    });
  });

  it('cancels an active reminder via cancelReminder', async () => {
    function TestConsumer() {
      const { scheduleReminder, cancelReminder, isReminded } = useEvents();
      return (
        <View>
          <Text testID="reminded">{isReminded(sampleEvent.id) ? 'yes' : 'no'}</Text>
          <Pressable
            testID="schedule-btn"
            onPress={async () => {
              await scheduleReminder(sampleEvent);
            }}
          >
            <Text>Schedule</Text>
          </Pressable>
          <Pressable
            testID="cancel-btn"
            onPress={async () => {
              await cancelReminder(sampleEvent.id);
            }}
          >
            <Text>Cancel</Text>
          </Pressable>
        </View>
      );
    }

    const { getByTestId } = await render(
      <EventsProvider>
        <TestConsumer />
      </EventsProvider>,
    );

    fireEvent.press(getByTestId('schedule-btn'));
    await waitFor(() => {
      expect(getByTestId('reminded').props.children).toBe('yes');
    });

    fireEvent.press(getByTestId('cancel-btn'));
    await waitFor(() => {
      expect(getByTestId('reminded').props.children).toBe('no');
      expect(notificationService.cancelEventReminder).toHaveBeenCalledWith('notif-id-abc');
    });
  });

  it('deletes an event and automatically cancels its active reminder', async () => {
    function TestConsumer() {
      const { addEvent, scheduleReminder, deleteEvent, isReminded, getEventById } =
        useEvents();
      return (
        <View>
          <Text testID="event-exists">{getEventById(sampleEvent.id) ? 'yes' : 'no'}</Text>
          <Text testID="reminded">{isReminded(sampleEvent.id) ? 'yes' : 'no'}</Text>
          <Pressable testID="add-btn" onPress={() => addEvent(sampleEvent)}>
            <Text>Add</Text>
          </Pressable>
          <Pressable
            testID="schedule-btn"
            onPress={async () => {
              await scheduleReminder(sampleEvent);
            }}
          >
            <Text>Schedule</Text>
          </Pressable>
          <Pressable
            testID="delete-btn"
            onPress={async () => {
              await deleteEvent(sampleEvent.id);
            }}
          >
            <Text>Delete</Text>
          </Pressable>
        </View>
      );
    }

    const { getByTestId } = await render(
      <EventsProvider>
        <TestConsumer />
      </EventsProvider>,
    );

    fireEvent.press(getByTestId('add-btn'));
    await waitFor(() => {
      expect(getByTestId('event-exists').props.children).toBe('yes');
    });

    fireEvent.press(getByTestId('schedule-btn'));
    await waitFor(() => {
      expect(getByTestId('reminded').props.children).toBe('yes');
    });

    fireEvent.press(getByTestId('delete-btn'));
    await waitFor(() => {
      expect(getByTestId('event-exists').props.children).toBe('no');
      expect(getByTestId('reminded').props.children).toBe('no');
      expect(notificationService.cancelEventReminder).toHaveBeenCalledWith('notif-id-abc');
    });
  });
});
