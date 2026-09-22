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

