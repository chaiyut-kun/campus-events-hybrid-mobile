import AsyncStorage from '@react-native-async-storage/async-storage';
import { CampusEvent } from '../types/event';
import { parseEvents } from './events-api';

export const EVENTS_CACHE_KEY = 'campus-events/events-cache/v1';

export type CachedEventsData = {
  events: CampusEvent[];
  updatedAt: string; // ISO 8601 string
};

/**
 * Loads cached events and last update timestamp from AsyncStorage.
 * Validates payload schema using parseEvents type guard.
 * Returns null if cache is absent or corrupted.
 */
export async function loadEventsCache(): Promise<CachedEventsData | null> {
  try {
    const raw = await AsyncStorage.getItem(EVENTS_CACHE_KEY);
    if (!raw) return null;

    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed !== 'object' ||
      parsed === null ||
      !('events' in parsed) ||
      !('updatedAt' in parsed)
    ) {
      return null;
    }

    const { events: rawEvents, updatedAt } = parsed as {
      events: unknown;
      updatedAt: unknown;
    };

    if (typeof updatedAt !== 'string') {
      return null;
    }

    // Validate that events adhere to CampusEvent schema
    const validatedEvents = parseEvents(rawEvents);
    return {
      events: validatedEvents,
      updatedAt,
    };
  } catch (error) {
    console.warn('[events-cache] Failed to read or parse event cache:', error);
    return null;
  }
}

/**
 * Persists event list and timestamp to AsyncStorage cache.
 */
export async function saveEventsCache(
  events: CampusEvent[],
  updatedAt: string = new Date().toISOString(),
): Promise<void> {
  try {
    const cacheData: CachedEventsData = {
      events,
      updatedAt,
    };
    await AsyncStorage.setItem(EVENTS_CACHE_KEY, JSON.stringify(cacheData));
  } catch (error) {
    console.error('[events-cache] Failed to write event cache:', error);
  }
}

/**
 * Clears cached events from AsyncStorage.
 */
export async function clearEventsCache(): Promise<void> {
  try {
    await AsyncStorage.removeItem(EVENTS_CACHE_KEY);
  } catch (error) {
    console.error('[events-cache] Failed to clear event cache:', error);
  }
}
