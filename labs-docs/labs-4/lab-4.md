---
title: "สัปดาห์ 4: Expo Router และ Navigation"
sidebarTitle: "Expo Router และ Navigation"
---

import { Callout } from "nextra/components";

# สัปดาห์ 4: Expo Router และ Navigation

Expo Router เป็นเส้นทางหลักของรายวิชา เพราะใช้โครงสร้างไฟล์กำหนด URL, รองรับ deep link และสร้างบน React Navigation ส่วน React Navigation โดยตรงใช้เพื่ออธิบายกลไกเบื้องหลังหรือกรณีขั้นสูงเท่านั้น

## ผลลัพธ์การเรียนรู้

- ออกแบบ file-based routes ด้วย Stack, Tabs และ route groups
- สร้าง Dynamic route และตรวจ route parameter ก่อนใช้
- นำทางด้วย `Link`, `router.push` และ `router.replace`
- อธิบาย back behavior และ deep link
- จัดการเส้นทางที่ ID ไม่ถูกต้องหรือข้อมูลไม่พบ

## Route map ของ Campus Events

```text
app/
├── _layout.tsx
├── index.tsx                 # redirect ไป /events
├── (tabs)/
│   ├── _layout.tsx
│   ├── events.tsx            # /events
│   ├── favorites.tsx        # /favorites
│   └── profile.tsx          # /profile
├── events/
│   └── [id].tsx              # /events/:id (อยู่ใน Root Stack)
└── +not-found.tsx
```

โครงสร้างนี้ใช้ **Root Stack ครอบ Tabs** หน้า Events, Favorites และ Profile จึงแสดง Tab bar ตามปกติ ส่วน Event detail อยู่นอก `(tabs)` เมื่อเปิดรายละเอียด Root Stack จะวางหน้าใหม่ทับ Tabs และให้ปุ่มย้อนกลับอัตโนมัติ วงเล็บใน `(tabs)` ใช้จัดกลุ่มไฟล์โดยไม่เพิ่ม segment ใน URL

## Root Stack และ Tabs

```tsx
// app/_layout.tsx
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerBackTitle: 'กลับ' }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="events/[id]"
        options={{ title: 'รายละเอียดกิจกรรม' }}
      />
    </Stack>
  );
}
```

```tsx
// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="events" options={{ title: 'กิจกรรม' }} />
      <Tabs.Screen name="favorites" options={{ title: 'รายการโปรด' }} />
      <Tabs.Screen name="profile" options={{ title: 'โปรไฟล์' }} />
    </Tabs>
  );
}
```

```tsx
// app/index.tsx
import { Redirect } from 'expo-router';

export default function IndexScreen() {
  return <Redirect href="/events" />;
}
```

Layout แต่ละชั้นสร้าง Navigator ให้ routes ที่อยู่ข้างใต้: `app/_layout.tsx` สร้าง Stack และ `app/(tabs)/_layout.tsx` สร้าง Tabs การแยก Detail ออกนอกกลุ่ม Tabs ทำให้โครงสร้าง Stack → Tabs เข้าใจง่ายและไม่ต้องสร้าง `NavigationContainer` เอง

## Dynamic route และ Parameters

ส่งเฉพาะ ID ที่จำเป็น ไม่ส่ง event object ทั้งก้อนผ่าน URL เพราะข้อมูลอาจเก่า ให้อ่าน ID แล้วดึงข้อมูลจาก store/repository

```tsx
import { router, useLocalSearchParams } from 'expo-router';

router.push({ pathname: '/events/[id]', params: { id: event.id } });

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const eventId = Array.isArray(id) ? id[0] : id;

  if (!eventId) return <InvalidRouteState />;
  return <EventDetail eventId={eventId} />;
}
```

## Deep links และเส้นทางไม่พบ

Deep link เช่น `campusevents://events/42` ควรเปิดหน้ารายละเอียดได้แม้ไม่ได้ผ่านหน้ารายการ ตรวจทั้งกรณี ID ถูกต้อง, ID ไม่มีอยู่ และผู้ใช้ยังไม่ Login

```json
{
  "expo": {
    "scheme": "campusevents",
    "plugins": ["expo-router"]
  }
}
```

<Callout type="info">
  Expo Router ใช้ React Navigation เป็นพื้นฐาน จึงยังเรียนรู้แนวคิด Stack, Tabs, screen options และ navigation state ได้โดยไม่ต้องสร้าง NavigationContainer ซ้ำเอง
</Callout>

## Lab 4 — Navigation ของ Campus Events

1. สร้าง routes `/events`, `/events/[id]`, `/favorites` และ `/profile`
2. ใช้ Tabs สำหรับหน้าหลักและ Stack สำหรับ Event detail
3. เปิด Detail จาก `EventCard` ด้วย ID
4. เพิ่ม `+not-found.tsx` และ Invalid event state
5. ทดสอบ reload/deep link และปุ่ม Back ของ Android

## สิ่งที่ส่ง

- Route diagram
- วิดีโอการนำทาง Tabs → Detail → Back
- ผลทดสอบ deep link ทั้ง ID ที่มีและไม่มี

## Definition of Done

- [ ] URL ตรงตาม route map
- [ ] ไม่มี `NavigationContainer` ซ้อนกับ Expo Router
- [ ] Route parameter มี type และ validate ก่อนใช้
- [ ] Android Back และ header Back ทำงานตามคาด
- [ ] Deep link เข้า Detail ได้โดยไม่ต้องเปิด List ก่อน

## Exit ticket

1. Route group ต่างจาก URL segment อย่างไร?
2. เหตุใดจึงควรส่ง ID แทน object ผ่าน route?
3. `push` และ `replace` เหมาะกับ flow ต่างกันอย่างไร?

## อ่านเพิ่ม

- [Expo Router: Introduction](https://docs.expo.dev/router/introduction/)
- [Expo Router: Navigation](https://docs.expo.dev/router/navigating-pages/)
- [Expo Router: Tabs](https://docs.expo.dev/router/advanced/tabs/)
