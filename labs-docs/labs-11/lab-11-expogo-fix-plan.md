# Plan — แก้ไขปัญหา `expo-notifications` ใน Expo Go บน Android

## 1. ผลการวิเคราะห์สาเหตุของ Error (Root Cause Analysis)

จากข้อความ Error ที่เกิดขึ้นใน `labs-docs/labs-11/error.md`:
```text
ERROR [Error: expo-notifications: Android Push notifications (remote notifications) functionality provided by expo-notifications was removed from Expo Go with the release of SDK 53. Use a development build instead of Expo Go.]

Code: _layout.tsx
> 3 | import * as Notifications from 'expo-notifications';
```

### ทำไมจึงเกิดปัญหานี้?
1. **การเปลี่ยนแปลงของ Expo SDK 53+:**
   - Expo ได้ถอดระบบ **Remote Push Notifications (FCM)** ออกจากแอป **Expo Go บน Android** เนื่องจาก Google ได้ยกเลิก Legacy FCM API
   - อย่างไรก็ตาม ฟังก์ชัน **Local Notifications (เช่น การตั้งเตือนกิจกรรมล่วงหน้าในเครื่อง)** นั้น **ยังคงรองรับและสามารถทำงานได้ใน Expo Go**
2. **Side-Effect Bug ภายในตัวแพ็กเกจ `expo-notifications`:**
   - เมื่อมีการสั่ง `import * as Notifications from 'expo-notifications'` ตัว Bundler จะไปอ่านไฟล์ `node_modules/expo-notifications/build/index.js`
   - ในบรรทัดที่ 36 ของ `index.js` มีการ export:
     ```js
     export { setAutoServerRegistrationEnabledAsync } from './DevicePushTokenAutoRegistration.fx';
     ```
   - ไฟล์ `.fx` นี้เป็น **Side-effect script** ที่จะถูกประมวลผลทันที ณ วินาทีที่ Import โมดูล (Import-time execution)
   - ภายในไฟล์ `DevicePushTokenAutoRegistration.fx.js` มีการเรียกฟังก์ชัน `addPushTokenListener()` ซึ่งไปเรียกฟังก์ชันตรวจเช็กสภาพแวดล้อม:
     ```js
     // node_modules/expo-notifications/build/warnOfExpoGoPushUsage.js
     export const warnOfExpoGoPushUsage = () => {
       if (isRunningInExpoGo() && !didWarn) {
         if (Platform.OS === 'android') {
           throw new Error(message); // <-- โยน Error ทันทีเมื่อรันบน Android ใน Expo Go!
         }
       }
     };
     ```
   - **สรุปสาเหตุ:** เพียงแค่แอปนำเข้า (import) ไลบรารี `expo-notifications` ตัวโค้ด Remote Push Token Auto-registration จะทำงานอัตโนมัติ และสั่ง **`throw new Error` ทำให้แอป Crash ทันทีที่บรรทัด `import`** แม้ว่าแอปของเราจะต้องการใช้งานเพียง Local Reminder และไม่ได้ใช้ Remote Push เลยก็ตาม

---

## 2. Proposed Changes (แผนการแก้ไข)

### ชั้นที่ 1: Automatic Patching Script (`scripts/patch-notifications.js`)
สร้าง Script สำหรับ Patch ตัวแพ็กเกจ `expo-notifications` หลังการติดตั้ง เพื่อ:
1. แก้ไข `warnOfExpoGoPushUsage.js`: เปลี่ยนจาก `throw new Error(message)` เป็น `console.warn(message)` เพื่อให้แจ้งเตือนได้โดยไม่ทำให้แอปแครช
2. แก้ไข `DevicePushTokenAutoRegistration.fx.js`: หุ้มบล็อกคำสั่ง Auto-registration ด้วย `try ... catch` เพื่อข้ามการลงทะเบียน Remote Push Token บน Expo Go อย่างปลอดภัย
3. เพิ่มคำสั่งใน `package.json`:
   ```json
   "scripts": {
     "postinstall": "node scripts/patch-notifications.js"
   }
   ```

### ชั้นที่ 2: Defensive Application Architecture (`app/_layout.tsx` & `services/notification.ts`)
ปรับแต่งโค้ดในระดับ Application ให้มี Fail-safe Handling:
1. หุ้มการตั้งค่า `configureNotificationHandler()` และ `getLastNotificationResponse()` ด้วย `try ... catch`
2. แสดง UI ข้อความแจ้งเตือนที่เข้าใจง่ายหากพบว่าอุปกรณ์หรือสภาพแวดล้อมไม่รองรับ Native Notification แทนการปล่อยให้เกิด Unhandled Rejection

---

## 3. Verification Plan

### การทดสอบอัตโนมัติ (Automated Tests)
- รัน `npm test` เพื่อตรวจสอบว่า Unit & Integration Tests ทั้ง 21 Suites (92 Tests) ผ่าน 100%
- รัน `npx tsc --noEmit` เพื่อตรวจสอบความถูกต้องของ TypeScript

### การทดสอบบนอุปกรณ์ (Manual / Expo Go)
- สั่งรัน `npx expo start` และเปิดผ่าน Expo Go บนอุปกรณ์ Android / Android Emulator
- ตรวจสอบว่าหน้าแรกโหลดขึ้นมาได้ปกติ ไม่มีหน้าจอสีแดง (RedBox Error)
- ทดสอบกดปุ่ม "ทดสอบเตือน 5 วิ" และ "เตือนก่อน 30 นาที" ในหน้ารายละเอียดกิจกรรม
