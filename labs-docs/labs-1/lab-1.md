---
title: "สัปดาห์ 1: Mobile Development, React Native และ Expo"
sidebarTitle: "Mobile, React Native และ Expo"
---

import { Callout } from "nextra/components";

# สัปดาห์ 1: Mobile Development, React Native และ Expo

สัปดาห์นี้เริ่ม Campus Events Mobile และทำความเข้าใจว่าแอปมือถือแตกต่างจากเว็บอย่างไร เป้าหมายไม่ใช่เพียงให้แอปรันได้ แต่ให้ทุกคนมี environment ที่ตรวจสอบซ้ำได้และใช้ TypeScript ตั้งแต่ไฟล์แรก

## ผลลัพธ์การเรียนรู้

ผู้เรียนสามารถ:

- อธิบาย Native, Cross-platform และบทบาทของ React Native bridge/runtime ในภาพรวม
- แยกหน้าที่ของ React Native, Expo, Expo Router และ TypeScript
- เลือก Expo Go หรือ Development Build ให้ตรงกับความสามารถที่ต้องทดสอบ
- สร้างและรัน Expo project บน Android Emulator และอุปกรณ์จริง
- สร้าง Profile screen ด้วย Core Components และ typed data

## Course Technology Baseline

รายวิชาใช้ baseline เดียวตลอดงานที่ให้คะแนน เพื่อให้ทุกคนติดตั้ง package และแก้ปัญหาจาก environment ชุดเดียวกัน

| รายการ | นโยบายของรายวิชา |
| --- | --- |
| Mobile framework | React Native ผ่าน Expo |
| Expo SDK/Template | ผู้สอนประกาศ template และ Expo SDK ที่อนุมัติก่อนเปิดภาคเรียน |
| ภาษา | TypeScript และไฟล์ `.ts`/`.tsx` |
| Navigation | Expo Router |
| Node.js | Node.js LTS รุ่นที่ผู้สอนประกาศ |
| Package manager | ใช้ `npm` ในตัวอย่างและเก็บ `package-lock.json` |

`create-expo-app@latest` เปลี่ยนค่าเริ่มต้นได้ตามเวลา งานที่ให้คะแนนจึงต้องใช้คำสั่งที่ผู้สอนประกาศ เช่น `--template default@sdk-XX` และห้ามเปลี่ยน Expo SDK กลางภาคโดยไม่ประสานผู้สอน

```bash
# รูปแบบคำสั่ง ผู้สอนจะแทน sdk-XX ด้วย baseline ของภาคเรียนนั้น
npx create-expo-app@latest campus-events --template default@sdk-XX
```

หลังสร้างโปรเจกต์ให้บันทึกเวอร์ชันจาก `package.json` ไว้ใน README ของทีม หากเอกสารออนไลน์ต่างจาก baseline ให้เปิดเอกสารของ Expo SDK ที่รายวิชาใช้ก่อนคัดลอกตัวอย่าง

## ภาพรวมสถาปัตยกรรม

| ชั้น | หน้าที่ใน Campus Events Mobile |
| --- | --- |
| Screen/Component | แสดง Event list, Detail, Favorite และ Profile |
| State/Hook | เก็บค่าหน้าจอและประสาน interaction |
| Service/Repository | ติดต่อ API และ Local storage |
| Expo modules | เข้าถึง Camera, Location, Notifications และระบบปฏิบัติการ |
| Native platform | Android/iOS render UI และจัดการ hardware |

React Native ไม่ได้แสดงเว็บใน WebView แต่สร้าง UI ด้วย native components ของแพลตฟอร์ม ส่วน Expo ช่วยจัดการ toolchain, native modules และ build workflow ให้สม่ำเสมอขึ้น

## Expo Go, Development, Preview และ Production Build

