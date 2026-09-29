import * as SQLite from 'expo-sqlite';
import {
  initDatabase,
  upsertEvents,
  queryStoredEvents,
  clearStoredEvents,
  getDatabase,
  SQLITE_DB_NAME,
} from '../../services/events-sqlite';
import { CampusEvent } from '../../types/event';

const sampleEvents: CampusEvent[] = [
  {
    id: 'evt-001',
    title: 'Campus Hackathon 2026',
    description: 'Hackathon description',
    startsAt: '2026-10-15T09:00:00.000Z',
    category: 'Competition',
    location: {
      name: 'Innovative Learning Hub',
      latitude: 13.7563,
      longitude: 100.5018,
    },
  },
  {
    id: 'evt-002',
    title: 'AI in Healthcare Workshop',
    description: 'Workshop description',
    startsAt: '2026-10-20T13:00:00.000Z',
    category: 'Workshop',
    location: {
      name: 'Health Sciences Hall',
      latitude: 13.758,
      longitude: 100.505,
    },
  },
];

describe('Unit Test: events-sqlite (Proof of Concept)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('opens database with correct name', async () => {
    await getDatabase();
    expect(SQLite.openDatabaseAsync).toHaveBeenCalledWith(SQLITE_DB_NAME);
  });

  it('initializes database table schema', async () => {
    await initDatabase();
    const db = await getDatabase();
    expect(db.execAsync).toHaveBeenCalledWith(
      expect.stringContaining('CREATE TABLE IF NOT EXISTS events'),
    );
  });

  it('upserts campus events into the sqlite events table', async () => {
    const updatedAt = '2026-09-29T15:00:00.000Z';
    await upsertEvents(sampleEvents, updatedAt);

    const db = await getDatabase();
    expect(db.runAsync).toHaveBeenCalledTimes(2);
    expect(db.runAsync).toHaveBeenCalledWith(
      expect.stringContaining('INSERT OR REPLACE INTO events'),
      ['evt-001', 'Campus Hackathon 2026', '2026-10-15T09:00:00.000Z', updatedAt],
    );
  });

  it('queries stored events ordered by starts_at', async () => {
    const db = await getDatabase();
    (db.getAllAsync as jest.Mock).mockResolvedValueOnce([
      {
        id: 'evt-001',
        title: 'Campus Hackathon 2026',
        starts_at: '2026-10-15T09:00:00.000Z',
        updated_at: '2026-09-29T15:00:00.000Z',
      },
    ]);

    const result = await queryStoredEvents();
    expect(db.getAllAsync).toHaveBeenCalledWith(
      expect.stringContaining('SELECT id, title, starts_at, updated_at FROM events ORDER BY starts_at ASC'),
    );
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('evt-001');
  });

  it('clears all rows from the sqlite events table', async () => {
    await clearStoredEvents();
    const db = await getDatabase();
    expect(db.execAsync).toHaveBeenCalledWith(
      expect.stringContaining('DELETE FROM events;'),
    );
  });
});
