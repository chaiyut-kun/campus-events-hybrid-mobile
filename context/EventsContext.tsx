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
import {
  loadEventsCache,
  saveEventsCache,
} from '../services/events-cache';

// ── Types ────────────────────────────────────────────────────────────

export type FetchStatus = 'idle' | 'loading' | 'refreshing' | 'error' | 'ready';

export type EventsContextValue = {
  events: CampusEvent[];
  reminders: Record<string, string>;
  fetchStatus: FetchStatus;
  fetchError: string | null;
  cachedAt: string | null;
  isOffline: boolean;
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
  const [cachedAt, setCachedAt] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState<boolean>(false);

  // AbortController ref for request cancellation on unmount
  const abortRef = useRef<AbortController | null>(null);

  // ── Fetch events from API (Offline-first read flow) ──────────────
  const fetchEvents = useCallback(async () => {
    // Cancel any in-flight request
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    // 1. Read cache first and display immediately if available
    let hasCachedData = false;
    try {
      const cached = await loadEventsCache();
      if (cached && cached.events.length > 0) {
        setEvents(cached.events);
        setCachedAt(cached.updatedAt);
        hasCachedData = true;
      }
    } catch {
      // Continue to API fetch even if cache read fails
    }

    if (!hasCachedData) {
      setFetchStatus('loading');
    }
    setFetchError(null);

    // 2. Revalidate with API in background
    try {
      const apiEvents = await fetchEventsFromApi(controller.signal);
      const now = new Date().toISOString();
      setEvents(apiEvents);
      setCachedAt(now);
      setIsOffline(false);
      setFetchStatus('ready');
      setFetchError(null);
      // Persist latest data to cache
      await saveEventsCache(apiEvents, now);
    } catch (error: unknown) {
      // Don't treat abort as error
      if (error instanceof Error && error.name === 'AbortError') return;

      const message =
        error instanceof ApiError
          ? error.message
          : error instanceof Error
            ? error.message
            : 'เกิดข้อผิดพลาดในการโหลดข้อมูล';

      console.warn('[fetchEvents error]:', message);
      setFetchError(message);
      setIsOffline(true);

      // If we already have events (from cache or initial fallback), keep them visible
      if (hasCachedData || events.length > 0) {
        setFetchStatus('ready');
      } else {
        setFetchStatus('error');
      }
    }
  }, [events.length]);

  // ── Refresh events (pull-to-refresh) ─────────────────────────────
  // Keeps current events visible during refresh, only replaces on success
  const refreshEvents = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setFetchStatus('refreshing');

    try {
      const apiEvents = await fetchEventsFromApi(controller.signal);
      const now = new Date().toISOString();
      setEvents(apiEvents);
      setCachedAt(now);
      setIsOffline(false);
      setFetchStatus('ready');
      setFetchError(null);
      await saveEventsCache(apiEvents, now);
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
      setIsOffline(true);
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
      cachedAt,
      isOffline,
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
      cachedAt,
      isOffline,
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
  cachedAt: null,
  isOffline: false,
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

