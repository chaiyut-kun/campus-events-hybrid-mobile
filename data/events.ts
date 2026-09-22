import { CampusEvent } from '../types/event';

export const mockEvents: CampusEvent[] = [
  {
    id: 'evt-001',
    title: 'Campus Hackathon 2026: AI for Good',
    description:
      'Join 48 hours of intense coding, collaboration, and rapid prototyping to solve real-world sustainability challenges using modern mobile and AI technologies.',
    startsAt: '2026-10-15T09:00:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=60',
    location: {
      name: 'Innovative Learning Hub, 4th Floor',
      latitude: 13.7563,
      longitude: 100.5018,
    },
    category: 'Technology',
  },
  {
    id: 'evt-002',
    title:
      'International Symposium on Next-Generation Cyber-Physical Systems, Autonomous Robotics, and Distributed Ledger Architectures',
    description:
      'This multi-track symposium brings together leading academic researchers, industry innovators, and postgraduate students from over twenty regional universities. Topics include zero-trust distributed architectures, fault-tolerant edge computing nodes, low-latency cross-platform mobile telemetry protocols, and ethical governance frameworks for artificial intelligence applications in higher education ecosystems.',
    startsAt: '2026-10-22T13:30:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=60',
    location: {
      name: 'Grand Auditorium & Exhibition Hall A',
      latitude: 13.758,
      longitude: 100.503,
    },
    category: 'Academic',
  },
  {
    id: 'evt-003',
    title: 'Annual Inter-Faculty Badminton Championship',
    description:
      'Cheer for your faculty team or compete in singles and doubles tournaments. Free entry for all verified university students and alumni.',
    startsAt: '2026-11-05T08:00:00Z',
    // Omitted imageUrl to test placeholder fallback
    location: {
      name: 'University Sports Gymnasium 2',
      latitude: 13.7545,
      longitude: 100.499,
    },
    category: 'Sports',
  },
  {
    id: 'evt-004',
    title: 'Acoustic Sunset & Indie Music Night',
    description:
      'Relax after midterm exams with student indie bands, food trucks, and acoustic performances under the campus lawn trees.',
    startsAt: '2026-11-12T17:00:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=60',
    location: {
      name: 'Central Garden Lawn Amphitheater',
      latitude: 13.7572,
      longitude: 100.5025,
    },
    category: 'Entertainment',
  },
];

/**
 * Immutably toggles a favorite event ID.
 * Returns a new array with the ID added if missing, or removed if present.
 */
export function toggleFavoriteId(currentIds: string[], id: string): string[] {
  return currentIds.includes(id)
    ? currentIds.filter((favId) => favId !== id)
    : [...currentIds, id];
}
