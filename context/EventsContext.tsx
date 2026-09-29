import React, { createContext, useContext, useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { CampusEvent } from '../types/event';
import { RegistrationForm } from '../types/registration';
import { mockEvents } from '../data/events';
import {
  scheduleEventReminder,
  cancelEventReminder,
} from '../services/notification';
import {
  getEvents as fetchEventsFromApi,
  registerEvent as registerEventApi,
  ApiError,
} from '../services/events-api';

// ── Types ────────────────────────────────────────────────────────────

export type FetchStatus = 'idle' | 'loading' | 'refreshing' | 'error' | 'ready';

export type EventsContextValue = {
  events: CampusEvent[];
  reminders: Record<string, string>;
  fetchStatus: FetchStatus;
  fetchError: string | null;
  addEvent: (event: CampusEvent) => void;
  deleteEvent: (id: string) => Promise<void>;
  getEventById: (id: string) => CampusEvent | undefined;
  fetchEvents: () => Promise<void>;
  refreshEvents: () => Promise<void>;
  registerForEvent: (eventId: string, form: RegistrationForm) => Promise<void>;
  scheduleReminder: (event: CampusEvent, secondsOffset?: number) => Promise<string>;
  cancelReminder: (eventId: string) => Promise<void>;
  isReminded: (eventId: string) => boolean;
};

// ── Context ──────────────────────────────────────────────────────────

export const EventsContext = createContext<EventsContextValue | null>(null);

// ── Provider ─────────────────────────────────────────────────────────

export function EventsProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<CampusEvent[]>(mockEvents);
  const [reminders, setReminders] = useState<Record<string, string>>({});
  const [fetchStatus, setFetchStatus] = useState<FetchStatus>('idle');
  const [fetchError, setFetchError] = useState<string | null>(null);

  // AbortController ref for request cancellation on unmount
  const abortRef = useRef<AbortController | null>(null);

  // ── Fetch events from API ────────────────────────────────────────
  const fetchEvents = useCallback(async () => {
    // Cancel any in-flight request
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setFetchStatus('loading');
    setFetchError(null);

    try {
      const apiEvents = await fetchEventsFromApi(controller.signal);
      setEvents(apiEvents);
      setFetchStatus('ready');
    } catch (error: unknown) {
      // Don't treat abort as error
      if (error instanceof Error && error.name === 'AbortError') return;

      const message =
        error instanceof ApiError
          ? error.message
          : error instanceof Error
            ? error.message
            : 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ';

      console.warn('[fetchEvents error]:', message);
      setFetchError(message);
      setFetchStatus('error');
      // Keep existing events as fallback (mock or previously fetched)
    }
  }, []);

  // ── Refresh events (pull-to-refresh) ─────────────────────────────
  // Keeps current events visible during refresh, only replaces on success
  const refreshEvents = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setFetchStatus('refreshing');

    try {
      const apiEvents = await fetchEventsFromApi(controller.signal);
      setEvents(apiEvents);
      setFetchStatus('ready');
      setFetchError(null);
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'AbortError') return;

      const message =
        error instanceof ApiError
          ? error.message
          : error instanceof Error
            ? error.message
            : 'เกิดข้อผิดพลาดในการรีเฟรช';

      console.warn('[refreshEvents error]:', message);
      setFetchError(message);
      // Stay in 'ready' so existing list remains visible
      setFetchStatus('ready');
    }
  }, []);

  // ── Register for event via POST API ──────────────────────────────
  const registerForEvent = useCallback(
    async (eventId: string, form: RegistrationForm) => {
      await registerEventApi(eventId, form);
    },
    [],
  );

  // ── Cleanup on unmount ───────────────────────────────────────────
  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  // ── Existing CRUD operations (unchanged from before) ─────────────

  const addEvent = useCallback((newEvent: CampusEvent) => {
    setEvents((prev) => [newEvent, ...prev]);
  }, []);

  const deleteEvent = useCallback(
    async (id: string) => {
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

  // ── Context value ────────────────────────────────────────────────

  const value = useMemo<EventsContextValue>(
    () => ({
      events,
      reminders,
      fetchStatus,
      fetchError,
      addEvent,
      deleteEvent,
      getEventById,
      fetchEvents,
      refreshEvents,
      registerForEvent,
      scheduleReminder,
      cancelReminder,
      isReminded,
    }),
    [
      events,
      reminders,
      fetchStatus,
      fetchError,
      addEvent,
      deleteEvent,
      getEventById,
      fetchEvents,
      refreshEvents,
      registerForEvent,
      scheduleReminder,
      cancelReminder,
      isReminded,
    ],
  );

  return <EventsContext.Provider value={value}>{children}</EventsContext.Provider>;
}

// ── Default context (for components outside provider / testing) ─────

const defaultEventsContext: EventsContextValue = {
  events: mockEvents,
  reminders: {},
  fetchStatus: 'idle',
  fetchError: null,
  addEvent: () => {},
  deleteEvent: async () => {},
  getEventById: (id: string) => mockEvents.find((evt) => evt.id === id),
  fetchEvents: async () => {},
  refreshEvents: async () => {},
  registerForEvent: async (eventId, form) => {
    await registerEventApi(eventId, form);
  },
  scheduleReminder: async () => 'mock-notification-id',
  cancelReminder: async () => {},
  isReminded: () => false,
};

export function useEvents(): EventsContextValue {
  const ctx = useContext(EventsContext);
  return ctx || defaultEventsContext;
}
