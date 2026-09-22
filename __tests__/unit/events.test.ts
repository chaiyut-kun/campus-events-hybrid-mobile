import { mockEvents, toggleFavoriteId } from '../../data/events';

describe('Unit Test: Campus Events Data & State Helper', () => {
  it('should provide at least 4 campus events conforming to CampusEvent schema', () => {
    expect(mockEvents.length).toBeGreaterThanOrEqual(4);

    mockEvents.forEach((event) => {
      expect(event.id).toBeDefined();
      expect(typeof event.id).toBe('string');
      expect(event.title).toBeTruthy();
      expect(event.description).toBeTruthy();
      expect(event.startsAt).toBeTruthy();
      expect(event.category).toBeTruthy();
      expect(event.location).toBeDefined();
      expect(event.location.name).toBeTruthy();
      expect(typeof event.location.latitude).toBe('number');
      expect(typeof event.location.longitude).toBe('number');
    });
  });

  it('includes required edge cases: event without imageUrl and event with long text', () => {
    const eventWithoutImage = mockEvents.find((evt) => !evt.imageUrl);
    expect(eventWithoutImage).toBeDefined();
    expect(eventWithoutImage?.id).toBe('evt-003');

    const eventWithLongText = mockEvents.find((evt) => evt.description.length > 200);
    expect(eventWithLongText).toBeDefined();
    expect(eventWithLongText?.id).toBe('evt-002');
  });

  describe('toggleFavoriteId helper', () => {
    it('immutably adds an ID when not currently favorited', () => {
      const initial: string[] = ['evt-001'];
      const updated = toggleFavoriteId(initial, 'evt-002');

      expect(updated).toEqual(['evt-001', 'evt-002']);
      expect(initial).toEqual(['evt-001']); // immutability check
    });

    it('immutably removes an ID when currently favorited', () => {
      const initial: string[] = ['evt-001', 'evt-002'];
      const updated = toggleFavoriteId(initial, 'evt-001');

      expect(updated).toEqual(['evt-002']);
      expect(initial).toEqual(['evt-001', 'evt-002']); // immutability check
    });
  });
});
