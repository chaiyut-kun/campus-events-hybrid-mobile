import {
  isCampusEvent,
  parseEvents,
  parseEvent,
  getEvents,
  getEventById,
  registerEvent,
  ApiError,
  getApiUrl,
} from '../../services/events-api';
import { CampusEvent } from '../../types/event';
import { RegistrationForm } from '../../types/registration';

declare const global: any;

const mockEvent: CampusEvent = {
  id: 'evt-001',
  title: 'Campus Hackathon 2026: AI for Good',
  description: 'Join 48 hours of intense coding.',
  startsAt: '2026-10-15T09:00:00Z',
  imageUrl: 'https://images.unsplash.com/photo-1504384308090',
  location: {
    name: 'Innovative Learning Hub, 4th Floor',
    latitude: 13.7563,
    longitude: 100.5018,
  },
  category: 'Technology',
};

const validRegistration: RegistrationForm = {
  fullName: 'Chaiyut Tavon',
  email: 'chaiyut@university.ac.th',
  studentId: '2024-CIS-8492',
  faculty: 'Computer and Information Science',
  notes: 'Excited!',
};

describe('Unit Test: events-api service', () => {
  const originalEnv = process.env.EXPO_PUBLIC_API_URL;
  const mockApiUrl = 'https://api.campus-events.example.com';

  beforeEach(() => {
    process.env.EXPO_PUBLIC_API_URL = mockApiUrl;
    jest.clearAllMocks();
  });

  afterAll(() => {
    process.env.EXPO_PUBLIC_API_URL = originalEnv;
  });

  describe('Runtime Type Guards: isCampusEvent & parseEvents', () => {
    it('returns true for a fully valid CampusEvent', () => {
      expect(isCampusEvent(mockEvent)).toBe(true);
    });

    it('returns false for null, primitives, or non-objects', () => {
      expect(isCampusEvent(null)).toBe(false);
      expect(isCampusEvent(undefined)).toBe(false);
      expect(isCampusEvent('string')).toBe(false);
      expect(isCampusEvent(123)).toBe(false);
    });

    it('returns false if required string fields are missing', () => {
      const missingTitle = { ...mockEvent, title: undefined };
      expect(isCampusEvent(missingTitle)).toBe(false);

      const missingId = { ...mockEvent, id: 123 };
      expect(isCampusEvent(missingId)).toBe(false);

      const missingCategory = { ...mockEvent, category: null };
      expect(isCampusEvent(missingCategory)).toBe(false);
    });

    it('returns false if location or coordinates are invalid', () => {
      const missingLocation = { ...mockEvent, location: null };
      expect(isCampusEvent(missingLocation)).toBe(false);

      const invalidLatitude = {
        ...mockEvent,
        location: { ...mockEvent.location, latitude: 'invalid' },
      };
      expect(isCampusEvent(invalidLatitude)).toBe(false);

      const nanLongitude = {
        ...mockEvent,
        location: { ...mockEvent.location, longitude: NaN },
      };
      expect(isCampusEvent(nanLongitude)).toBe(false);
    });

    it('parseEvents parses and returns valid array', () => {
      const result = parseEvents([mockEvent]);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('evt-001');
    });

    it('parseEvents throws ApiError if payload is not an array', () => {
      expect(() => parseEvents({ data: [mockEvent] })).toThrow(ApiError);
      expect(() => parseEvents({ data: [mockEvent] })).toThrow(/ไม่ใช่ array/);
    });

    it('parseEvents throws ApiError if any item in array is malformed', () => {
      const malformedArray = [mockEvent, { id: 'invalid-item' }];
      expect(() => parseEvents(malformedArray)).toThrow(ApiError);
      expect(() => parseEvents(malformedArray)).toThrow(/โครงสร้างฟิลด์ไม่ตรง/);
    });

    it('parseEvent parses a single event and throws on invalid payload', () => {
      expect(parseEvent(mockEvent).id).toBe('evt-001');
      expect(() => parseEvent({ bad: 'data' })).toThrow(ApiError);
    });
  });

  describe('API Configuration & Missing Config Diagnostic', () => {
    it('throws ApiError with MISSING_CONFIG if EXPO_PUBLIC_API_URL is missing', () => {
      delete process.env.EXPO_PUBLIC_API_URL;
      expect(() => getApiUrl()).toThrow(ApiError);
      expect(() => getApiUrl()).toThrow(/ไม่พบ EXPO_PUBLIC_API_URL/);
    });
  });

  describe('getEvents (GET /events)', () => {
    it('successfully fetches and returns parsed events on HTTP 200', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => [mockEvent],
      } as Response);

      const events = await getEvents();
      expect(events).toEqual([mockEvent]);
      expect(global.fetch).toHaveBeenCalledWith(`${mockApiUrl}/events`, {
        signal: undefined,
      });
    });

    it('throws ApiError with status code when response is not ok (e.g. 500)', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 500,
      } as Response);

      await expect(getEvents()).rejects.toThrow(ApiError);
      await expect(getEvents()).rejects.toThrow(/โหลดกิจกรรมไม่สำเร็จ \(500\)/);
    });

    it('propagates network failure (offline)', async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error('Network request failed'));

      await expect(getEvents()).rejects.toThrow('Network request failed');
    });

    it('supports AbortSignal cancellation', async () => {
      const controller = new AbortController();
      controller.abort();

      const abortError = new Error('The operation was aborted');
      abortError.name = 'AbortError';

      global.fetch = jest.fn().mockRejectedValue(abortError);

      await expect(getEvents(controller.signal)).rejects.toThrow(abortError);
      expect(global.fetch).toHaveBeenCalledWith(`${mockApiUrl}/events`, {
        signal: controller.signal,
      });
    });
  });

  describe('getEventById (GET /events/:id)', () => {
    it('successfully fetches single event on HTTP 200', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockEvent,
      } as Response);

      const event = await getEventById('evt-001');
      expect(event).toEqual(mockEvent);
      expect(global.fetch).toHaveBeenCalledWith(`${mockApiUrl}/events/evt-001`, {
        signal: undefined,
      });
    });

    it('throws 404 specific message when event is not found', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 404,
      } as Response);

      await expect(getEventById('unknown-id')).rejects.toThrow('ไม่พบกิจกรรมที่ต้องการ');
    });
  });

  describe('registerEvent (POST /events/:id/registrations)', () => {
    it('successfully registers for event on HTTP 200/201', async () => {
      const mockResponse = { success: true, registrationId: 'reg-12345' };
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 201,
        json: async () => mockResponse,
      } as Response);

      const res = await registerEvent('evt-001', validRegistration);
      expect(res).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        `${mockApiUrl}/events/evt-001/registrations`,
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(validRegistration),
        }),
      );
    });

    it('throws specific message on duplicate registration (HTTP 409 Conflict)', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 409,
      } as Response);

      await expect(registerEvent('evt-001', validRegistration)).rejects.toThrow(
        'คุณได้ลงทะเบียนกิจกรรมนี้ไปแล้ว',
      );
    });

    it('throws generic error with status on other HTTP failures (e.g. 500)', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 500,
      } as Response);

      await expect(registerEvent('evt-001', validRegistration)).rejects.toThrow(
        /ลงทะเบียนไม่สำเร็จ \(500\)/,
      );
    });
  });
});
