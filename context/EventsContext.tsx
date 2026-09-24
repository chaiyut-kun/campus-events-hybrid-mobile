import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { CampusEvent } from '../types/event';
import { mockEvents } from '../data/events';
import {
  scheduleEventReminder,
  cancelEventReminder,
} from '../services/notification';

export type EventsContextValue = {
  events: CampusEvent[];
  reminders: Record<string, string>;
  addEvent: (event: CampusEvent) => void;
  deleteEvent: (id: string) => Promise<void>;
  getEventById: (id: string) => CampusEvent | undefined;
  scheduleReminder: (event: CampusEvent, secondsOffset?: number) => Promise<string>;
  cancelReminder: (eventId: string) => Promise<void>;
  isReminded: (eventId: string) => boolean;
};

const EventsContext = createContext<EventsContextValue | null>(null);

export function EventsProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<CampusEvent[]>(mockEvents);
  const [reminders, setReminders] = useState<Record<string, string>>({});

  const addEvent = useCallback((newEvent: CampusEvent) => {
    setEvents((prev) => [newEvent, ...prev]);
  }, []);

  const deleteEvent = useCallback(
    async (id: string) => {
      // If there's an active reminder, cancel it natively
      const notifId = reminders[id];
      if (notifId) {
        try {
          await cancelEventReminder(notifId);
        } catch (e) {
          console.warn('Failed to cancel reminder during event deletion:', e);
        }
      }

      setEvents((prev) => prev.filter((evt) => evt.id !== id));
      setReminders((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    },
    [reminders],
  );

  const getEventById = useCallback(
    (id: string) => events.find((evt) => evt.id === id),
    [events],
  );

  const scheduleReminder = useCallback(
    async (event: CampusEvent, secondsOffset?: number): Promise<string> => {
      const notifId = await scheduleEventReminder(event, secondsOffset);
      setReminders((prev) => ({
        ...prev,
        [event.id]: notifId,
      }));
      return notifId;
    },
    [],
  );

  const cancelReminder = useCallback(
    async (eventId: string): Promise<void> => {
      const notifId = reminders[eventId];
      if (notifId) {
        await cancelEventReminder(notifId);
      }
      setReminders((prev) => {
        const next = { ...prev };
        delete next[eventId];
        return next;
      });
    },
    [reminders],
  );

  const isReminded = useCallback(
    (eventId: string) => Boolean(reminders[eventId]),
    [reminders],
  );

  const value = useMemo<EventsContextValue>(
    () => ({
      events,
      reminders,
      addEvent,
      deleteEvent,
      getEventById,
      scheduleReminder,
      cancelReminder,
      isReminded,
    }),
    [
      events,
      reminders,
      addEvent,
      deleteEvent,
      getEventById,
      scheduleReminder,
      cancelReminder,
      isReminded,
    ],
  );

  return <EventsContext.Provider value={value}>{children}</EventsContext.Provider>;
}

const defaultEventsContext: EventsContextValue = {
  events: mockEvents,
  reminders: {},
  addEvent: () => {},
  deleteEvent: async () => {},
  getEventById: (id: string) => mockEvents.find((evt) => evt.id === id),
  scheduleReminder: async () => 'mock-notification-id',
  cancelReminder: async () => {},
  isReminded: () => false,
};

export function useEvents(): EventsContextValue {
  const ctx = useContext(EventsContext);
  return ctx || defaultEventsContext;
}

