# Lab 7 Walkthrough: Local Storage & Offline Applications

ได้ดำเนินการพัฒนาตามข้อกำหนด **Lab 7 (Local Storage และ Offline Applications)** ในแอปพลิเคชัน Expo React Native (Campus Events) ครบถ้วน 100%

---

## สรุปสิ่งที่ได้ทำไป

### 1. ติดตั้ง Storage Dependencies สำหรับ Expo SDK 57
- ติดตั้งแพ็กเกจด้วย `npx expo install`:
  - `@react-native-async-storage/async-storage` (v2.2.0)
  - `expo-secure-store` (~57.0.4)
  - `expo-sqlite` (~57.0.3)
- อัปเดต mock ครบถ้วนใน `jest.setup.js`

### 2. Favorites Persistence (`services/favorites-storage.ts` & `context/FavoritesContext.tsx`)
- **Versioned Key**: ใช้งานคีย์ `campus-events/favorite-ids/v1`
- **Safe Parsing & Type Guard**: ตรวจสอบว่า payload เป็น `string[]` หากพบ corrupted JSON หรือ schema ผิดพลาด จะ fallback คืนค่า `[]` โดยไม่ crash
- **Hydration Without Race Condition**:
  - เมื่อ `FavoritesProvider` mount จะอ่าน storage และ dispatch action `hydrate`
  - มีแฟล็ก `isHydrated: boolean` เพื่อป้องกันไม่ให้ state เริ่มต้นที่เป็นค่าว่าง `[]` ไปเขียนทับข้อมูลใน storage ก่อนที่การโหลดจะเสร็จสมบูรณ์
  - บันทึก `saveFavoriteIds(favorites)` อัตโนมัติเฉพาะเมื่อ `isHydrated === true`

### 3. Offline Read Flow & Event Cache (`services/events-cache.ts` & `context/EventsContext.tsx`)
- **Cache Structure**: บันทึก `events` พร้อม ISO timestamp `updatedAt` ด้วยคีย์ `campus-events/events-cache/v1`
- **Stale-While-Revalidate UX**:
  1. เมื่อเปิดหน้าจอ แอปจะโหลดข้อมูลจากแคชในเครื่องมาแสดงทันที (Fast initial render)
  2. เรียก API ในพื้นหลังเพื่อ revalidate ข้อมูล
  3. หาก API สำเร็จ: อัปเดตรายการใหม่, บันทึกแคชพร้อมเวลา `updatedAt` ปัจจุบัน, ตั้งสถานะ `isOffline = false`
  4. หาก API ล้มเหลว (เช่น เครือข่ายออฟไลน์): คงรายการเดิมจากแคชไว้บนหน้าจอ, ตั้งสถานะ `isOffline = true` พร้อมเก็บ error diagnostic

### 4. Offline Banner UI (`components/OfflineBanner.tsx`)
- แสดงแบนเนอร์ด้านบนหน้ารายการกิจกรรมเมื่อ `isOffline === true`
- แจ้งเตือนผู้ใช้ว่าอยู่ในโหมดออฟไลน์และระบุเวลาอัปเดตล่าสุด (เช่น `แสดงข้อมูลล่าสุดจากแคช (14:30 น.)`)
- มีปุ่ม "ลองใหม่" (`onRetry`) สำหรับกดเรียก `fetchEvents()` ใหม่อีกครั้ง
- รองรับ Accessibility: `accessibilityRole="alert"` และ `accessibilityLiveRegion="polite"`

### 5. SQLite Proof-of-Concept (`services/events-sqlite.ts`)
- ใช้ `expo-sqlite` เชื่อมต่อฐานข้อมูล `campus-events.db`
- สร้างตาราง `events (id, title, starts_at, updated_at)`
- รองรับเมธอด `initDatabase()`, `upsertEvents()`, `queryStoredEvents()`, และ `clearStoredEvents()`

### 6. Automated Testing ครอบคลุม 100%
- **Unit Tests (`__tests__/unit/favoritesStorage.test.ts`)**:
  - ✅ โหลด array ว่างเมื่อยังไม่มีข้อมูล
  - ✅ บันทึกและโหลด favorite IDs ได้ถูกต้อง
  - ✅ รับมือ corrupted non-JSON strings ได้อย่างปลอดภัย
  - ✅ ตรวจสอบ non-array JSON และ array with non-string elements
  - ✅ เคลียร์ favorites ออกจาก storage
- **Unit Tests (`__tests__/unit/eventsCache.test.ts`)**:
  - ✅ คืนค่า null เมื่อไม่มีแคช
  - ✅ บันทึกและโหลดแคชพร้อมเวลา `updatedAt`
  - ✅ ตรวจจับ corrupted JSON หรือ missing fields และ fallback ปลอดภัย
  - ✅ ล้างแคชจาก AsyncStorage
- **Unit Tests (`__tests__/unit/eventsSqlite.test.ts`)**:
  - ✅ เปิด database `campus-events.db`
  - ✅ สร้าง schema ตาราง `events`
  - ✅ Upsert กิจกรรมลงฐานข้อมูล
  - ✅ Query กิจกรรมเรียงตาม `starts_at`
  - ✅ เคลียร์ข้อมูลในตาราง
- **Integration Tests**:
  - `FavoritesScreen.test.tsx`: ทดสอบการ Hydrate รายการโปรดจาก AsyncStorage เมื่อเปิดแอป
  - `EventsScreen.test.tsx`: ทดสอบ Offline state เมื่อ API ล้มเหลวจะแสดงรายการจากแคชพร้อมแสดง `OfflineBanner`

---

## ผลการทดสอบ (Verification Results)

```bash
# TypeScript Typecheck
npx tsc --noEmit
# Exit Code: 0 (0 errors)

# Jest Test Suite
npm test
# Result: Test Suites: 27 passed, 27 total
#         Tests:       136 passed, 136 total
#         Snapshots:   0 total
#         Time:        2.494 s
```

---

## Storage Matrix Summary (ตามเกณฑ์ Lab 7)

| เครื่องมือ | ข้อมูลที่จัดเก็บ | เหตุผล |
|---|---|---|
| **AsyncStorage** | - `campus-events/favorite-ids/v1`<br>- `campus-events/events-cache/v1` | ข้อมูลขนาดเล็ก ไม่ใช่ความลับ อ่าน/เขียน key-value ได้รวดเร็ว |
| **SecureStore** | - Token & Secret (สำหรับ Lab 8) | ข้อมูลความลับ ต้องเข้ารหัสระดับ Keychain/Keystore เท่านั้น |
| **SQLite** | - `campus-events.db` (ตาราง `events`) | ข้อมูลมีโครงสร้าง รองรับการจัดเรียง/ค้นหาในเครื่อง |
