import * as SQLite from 'expo-sqlite';
import { CampusEvent } from '../types/event';

export const SQLITE_DB_NAME = 'campus-events.db';

export type StoredEventRow = {
  id: string;
  title: string;
  starts_at: string;
  updated_at: string;
};

let dbInstance: SQLite.SQLiteDatabase | null = null;

/**
 * Returns or initializes the SQLite database instance.
 */
export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!dbInstance) {
    dbInstance = await SQLite.openDatabaseAsync(SQLITE_DB_NAME);
  }
  return dbInstance;
}

/**
 * Initializes the SQLite schema for events if not already created.
 */
export async function initDatabase(): Promise<void> {
  const db = await getDatabase();
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      starts_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);
}

/**
 * Inserts or replaces a list of campus events into SQLite database.
 */
export async function upsertEvents(
  events: CampusEvent[],
  updatedAt: string = new Date().toISOString(),
): Promise<void> {
  const db = await getDatabase();
  for (const event of events) {
    await db.runAsync(
      `INSERT OR REPLACE INTO events (id, title, starts_at, updated_at) VALUES (?, ?, ?, ?)`,
      [event.id, event.title, event.startsAt, updatedAt],
    );
  }
}

/**
 * Queries all stored events from SQLite database ordered by starts_at.
 */
export async function queryStoredEvents(): Promise<StoredEventRow[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<StoredEventRow>(
    `SELECT id, title, starts_at, updated_at FROM events ORDER BY starts_at ASC`,
  );
  return rows;
}

/**
 * Clears all rows from the events table.
 */
export async function clearStoredEvents(): Promise<void> {
  const db = await getDatabase();
  await db.execAsync(`DELETE FROM events;`);
}
