import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  loadEventsCache,
  saveEventsCache,
  clearEventsCache,
  EVENTS_CACHE_KEY,
} from '../../services/events-cache';
import { CampusEvent } from '../../types/event';

const sampleEvent: CampusEvent = {
  id: 'evt-001',
  title: 'Campus Hackathon 2026: AI for Good',
  description: 'Annual hackathon event for students',
  startsAt: '2026-10-15T09:00:00.000Z',
  category: 'Competition',
  location: {
    name: 'Innovative Learning Hub',
    latitude: 13.7563,
    longitude: 100.5018,
  },
};

describe('Unit Test: events-cache', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.clearAllMocks();
  });

  it('returns null when event cache is empty', async () => {
    const cached = await loadEventsCache();
    expect(cached).toBeNull();
  });

  it('persists and loads valid events cache with ISO timestamp', async () => {
    const timestamp = '2026-09-29T14:30:00.000Z';
    await saveEventsCache([sampleEvent], timestamp);

    const cached = await loadEventsCache();
    expect(cached).not.toBeNull();
    expect(cached?.events).toHaveLength(1);
    expect(cached?.events[0].id).toBe('evt-001');
    expect(cached?.updatedAt).toBe(timestamp);
  });

  it('returns null and warns when cache string is corrupted JSON', async () => {
    await AsyncStorage.setItem(EVENTS_CACHE_KEY, 'corrupted{events');
    const result = await loadEventsCache();
    expect(result).toBeNull();
  });

  it('returns null when cache payload is missing updatedAt', async () => {
    await AsyncStorage.setItem(EVENTS_CACHE_KEY, JSON.stringify({ events: [sampleEvent] }));
    const result = await loadEventsCache();
    expect(result).toBeNull();
  });

  it('returns null when cached events contain malformed event data', async () => {
    const malformed = {
      events: [{ id: 'evt-999' }], // missing required fields like title, startsAt, etc.
      updatedAt: '2026-09-29T14:30:00.000Z',
    };
    await AsyncStorage.setItem(EVENTS_CACHE_KEY, JSON.stringify(malformed));
    const result = await loadEventsCache();
    expect(result).toBeNull();
  });

  it('clears event cache from AsyncStorage', async () => {
    await saveEventsCache([sampleEvent]);
    await clearEventsCache();

    const result = await loadEventsCache();
    expect(result).toBeNull();
  });
});
