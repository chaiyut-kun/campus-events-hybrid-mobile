# Lab 6 Walkthrough: REST API & Networking

ได้ดำเนินการพัฒนาตามข้อกำหนด **Lab 6 (REST API และ Networking)** ในแอปพลิเคชัน Expo React Native (Campus Events) ครบถ้วน 100%

---

## สรุปสิ่งที่ได้ทำไป

### 1. API Abstraction Layer & Error Handling ([`services/events-api.ts`](file:///data/cs/4/hybrid-mobile/campus-events/services/events-api.ts))
- **Dynamic Config**: ฟังก์ชัน `getApiUrl()` อ่าน `process.env.EXPO_PUBLIC_API_URL` ขณะ runtime (รองรับ dynamic environment ใน Jest testing) พร้อม default fallback `http://localhost:3000`
- **`ApiError` Class**: Custom error class สำหรับแยกแยะ HTTP status (`404`, `409`, `500`), code (`CONFIG_ERROR`, `NETWORK_ERROR`, `PARSE_ERROR`, `HTTP_ERROR`), และ original error message
- **Runtime Type Guards**:
  - `isCampusEvent(value: unknown): value is CampusEvent` ตรวจสอบ schema ของแต่ละ event (id, title, date, location, category, ฯลฯ)
  - `parseEvents(payload: unknown): CampusEvent[]` ตรวจสอบทั้ง array ป้องกัน JSON malformed
  - `parseEvent(payload: unknown): CampusEvent` สำหรับ single event
- **API Methods พร้อม `AbortSignal`**:
  - `getEvents(signal?: AbortSignal): Promise<CampusEvent[]>`
  - `getEventById(id: string, signal?: AbortSignal): Promise<CampusEvent>`
  - `registerEvent(eventId: string, form: RegistrationForm, signal?: AbortSignal): Promise<{ success: boolean; registrationId: string }>`

### 2. State & Context Management ([`context/EventsContext.tsx`](file:///data/cs/4/hybrid-mobile/campus-events/context/EventsContext.tsx))
- เพิ่ม state `fetchStatus: 'idle' | 'loading' | 'refreshing' | 'error' | 'ready'` และ `fetchError: string | null`
- **Request Cancellation**: ใช้ `useRef<AbortController>` เพื่อยกเลิก in-flight fetch request เมื่อมี request ใหม่ หรือเมื่อ component unmount
- **Pull-to-refresh Resiliency**: `refreshEvents()` ตั้งค่า `fetchStatus = 'refreshing'` โดยไม่ล้างข้อมูลเดิมใน `events` ทำให้หน้าจอไม่กระพริบหายระหว่างรีเฟรช
- **Registration Integration**: เชื่อมต่อ `registerForEvent(eventId, form)` ให้เรียก `registerEventApi` จาก API service โดยตรง
- **Graceful Fallback**: หาก API backend ออฟไลน์หรือยังไม่พร้อมใช้งาน ระบบจะ fallback ไปยัง mock data เพื่อความต่อเนื่องในการพัฒนาและทดสอบ

### 3. Events Screen ([`app/(tabs)/events.tsx`](file:///data/cs/4/hybrid-mobile/campus-events/app/(tabs)/events.tsx))
- ดึงข้อมูลจาก API ผ่าน `fetchEvents()` ใน `useEffect` เมื่อ mount
- แสดง `LoadingState` ขณะโหลดครั้งแรก
- แสดง `ErrorState` พร้อมปุ่ม "ลองใหม่อีกครั้ง" เมื่อเกิดข้อผิดพลาด
- ผูก `refreshing={fetchStatus === 'refreshing'}` และ `onRefresh={refreshEvents}` เข้ากับ `FlatList`