| เลือกใช้ | เหมาะกับ | ข้อจำกัดสำคัญ |
| --- | --- | --- |
| Expo Go | เรียนรู้และทำ prototype อย่างรวดเร็ว | ใช้ได้เฉพาะ native modules ที่รวมมากับ Expo Go |
| Development Build | พัฒนาแอปจริงด้วย native modules/configuration ของโปรเจกต์ | ต้องสร้างและติดตั้ง development client |
| Preview Build | แจกให้ทีม ผู้สอน หรือผู้ทดสอบตรวจงาน | ไม่มีเครื่องมือพัฒนาเต็มรูปแบบ |
| Production Build | รุ่นสำหรับส่ง Store หรือเผยแพร่จริง | ต้องผ่าน release checklist และ signing |

<Callout type="info">
  เริ่มด้วย Expo Go ในบทพื้นฐาน แล้วเปลี่ยนเป็น Development Build ภายในสัปดาห์ 8 ก่อนทำงานที่พึ่ง native configuration เช่น Face ID, notification configuration และการทดสอบใกล้เคียงแอปจริง
</Callout>

## สร้าง Campus Events Mobile

ต้องมี Node.js รุ่น LTS, Git และ Android Studio หรืออุปกรณ์จริง ไม่ต้องติดตั้ง `expo-cli` แบบ global

```bash
# ใช้คำสั่ง baseline ที่ผู้สอนประกาศแทน sdk-XX
npx create-expo-app@latest campus-events --template default@sdk-XX
cd campus-events
npx expo start
```

Template ที่รายวิชาอนุมัติต้องมี TypeScript และ Expo Router พร้อมใช้งาน ตรวจ `package.json` และ `app/` ก่อนเพิ่ม package ใด ๆ

```text
campus-events/
├── app/
│   ├── _layout.tsx
│   └── index.tsx
├── assets/
├── components/
├── app.json
├── package.json
└── tsconfig.json
```

## TypeScript ที่ใช้ในสัปดาห์นี้

```tsx
import { StyleSheet, Text, View } from 'react-native';

type StudentProfile = {
  name: string;
  program: string;
  interests: string[];
};

const profile: StudentProfile = {
  name: 'นักศึกษา Mobile Developer',
  program: 'Computer and Information Science',
  interests: ['Campus events', 'Mobile UX'],
};

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{profile.name}</Text>
      <Text>{profile.program}</Text>
      <Text>{profile.interests.join(' · ')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, gap: 8 },
  title: { fontSize: 24, fontWeight: '700' },
});
```

## Lab 1 — Setup และ Profile (ประมาณ 2 ชั่วโมง)

1. สร้าง repository และ Expo project ชื่อ `campus-events`
2. รันบน Android Emulator และอุปกรณ์จริงอย่างน้อยหนึ่งแบบ
3. สร้าง Profile screen จาก typed object ของตนเอง
4. เพิ่มชื่อรายวิชา ความสนใจ และภาพจาก `assets/`
5. บันทึกวิธีเริ่มโปรเจกต์และปัญหาที่พบใน `README.md`

## สิ่งที่ส่ง

- URL repository
- ภาพหรือวิดีโอสั้นที่แอปรันบนอุปกรณ์
- `README.md` ที่ระบุ prerequisites และคำสั่งเริ่มโปรเจกต์

## Definition of Done

- [ ] เริ่มแอปได้ด้วย `npx expo start`
- [ ] ไฟล์หน้าจอเป็น `.tsx` และไม่มี TypeScript error
- [ ] Profile ใช้ `View`, `Text`, `Image` หรือองค์ประกอบพื้นฐานอย่างเหมาะสม
- [ ] ไม่มี secret, build artifact หรือ `node_modules` ใน Git
- [ ] อธิบายได้ว่าฟีเจอร์ใดควรเปลี่ยนจาก Expo Go ไป Development Build

## Exit ticket

1. React Native ต่างจากเว็บใน WebView อย่างไร?
2. Expo Go และ Development Build มี trade-off ต่างกันอย่างไร?
3. TypeScript ช่วยลดข้อผิดพลาดของข้อมูลกิจกรรมได้อย่างไร?

## อ่านเพิ่ม

- [Expo: Create a project](https://docs.expo.dev/get-started/create-a-project/)
- [React Native: Environment setup](https://reactnative.dev/docs/environment-setup)
- [Expo: Development builds](https://docs.expo.dev/develop/development-builds/introduction/)
