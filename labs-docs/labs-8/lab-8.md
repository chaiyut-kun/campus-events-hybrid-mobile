---
title: "สัปดาห์ 8: Authentication และ Mobile Security"
sidebarTitle: "Authentication และ Security"
---

import { Callout } from "nextra/components";

# สัปดาห์ 8: Authentication และ Mobile Security

สัปดาห์นี้เพิ่ม Login, Session restoration และ protected routes โดยแยก Authentication (ผู้ใช้คือใคร) ออกจาก Authorization (ผู้ใช้ทำสิ่งนี้ได้หรือไม่)

## ผลลัพธ์การเรียนรู้

- อธิบาย session, access token, refresh token และ token expiry
- เก็บ token ใน SecureStore และฟื้น session เมื่อเปิดแอป
- ป้องกัน route และตรวจสิทธิ์ซ้ำที่ API
- จัดการ logout, token หมดอายุ และ failed refresh
- อธิบายข้อจำกัดของ biometrics และความเสี่ยงพื้นฐานของ mobile app

## Authentication flow

```text
เปิดแอป → อ่าน token จาก SecureStore
  ├─ ไม่มี token → Anonymous routes
  ├─ token ใช้ได้ → Authenticated routes
  └─ tokenหมดอายุ → refresh
       ├─ สำเร็จ → บันทึก token ใหม่
       └─ ล้มเหลว → ล้าง session และไป Login
```

อย่าเก็บรหัสผ่านของผู้ใช้ไว้ในเครื่องหลังส่ง Login และอย่าบันทึก token ลง log, crash report หรือ URL

## Session Provider

```tsx
type SessionState =
  | { status: 'loading' }
  | { status: 'anonymous' }
  | { status: 'authenticated'; accessToken: string; user: User };

async function restoreSession(): Promise<SessionState> {
  const token = await SecureStore.getItemAsync('session/access-token');
  if (!token) return { status: 'anonymous' };

  const user = await getCurrentUser(token);
  return { status: 'authenticated', accessToken: token, user };
}
```

จัดการกรณี token ใช้ไม่ได้ด้วยการลบ token และกลับสู่ anonymous state ไม่ปล่อยให้แอปค้างที่ loading

## Protected routes ด้วย Expo Router

Expo Router รุ่นปัจจุบันใช้ `Stack.Protected` หรือ `Tabs.Protected` เพื่อกำหนดว่า route ใดเข้าถึงได้ตาม session โดย Router จะนำผู้ใช้ออกจากหน้าที่ถูกป้องกันเมื่อ guard เปลี่ยนเป็น `false`

```tsx
// app/_layout.tsx
import { Stack } from 'expo-router';

export default function RootLayout() {
  const { session } = useSession();

  if (session.status === 'loading') return <SessionLoading />;

  const isAuthenticated = session.status === 'authenticated';

  return (
    <Stack>
      <Stack.Protected guard={!isAuthenticated}>
        <Stack.Screen name="login" options={{ title: 'เข้าสู่ระบบ' }} />
      </Stack.Protected>

      <Stack.Protected guard={isAuthenticated}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ title: 'ลงทะเบียนกิจกรรม' }} />
      </Stack.Protected>
    </Stack>
  );
}
```

โปรเจกต์ที่ใช้ Expo Router รุ่นเก่ายังใช้ `<Redirect href="/login" />` ใน layout ได้ แต่ baseline ใหม่ของรายวิชาให้ใช้ Protected routes เป็นหลัก ตรวจเวอร์ชัน `expo-router` ใน `package.json` ก่อนใช้ตัวอย่าง

การซ่อนปุ่มหรือ redirect ใน client ไม่ใช่ authorization ฝั่ง server API ต้องตรวจ token และสิทธิ์ทุก request

## Biometrics ใช้ตรงไหน

