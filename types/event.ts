export type CampusLocation = {
  name: string;
  latitude: number;
  longitude: number;
};

export type CampusEvent = {
  id: string;
  title: string;
  description: string;
  startsAt: string;
  imageUrl?: string;
  location: CampusLocation;
  category: string;
};

export type EventListStatus = 'loading' | 'error' | 'ready';

export type EventListState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; events: CampusEvent[] };

/**
 * Discriminated union for favorite reducer actions.
 * - hydrate: bulk-load IDs (e.g. from storage in a future lab)
 * - toggle: add or remove a single event ID
 * - clear: remove all favorites
 */
export type FavoriteAction =
  | { type: 'hydrate'; ids: string[] }
  | { type: 'toggle'; id: string }
  | { type: 'clear' };
