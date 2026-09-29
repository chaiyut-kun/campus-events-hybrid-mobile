---
title: "สัปดาห์ 6: REST API และ Networking"
sidebarTitle: "REST API และ Networking"
---

# สัปดาห์ 6: REST API และ Networking

สัปดาห์นี้แทน mock data ด้วย REST API โดยให้ UI รับมือเครือข่ายช้า การตอบกลับที่ไม่สำเร็จ การออกจากหน้าระหว่าง request และการส่งข้อมูลซ้ำ

## ผลลัพธ์การเรียนรู้

- อธิบาย Resource, HTTP method, status code, headers และ JSON
- ใช้ `fetch` กับ `async/await` และตรวจ `response.ok`
- แยก API layer ออกจาก screen
- ออกแบบ Loading, Empty, Error, Retry และ Pull-to-refresh
- ยกเลิก request ที่ไม่ใช้และป้องกัน duplicate POST

## API contract ของรายวิชา

| Method | Endpoint | หน้าที่ |
| --- | --- | --- |
| GET | `/events` | รายการกิจกรรม |
| GET | `/events/:id` | รายละเอียดกิจกรรม |
| POST | `/events/:id/registrations` | ลงทะเบียนเข้าร่วม |

TypeScript ตรวจชนิดตอน compile แต่ JSON จากเครือข่ายยังต้อง validate ตอน runtime ก่อนเชื่อถือ

## API abstraction

```tsx
const API_URL = process.env.EXPO_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error('ไม่พบ EXPO_PUBLIC_API_URL กรุณาตรวจไฟล์ .env');
}

function isCampusEvent(value: unknown): value is CampusEvent {
  if (typeof value !== 'object' || value === null) return false;

  const event = value as Record<string, unknown>;
  const location = event.location;
  if (typeof location !== 'object' || location === null) return false;

  const eventLocation = location as Record<string, unknown>;

  return (
    typeof event.id === 'string' &&
    typeof event.title === 'string' &&
    typeof event.description === 'string' &&
    typeof event.startsAt === 'string' &&
    (event.imageUrl === undefined || typeof event.imageUrl === 'string') &&
    typeof eventLocation.name === 'string' &&
    typeof eventLocation.latitude === 'number' &&
    Number.isFinite(eventLocation.latitude) &&
    typeof eventLocation.longitude === 'number' &&
    Number.isFinite(eventLocation.longitude)
  );
}

function parseEvents(payload: unknown): CampusEvent[] {
  if (!Array.isArray(payload) || !payload.every(isCampusEvent)) {
    throw new Error('รูปแบบข้อมูลกิจกรรมจาก API ไม่ถูกต้อง');
  }

  return payload;
}

export async function getEvents(signal?: AbortSignal): Promise<CampusEvent[]> {
  const response = await fetch(`${API_URL}/events`, { signal });

  if (!response.ok) {
    throw new Error(`โหลดกิจกรรมไม่สำเร็จ (${response.status})`);
  }

  const payload: unknown = await response.json();
  return parseEvents(payload);
}
```

Type guard ข้างต้นตรวจ required fields ของ `CampusEvent` และตรวจ `imageUrl` เมื่อ API ส่งมา เหมาะกับการเริ่มต้นโดยไม่เพิ่ม library ขนาดใหญ่ เมื่อ API ซับซ้อนขึ้นจึงพิจารณา schema library และเพิ่ม validation สำหรับช่วง latitude/longitude กับรูปแบบวันที่ ISO 8601

ตัวแปรที่ขึ้นต้น `EXPO_PUBLIC_` จะอยู่ใน client bundle จึงใช้ได้เฉพาะค่าที่เปิดเผยได้ เช่น base URL ห้ามใส่ secret

## Hook ที่ยกเลิก request

```tsx
useEffect(() => {
  const controller = new AbortController();

  getEvents(controller.signal)
    .then((events) => setState({ status: 'success', events }))
    .catch((error: unknown) => {
      if (error instanceof Error && error.name !== 'AbortError') {
        setState({ status: 'error', message: error.message });
      }
    });

  return () => controller.abort();
}, []);
```

## Refresh, Retry และ POST

- Pull-to-refresh ควรรักษารายการเดิมไว้ระหว่างโหลดเมื่อทำได้
- Retry ของ GET ทำซ้ำได้ตามธรรมชาติ แต่ POST อาจสร้างข้อมูลซ้ำ
- ปิดปุ่มระหว่าง submit และใช้ idempotency key หาก API รองรับ
- แยกข้อความสำหรับผู้ใช้จากรายละเอียดเทคนิคใน log

```tsx
<FlatList
  data={events}
  refreshing={state.status === 'refreshing'}
  onRefresh={refreshEvents}
  renderItem={renderEvent}
/>
```

## Lab 6 — Events API

1. สร้าง `services/events-api.ts`
2. โหลดรายการและรายละเอียดกิจกรรมจาก API
3. เพิ่ม POST registration จากฟอร์มสัปดาห์ 5
4. เพิ่ม Loading/Empty/Error/Retry และ Pull-to-refresh
5. จำลอง missing configuration, offline, 404, 500, slow response, invalid JSON และ JSON ที่มีโครงสร้างผิด

## สิ่งที่ส่ง

- API contract และไฟล์ service
- วิดีโอ Happy path กับ Retry path
- ตารางผลทดสอบ network states

## Definition of Done

- [ ] ตรวจ `response.ok` ทุก request
- [ ] Screen ไม่เรียก `fetch` โดยตรง
- [ ] Request ถูกยกเลิกเมื่อออกจากหน้าหรือผลลัพธ์เก่าไม่ทับผลใหม่
- [ ] Retry ไม่ทำให้ registration ซ้ำ
- [ ] Missing URL และ malformed payload ให้ error ที่วินิจฉัยได้
- [ ] ผู้ใช้เห็นสถานะระหว่าง refresh โดยรายการไม่กระพริบหายโดยไม่จำเป็น

## Exit ticket

1. HTTP 404 และ network failure ต่างกันอย่างไร?
2. เหตุใด TypeScript interface อย่างเดียวจึงไม่ validate JSON?
3. GET กับ POST ควรออกแบบ Retry ต่างกันอย่างไร?

## อ่านเพิ่ม

- [MDN: Fetch API](https://developer.mozilla.org/docs/Web/API/Fetch_API)
- [React Native: Networking](https://reactnative.dev/docs/network)
- [Expo: Environment variables](https://docs.expo.dev/guides/environment-variables/)