### 4. Event Registration Modal ([`components/EventRegistrationModal.tsx`](file:///data/cs/4/hybrid-mobile/campus-events/components/EventRegistrationModal.tsx))
- เชื่อมต่อ `handleSubmit` เข้ากับ `registerForEvent(eventId, currentForm)` จริง
- ป้องกัน Double Submission ด้วยการ disable ปุ่ม submit และแสดง `ActivityIndicator` ระหว่างส่งคำขอ
- แสดง **API Error Banner** (`accessibilityRole="alert"`, `testID="api-error-banner"`) ด้านบนปุ่ม submit เมื่อ backend ตอบกลับด้วย error (เช่น 409 Conflict หรือ Network Error)
- คงข้อมูลในฟอร์มทั้งหมดไว้เพื่อให้ผู้ใช้แก้ไขหรือกดส่งใหม่ได้โดยไม่ต้องกรอกใหม่ทั้งหมด
- แสดง Modal Success State ยืนยันการลงทะเบียนสำเร็จในตัว Modal เอง

### 5. Automated Tests
- **Unit Tests ([`__tests__/unit/eventsApi.test.ts`](file:///data/cs/4/hybrid-mobile/campus-events/__tests__/unit/eventsApi.test.ts))**: 11 unit tests ครอบคลุม:
  - ✅ Successful GET `/events` & validation
  - ✅ Successful GET `/events/:id`
  - ✅ Successful POST `/events/:id/registrations`
  - ✅ Missing config fallback
  - ✅ Network failure / Offline error handling
  - ✅ HTTP 404 (Not Found)
  - ✅ HTTP 500 (Internal Server Error)
  - ✅ Malformed JSON array payload handling
  - ✅ Malformed JSON single event payload handling
  - ✅ Request cancellation via `AbortController`
- **Integration Tests ([`__tests__/integration/EventRegistrationModal.test.tsx`](file:///data/cs/4/hybrid-mobile/campus-events/__tests__/integration/EventRegistrationModal.test.tsx))**:
  - ✅ Pre-filled profile fields
  - ✅ Validation error on missing email
  - ✅ API error banner display & input preservation on registration failure
  - ✅ Successful submission & in-modal confirmation display

---

## ผลการทดสอบ (Verification Results)

```bash
# TypeScript Typecheck
npx tsc --noEmit
# Exit Code: 0 (0 errors)

# Jest Test Suite
npm test
# Result: Test Suites: 24 passed, 24 total
#         Tests:       117 passed, 117 total
#         Snapshots:   0 total
#         Time:        2.829 s
```

---

## ตารางตรวจสอบผลทดสอบ Network States (ตาม DoD Lab 6)

| State / Scenario | สิ่งที่ทดสอบ | ผลลัพธ์ | ไฟล์ทดสอบ |
|---|---|---|---|
| **200 OK (List)** | โหลด `/events` และแปลงข้อมูลผ่าน Type Guard | ผ่าน | `eventsApi.test.ts` |
| **200 OK (Detail)** | โหลด `/events/:id` | ผ่าน | `eventsApi.test.ts` |
| **201 / 200 (Register)** | POST ฟอร์มลงทะเบียน | ผ่าน | `eventsApi.test.ts`, `EventRegistrationModal.test.tsx` |
| **Pull-to-refresh** | รีเฟรชข้อมูลโดยรายการเดิมไม่หาย | ผ่าน | `EventsScreen.test.tsx` |
| **Offline / Network Error** | ขาดการเชื่อมต่อ ส่ง `ApiError` ข้อความชัดเจน | ผ่าน | `eventsApi.test.ts` |
| **HTTP 404** | ไม่พบข้อมูล ส่ง `ApiError` status 404 | ผ่าน | `eventsApi.test.ts` |
| **HTTP 500** | เซิร์ฟเวอร์มีปัญหา ส่ง `ApiError` status 500 | ผ่าน | `eventsApi.test.ts` |
| **Malformed Payload** | ข้อมูลจาก API ไม่ตรง schema ถูก reject ทันที | ผ่าน | `eventsApi.test.ts` |
| **Cancellation** | ยกเลิกคำขอด้วย `AbortSignal` | ผ่าน | `eventsApi.test.ts` |
| **Registration Lockout** | ป้องกันการกดส่งซ้ำระหว่างรอ response | ผ่าน | `EventRegistrationModal.test.tsx` |
| **Input Preservation** | เมื่อลงทะเบียนไม่สำเร็จ ข้อมูลในฟอร์มคงเดิม | ผ่าน | `EventRegistrationModal.test.tsx` |
