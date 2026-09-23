---
title: "สัปดาห์ 10: Location และ Maps"
sidebarTitle: "Location และ Maps"
---

import { Callout } from "nextra/components";

# สัปดาห์ 10: Location และ Maps

สัปดาห์นี้เพิ่มตำแหน่งปัจจุบัน แผนที่กิจกรรม และการเลือกสถานที่ โดยคำนึงถึงความแม่นยำ แบตเตอรี่ ความเป็นส่วนตัว และความต่างของ Android/iOS

## ผลลัพธ์การเรียนรู้

- ขอ foreground location permission ในเวลาที่เหมาะสม
- อ่านพิกัดและจัดการ timeout/error
- แสดง `MapView` และ `Marker`
- แยก current location ออกจาก event venue
- อธิบาย platform configuration และความเป็นส่วนตัวของข้อมูลตำแหน่ง

## ติดตั้ง

```bash
npx expo install expo-location react-native-maps
```

## อ่านตำแหน่งปัจจุบัน

```tsx
import * as Location from 'expo-location';

type Coordinates = { latitude: number; longitude: number };

export async function getCurrentCoordinates(): Promise<Coordinates> {
  const permission = await Location.requestForegroundPermissionsAsync();
  if (!permission.granted) {
    throw new Error('location-permission-denied');
  }

  const position = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });

  return {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
  };
}
```

ใช้ accuracy เท่าที่งานต้องการ เพราะความแม่นยำสูงขึ้นอาจใช้เวลาและแบตเตอรี่มากขึ้น Campus Events ต้องการพิกัดสถานที่โดยประมาณ ไม่จำเป็นต้องติดตามแบบ background

## แสดง Event venue

```tsx
<MapView
  style={{ flex: 1 }}
  initialRegion={{
    latitude: venue.latitude,
    longitude: venue.longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  }}
  showsUserLocation={permissionGranted}
>
  <Marker
    coordinate={venue}
    title={event.title}
    description={event.location.name}
  />
</MapView>
```

`initialRegion` ใช้ค่าเริ่มต้น หากต้องควบคุม map ทุกครั้งให้ใช้ `region` อย่างระมัดระวัง เพราะ update บ่อยอาจทำให้ผู้ใช้เลื่อนแผนที่ลำบาก

## Permission และ Platform differences

- ตั้ง usage descriptions ใน app config ให้บอกวัตถุประสงค์จริง
- ทดสอบบน Android/iOS เพราะ provider และ permission dialog ต่างกัน
- แสดงสถานที่กิจกรรมได้แม้ผู้ใช้ไม่ให้ current location เมื่อมีพิกัด venue
- อย่าเก็บตำแหน่งย้อนหลังถ้า product ไม่จำเป็น
- ขอ background location เฉพาะเมื่อ requirement ชัดเจนและอธิบายผลกระทบได้

## Development map กับ Production configuration

`react-native-maps` ใน Expo Go ใช้ทดสอบพื้นฐานได้โดยไม่ตั้งค่าเพิ่ม แต่เมื่อสร้างแอปเผยแพร่ต้องตรวจ provider และ credentials ของ binary จริง:

- Android ใช้ Google Maps และ Production Build ต้องตั้งค่า Google Maps API key ตาม package name และ signing certificate
- iOS ใช้ Apple Maps เป็นค่าเริ่มต้น หรือเลือก Google Maps พร้อม iOS API key และ native configuration
- แผนที่ไม่ได้เปลี่ยน source เป็น OpenStreetMap เพียงเพราะใช้ `PROVIDER_DEFAULT`
- การแสดงตำแหน่งผู้ใช้ต้องประกาศ usage description และขอ foreground permission ก่อน

ตัวอย่าง `app.config.ts` สำหรับ Android Production Build:

```tsx
import type { ConfigContext, ExpoConfig } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => {
  const apiKey = process.env.GOOGLE_MAPS_ANDROID_API_KEY;
  if (!apiKey) throw new Error('ไม่พบ GOOGLE_MAPS_ANDROID_API_KEY');

  return {
    ...config,
    name: 'Campus Events',
    slug: 'campus-events',
    plugins: [
      ...(config.plugins ?? []),
      [
        'expo-location',
        {
          locationWhenInUsePermission:
            'อนุญาตให้ Campus Events ใช้ตำแหน่งเพื่อเลือกสถานที่จัดกิจกรรม',
        },
      ],
      ['react-native-maps', { androidGoogleMapsApiKey: apiKey }],
    ],
  };
};
```

เก็บ key ใน EAS Environment Variables และจำกัดการใช้งานตาม application/package ที่ Google Cloud อนุญาต การเปลี่ยน config plugin หรือ API key ที่ฝังใน native binary ต้องสร้าง build ใหม่ งาน Lab ไม่ต้องให้ทุกทีมเปิด billing แต่ต้องอธิบาย production plan ได้

<Callout type="info">
  “ตำแหน่งของฉัน” และ “สถานที่จัดกิจกรรม” เป็นข้อมูลคนละชุด ผู้ใช้ปฏิเสธ location permission แล้วควรยังเปิดแผนที่ venue ได้
</Callout>

## Lab 10 — Current location และ Event map

1. เพิ่มแผนที่ใน Event detail พร้อม venue marker
2. เพิ่มปุ่ม “ใช้ตำแหน่งปัจจุบัน” ในฟอร์มผู้จัดกิจกรรม
3. ให้ผู้ใช้แตะแผนที่เพื่อปรับหมุดสถานที่
4. แสดง fallback เมื่อ permission denied หรือดึงพิกัดไม่ได้
5. ทดสอบตำแหน่งจำลองและเครื่องจริง
6. ระบุ provider และ production configuration ที่ทีมจะใช้

## สิ่งที่ส่ง

- Permission/config matrix ของ Android และ iOS
- วิดีโอ Event venue, current location และ manual selection
- Privacy note ระบุว่าพิกัดถูกใช้และเก็บอย่างไร

## Definition of Done

- [ ] Event venue แสดงได้แม้ไม่ให้ current location
- [ ] Loading/Error/Denied states มีข้อความและ action
- [ ] ไม่ขอ background location โดยไม่มีเหตุผล
- [ ] Marker ที่เลือกถูกส่งกลับไปยัง form state
- [ ] ทดสอบอย่างน้อย Android emulator และอุปกรณ์จริงหนึ่งแบบ
- [ ] Production plan ระบุ API key restriction และกรณีที่ต้อง rebuild

## Exit ticket

1. Accuracy สูงมีต้นทุนอะไร?
2. `initialRegion` และ `region` ต่างกันอย่างไร?
3. เพราะเหตุใด Venue map จึงไม่ควรขึ้นกับ permission ของตำแหน่งผู้ใช้เสมอ?

## อ่านเพิ่ม

- [Expo Location](https://docs.expo.dev/versions/latest/sdk/location/)
- [React Native Maps](https://github.com/react-native-maps/react-native-maps)
- [Expo: App configuration](https://docs.expo.dev/workflow/configuration/)