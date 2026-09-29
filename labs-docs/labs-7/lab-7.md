---
title: "สัปดาห์ 7: Local Storage และ Offline Applications"
sidebarTitle: "Storage และ Offline"
---

import { Callout } from "nextra/components";

# สัปดาห์ 7: Local Storage และ Offline Applications

แอปมือถือควรทำงานได้อย่างมีความหมายเมื่อเครือข่ายไม่พร้อม สัปดาห์นี้ออกแบบแหล่งข้อมูลในเครื่องและสถานะความสดของข้อมูล โดยไม่สับสนระหว่าง Cache กับข้อมูลที่เป็นความลับ

## ผลลัพธ์การเรียนรู้

- เลือก AsyncStorage, SecureStore และ SQLite ให้เหมาะกับข้อมูล
- serialize/deserialize พร้อมจัดการข้อมูลเสียหรือ schema เปลี่ยน
- เก็บ Favorite และ cache รายการกิจกรรม
- ออกแบบ offline-first read flow และการ sync เบื้องต้น
- แสดงให้ผู้ใช้รู้ว่าข้อมูลเป็น cache และอัปเดตครั้งล่าสุดเมื่อใด

## เลือกพื้นที่จัดเก็บ

| เครื่องมือ | ใช้กับ | ไม่ควรใช้กับ |
| --- | --- | --- |
| AsyncStorage | preference, favorite IDs, cache ขนาดเล็ก | token, password, query ซับซ้อน |
| SecureStore | access/refresh token หรือ secret ขนาดเล็ก | event list จำนวนมาก |
| SQLite | ข้อมูลมีโครงสร้าง ปริมาณมาก ค้นหา/กรอง/สัมพันธ์กัน | secret ที่ต้องการ keychain/keystore |

สรุปจำง่าย: **AsyncStorage → key/value ทั่วไป, SecureStore → ข้อมูลอ่อนไหว, SQLite → ข้อมูลถาวรแบบมีโครงสร้าง**

## ติดตั้ง

```bash
npx expo install @react-native-async-storage/async-storage expo-secure-store expo-sqlite
```

## Favorite repository

```tsx
import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = 'campus-events/favorite-ids/v1';

export async function loadFavoriteIds(): Promise<string[]> {
  const raw = await AsyncStorage.getItem(FAVORITES_KEY);
  if (!raw) return [];

  try {
    const value: unknown = JSON.parse(raw);
    return Array.isArray(value) && value.every((id) => typeof id === 'string')
      ? value
      : [];
  } catch {
    return [];
  }
}

export async function saveFavoriteIds(ids: string[]): Promise<void> {
  await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
}
```

## Offline read flow

```text
เปิดหน้า Events
  ├─ อ่าน cache และแสดงทันทีถ้ามี
  ├─ เรียก API เพื่อ revalidate
  │    ├─ สำเร็จ → แทนข้อมูล + บันทึก cache + updatedAt
  │    └─ ล้มเหลว → คง cache + แสดง Offline banner
  └─ ไม่มี cache และ API ล้มเหลว → Error state + Retry
```

<Callout type="warning">
  อย่าแสดง cache เก่าเหมือนเป็นข้อมูลล่าสุด ต้องบอกสถานะ Offline และเวลาอัปเดตครั้งล่าสุด รวมถึงกำหนดวิธีล้าง cache เมื่อ logout หรือ schema เปลี่ยน
</Callout>

## SQLite เบื้องต้น

เมื่อข้อมูลกิจกรรมโตขึ้น ใช้ SQLite เพื่อค้นหาตามสถานที่/เวลาและเก็บตารางที่สัมพันธ์กัน เช่น `events`, `registrations`, `sync_queue` เริ่มจาก schema เล็กและมี migration version อย่าพยายามแทน backend ด้วยฐานข้อมูลบนเครื่อง

```tsx
import * as SQLite from 'expo-sqlite';

const db = await SQLite.openDatabaseAsync('campus-events.db');
await db.execAsync(`
  CREATE TABLE IF NOT EXISTS events (
    id TEXT PRIMARY KEY NOT NULL,
    title TEXT NOT NULL,
    starts_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
`);
```

## Lab 7 — Favorites และ Offline event list

1. Hydrate Favorite state จาก AsyncStorage ก่อนแสดงผลพร้อมใช้
2. บันทึก Favorite ทุกครั้งที่ state เปลี่ยนโดยไม่เขียนทับก่อน hydrate เสร็จ
3. Cache event list พร้อม `updatedAt`
4. แสดง Offline banner และข้อมูลล่าสุดที่มี
5. สร้าง SQLite proof-of-concept สำหรับ event table

## สิ่งที่ส่ง

- Storage matrix ของข้อมูลทุกชนิด
- วิดีโอปิดเครือข่าย รีสตาร์ตแอป และยังเปิด Event list/Favorite ได้
- คำอธิบาย cache invalidation และวิธีล้างข้อมูล

## Definition of Done

- [ ] Restart แอปแล้ว Favorite ยังอยู่
- [ ] ไม่บันทึก token ใน AsyncStorage
- [ ] JSON เสียไม่ทำให้แอป crash
- [ ] Offline UI บอกเวลาอัปเดตล่าสุด
- [ ] Cache และ session ถูกล้างตาม lifecycle ที่กำหนด

## Exit ticket

1. ข้อมูลชนิดใดควรย้ายจาก AsyncStorage ไป SQLite?
2. เพราะเหตุใด SecureStore จึงไม่เหมาะกับ event cache?
3. Cache-first และ network-first ให้ UX ต่างกันอย่างไร?

## อ่านเพิ่ม

- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/)
- [Expo SecureStore](https://docs.expo.dev/versions/latest/sdk/securestore/)
- [Expo SQLite](https://docs.expo.dev/versions/latest/sdk/sqlite/)
