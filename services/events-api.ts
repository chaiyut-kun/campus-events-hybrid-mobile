import { CampusEvent } from '../types/event';
import { RegistrationForm } from '../types/registration';

// ── API Configuration ────────────────────────────────────────────────

/**
 * Returns the configured API base URL.
 * Throws a diagnostic error when the environment variable is missing.
 */
export function getApiUrl(): string {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  if (!apiUrl) {
    throw new ApiError(
      'ไม่พบ EXPO_PUBLIC_API_URL กรุณาตรวจไฟล์ .env',
      undefined,
      'MISSING_CONFIG',
    );
  }
  return apiUrl;
}

// ── Custom Error Class ───────────────────────────────────────────────

/**
 * Structured API error with HTTP status and diagnostic code.
 * Separates user-facing message from technical details for logging.
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// ── Runtime Type Guards ──────────────────────────────────────────────

/**
 * Runtime type guard for CampusEvent.
 * Validates required fields and types from untrusted JSON payload.
 * TypeScript interfaces alone cannot validate JSON at runtime.
 */
export function isCampusEvent(value: unknown): value is CampusEvent {
  if (typeof value !== 'object' || value === null) return false;

  const event = value as Record<string, unknown>;
  const location = event.location;
  if (typeof location !== 'object' || location === null) return false;

  const loc = location as Record<string, unknown>;

  return (
    typeof event.id === 'string' &&
    typeof event.title === 'string' &&
    typeof event.description === 'string' &&
    typeof event.startsAt === 'string' &&
    (event.imageUrl === undefined || typeof event.imageUrl === 'string') &&
    typeof event.category === 'string' &&
    typeof loc.name === 'string' &&
    typeof loc.latitude === 'number' &&
    Number.isFinite(loc.latitude) &&
    typeof loc.longitude === 'number' &&
    Number.isFinite(loc.longitude)
  );
}

/**
 * Parses and validates an array of CampusEvent objects from JSON.
 * Throws a diagnostic error if the payload structure is invalid.
 */
export function parseEvents(payload: unknown): CampusEvent[] {
  if (!Array.isArray(payload)) {
    throw new ApiError(
      'รูปแบบข้อมูลกิจกรรมจาก API ไม่ถูกต้อง (ไม่ใช่ array)',
      undefined,
      'INVALID_PAYLOAD',
    );
  }

  if (!payload.every(isCampusEvent)) {
    throw new ApiError(
      'รูปแบบข้อมูลกิจกรรมจาก API ไม่ถูกต้อง (โครงสร้างฟิลด์ไม่ตรง)',
      undefined,
      'INVALID_PAYLOAD',
    );
  }

  return payload;
}

/**
 * Parses and validates a single CampusEvent from JSON.
 */
export function parseEvent(payload: unknown): CampusEvent {
  if (!isCampusEvent(payload)) {
    throw new ApiError(
      'รูปแบบข้อมูลกิจกรรมจาก API ไม่ถูกต้อง',
      undefined,
      'INVALID_PAYLOAD',
    );
  }
  return payload;
}

// ── API Functions ────────────────────────────────────────────────────

/**
 * GET /events — Fetch all campus events.
 * Supports AbortSignal for request cancellation on unmount.
 */
export async function getEvents(signal?: AbortSignal): Promise<CampusEvent[]> {
  const baseUrl = getApiUrl();

  const response = await fetch(`${baseUrl}/events`, { signal });

  if (!response.ok) {
    throw new ApiError(
      `โหลดกิจกรรมไม่สำเร็จ (${response.status})`,
      response.status,
    );
  }

  const payload: unknown = await response.json();
  return parseEvents(payload);
}

/**
 * GET /events/:id — Fetch a single event by ID.
 * Supports AbortSignal for request cancellation on unmount.
 */
export async function getEventById(
  id: string,
  signal?: AbortSignal,
): Promise<CampusEvent> {
  const baseUrl = getApiUrl();

  const response = await fetch(`${baseUrl}/events/${id}`, { signal });

  if (!response.ok) {
    throw new ApiError(
      response.status === 404
        ? 'ไม่พบกิจกรรมที่ต้องการ'
        : `โหลดรายละเอียดกิจกรรมไม่สำเร็จ (${response.status})`,
      response.status,
    );
  }

  const payload: unknown = await response.json();
  return parseEvent(payload);
}

/**
 * Registration response from API.
 */
export type RegistrationResponse = {
  success: boolean;
  registrationId: string;
};

/**
 * POST /events/:id/registrations — Register for an event.
 * Supports AbortSignal for request cancellation.
 * Caller must ensure double-submit prevention (disable button during request).
 */
export async function registerEvent(
  eventId: string,
  form: RegistrationForm,
  signal?: AbortSignal,
): Promise<RegistrationResponse> {
  const baseUrl = getApiUrl();

  const response = await fetch(`${baseUrl}/events/${eventId}/registrations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form),
    signal,
  });

  if (!response.ok) {
    throw new ApiError(
      response.status === 409
        ? 'คุณได้ลงทะเบียนกิจกรรมนี้ไปแล้ว'
        : `ลงทะเบียนไม่สำเร็จ (${response.status})`,
      response.status,
    );
  }

  const payload = await response.json();
  return payload as RegistrationResponse;
}