Biometrics ยืนยันว่าผู้ใช้เครื่องผ่านการตรวจของระบบปฏิบัติการ เหมาะกับการปลดล็อก session ที่มีอยู่ ไม่ใช่หลักฐานแทน backend login

```bash
npx expo install expo-local-authentication
```

<Callout type="warning">
  Face ID บน iOS ต้องใช้ Development Build และตั้ง usage description ให้ถูกต้อง ต้องมี fallback เมื่อเครื่องไม่รองรับ ผู้ใช้ยังไม่ลงทะเบียน หรือผู้ใช้กดยกเลิก
</Callout>

## เปลี่ยนจาก Expo Go เป็น Development Build

ตั้งแต่สัปดาห์นี้ Campus Events เริ่มใช้ native configuration ของโปรเจกต์ จึงสร้าง development client ของตัวเองแทนการพึ่ง Expo Go เพียงอย่างเดียว

```bash
npx expo install expo-dev-client
npx eas-cli@latest build:configure
```

สร้างหรือปรับ `eas.json`:

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    }
  }
}
```

สร้าง Development Build สำหรับ Android แล้วติดตั้งจากลิงก์/QR Code ที่ EAS แสดงบน Emulator หรืออุปกรณ์ทดสอบ:

```bash
npx eas-cli@latest build --platform android --profile development
npx expo start --dev-client
```

หลังติดตั้งครั้งแรก ไม่ต้อง build ใหม่เมื่อแก้เฉพาะ TypeScript/JavaScript แต่ต้องสร้าง native build ใหม่เมื่อเพิ่ม native module หรือเปลี่ยน native configuration ที่ binary เดิมไม่มี

## Security checklist เบื้องต้น

- ใช้ HTTPS และไม่ปิด certificate validation
- เก็บ secret ฝั่ง server ไม่ใส่ใน `EXPO_PUBLIC_` variables
- ตรวจ authorization ที่ API
- ลดข้อมูลส่วนบุคคลใน local storage และ log
- ล้าง session เมื่อ logout และกำหนดพฤติกรรมเมื่อ token หมดอายุ
- อัปเดต dependencies อย่างมีเหตุผลและตรวจ advisory

## Lab 8 — Login และ Protected registration

1. สร้าง Login form และเรียก authentication API จำลอง
2. เก็บ token ใน SecureStore
3. Restore session เมื่อเปิดแอป
4. ป้องกัน Event Registration route
5. เพิ่ม logout และจำลอง token หมดอายุ
6. สร้างและเปิดแอปด้วย Development Build
7. ทดลอง biometric unlock เป็นงานต่อยอด

## สิ่งที่ส่ง

- Authentication/authorization flow diagram
- วิดีโอ Login → Register → Restart → Restore → Logout
- Threat checklist อย่างน้อย 6 ข้อ

## Definition of Done

- [ ] ไม่มี token/password ใน source code หรือ log
- [ ] Protected screen ไม่กระพริบให้เห็นก่อนตรวจ session เสร็จ
- [ ] API ตรวจสิทธิ์แม้ client ซ่อนปุ่มแล้ว
- [ ] Logout ล้าง token และ state ที่เกี่ยวข้อง
- [ ] มี fallback เมื่อ biometric ใช้ไม่ได้หรือถูกยกเลิก
- [ ] Development Build เปิดด้วย `npx expo start --dev-client` ได้

## Exit ticket

1. Authentication และ Authorization ต่างกันอย่างไร?
2. เหตุใด Protected route ฝั่ง client จึงไม่พอ?
3. Biometrics ป้องกันภัยคุกคามใดและไม่ป้องกันอะไร?

## อ่านเพิ่ม

- [Expo SecureStore](https://docs.expo.dev/versions/latest/sdk/securestore/)
- [Expo Router: Authentication](https://docs.expo.dev/router/advanced/authentication/)
- [Expo LocalAuthentication](https://docs.expo.dev/versions/latest/sdk/local-authentication/)
