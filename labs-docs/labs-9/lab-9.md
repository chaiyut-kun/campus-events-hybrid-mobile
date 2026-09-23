---
title: "สัปดาห์ 9: Camera, Image Picker และ Permissions"
sidebarTitle: "Camera, Image และ Permissions"
---

import { Callout } from "nextra/components";

# สัปดาห์ 9: Camera, Image Picker และ Permissions

ผู้จัดกิจกรรมต้องถ่ายหรือเลือกรูปประกอบกิจกรรม สัปดาห์นี้เน้น Permission lifecycle, file URI, preview และ UX เมื่อผู้ใช้ปฏิเสธ มากกว่าการขอสิทธิ์ทั้งหมดทันทีที่เปิดแอป

## ผลลัพธ์การเรียนรู้

- ติดตั้ง Expo modules ด้วยเวอร์ชันที่ตรงกับ Expo SDK
- ขอ Camera/Media permission เมื่อผู้ใช้เริ่มใช้ฟีเจอร์
- แยก `granted`, `denied`, `canAskAgain` และการเปิด Settings
- ถ่ายหรือเลือกรูปและแสดง preview
- ตรวจชนิด/ขนาดรูปและอธิบายว่า local URI มีอายุอย่างไร

## ติดตั้ง

```bash
npx expo install expo-camera expo-image-picker
```

ตรวจเอกสารของ Expo SDK ที่โปรเจกต์ใช้ก่อนคัดลอก API เพราะ native modules เปลี่ยนตามรุ่น

## Permission UX

```text
ผู้ใช้กด “เพิ่มรูป”
  → อธิบายว่าต้องใช้รูปทำอะไร
  → ขอ Permission
     ├─ Granted → เปิด Camera/Picker
     ├─ Denied + canAskAgain → ให้ลองใหม่เมื่อผู้ใช้กด
     └─ Denied ถาวร → ปุ่มเปิด Settings + ทางเลือกข้าม
```

<Callout type="warning">
  อย่าขอ Camera และ Location พร้อมกันตอนเปิดแอป ขอเมื่อผู้ใช้เข้าใจบริบทและกำลังเริ่มใช้ฟีเจอร์นั้น พร้อมให้ทางเลือกเมื่อปฏิเสธ
</Callout>

## เลือกรูปจากเครื่อง

```tsx
import * as ImagePicker from 'expo-image-picker';

async function chooseEventImage() {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) {
    return { status: 'denied' as const, canAskAgain: permission.canAskAgain };
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    quality: 0.8,
  });

  if (result.canceled) return { status: 'canceled' as const };
  return { status: 'selected' as const, asset: result.assets[0] };
}
```

## ถ่ายรูปด้วย CameraView

```tsx
import { CameraView, useCameraPermissions } from 'expo-camera';

const [permission, requestPermission] = useCameraPermissions();
const cameraRef = useRef<React.ComponentRef<typeof CameraView>>(null);

async function takePhoto() {
  const photo = await cameraRef.current?.takePictureAsync({ quality: 0.8 });
  if (photo) setDraftImageUri(photo.uri);
}
```

หลังได้ URI ให้ preview ก่อน upload ลดขนาดเมื่อเหมาะสม และให้ backend ตรวจ MIME type/ขนาดซ้ำ อย่าเชื่อเพียง file extension จาก client

## Lab 9 — Event photo

1. เพิ่ม action sheet “ถ่ายรูป / เลือกจากคลัง / ยกเลิก”
2. ขอ permission เฉพาะ action ที่เลือก
3. แสดง Preview, Retake/Choose again และ Remove
4. รองรับ permission denied และเปิด Settings เมื่อถามซ้ำไม่ได้
5. เก็บเฉพาะ draft URI ใน form และจำลอง upload

## สิ่งที่ส่ง

- Permission state diagram
- วิดีโอ Granted, Denied และ Canceled paths
- ข้อกำหนด file validation ฝั่ง client และ server

## Definition of Done

- [ ] แอปไม่ crash เมื่อปฏิเสธ Permission
- [ ] ไม่ขอ Permission ก่อนผู้ใช้เริ่มฟีเจอร์
- [ ] ผู้ใช้ยกเลิก Camera/Picker แล้วข้อมูลฟอร์มเดิมยังอยู่
- [ ] รูปมี Preview และ Remove/Replace action
- [ ] อธิบายได้ว่า URI ชั่วคราวต่างจากไฟล์ที่ upload แล้วอย่างไร

## Exit ticket

1. `canAskAgain` เปลี่ยน UX อย่างไร?
2. เพราะเหตุใด backend ต้อง validate รูปซ้ำ?
3. ควรเก็บรูปไว้ที่ใดเมื่อผู้ใช้ยังไม่ submit form?

## อ่านเพิ่ม

- [Expo Camera](https://docs.expo.dev/versions/latest/sdk/camera/)
- [Expo ImagePicker](https://docs.expo.dev/versions/latest/sdk/imagepicker/)
- [Expo Permissions guide](https://docs.expo.dev/guides/permissions/)