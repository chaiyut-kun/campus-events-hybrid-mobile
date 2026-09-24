---
title: "สัปดาห์ 11: Notifications และ Mobile Platform APIs"
sidebarTitle: "Notifications และ Platform APIs"
---

import { Callout } from "nextra/components";

# สัปดาห์ 11: Notifications และ Mobile Platform APIs

สัปดาห์นี้สร้าง Local Event Reminder และเปิด Event detail จาก notification พร้อมทบทวน app lifecycle, deep links, keyboard, safe areas และพฤติกรรมเฉพาะแพลตฟอร์ม

## ผลลัพธ์การเรียนรู้

- แยก local notification และ push notification
- ขอ permission และตั้ง Android notification channel
- schedule/cancel Event reminder
- เปิด dynamic route จาก notification payload อย่างปลอดภัย
- จัดการ foreground/background response และ app lifecycle

## Local กับ Push notification

| ประเภท | ผู้กำหนดเวลา | ตัวอย่าง |
| --- | --- | --- |
| Local | แอปบนเครื่อง | เตือนก่อนกิจกรรม 30 นาที |
| Push | Server ผ่าน push service | แจ้งเปลี่ยนสถานที่กิจกรรม |

Lab ใช้ Local notification เพื่อโฟกัส scheduling และ deep link โดยไม่ต้องมี push backend

## ติดตั้งและตั้งค่า

```bash
npx expo install expo-notifications
```

Notifications บางความสามารถต้องใช้ Development Build และอุปกรณ์จริง ตรวจข้อจำกัดของ Expo SDK และแพลตฟอร์มก่อนทดสอบ

กำหนดพฤติกรรมเมื่อ Local notification มาถึงขณะแอปอยู่ foreground มิฉะนั้นระบบอาจไม่แสดง banner ให้ผู้ใช้แตะ:

```tsx
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});
```

ขอ permission เมื่อผู้ใช้กด “ตั้งการแจ้งเตือน” และสร้าง Android channel ก่อนเปิด permission prompt:

```tsx
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

const REMINDER_CHANNEL = 'event-reminders';

export async function ensureNotificationPermission(): Promise<boolean> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(REMINDER_CHANNEL, {
      name: 'การเตือนกิจกรรม',
      importance: Notifications.AndroidImportance.HIGH,
    });
  }

  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;

  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted;
}
```

## ตั้ง Event reminder

```tsx
import * as Notifications from 'expo-notifications';

export async function scheduleEventReminder(event: CampusEvent) {
  const granted = await ensureNotificationPermission();
  if (!granted) throw new Error('notification-permission-denied');

  const triggerDate = new Date(new Date(event.startsAt).getTime() - 30 * 60 * 1000);
  if (triggerDate <= new Date()) throw new Error('reminder-time-has-passed');

  return Notifications.scheduleNotificationAsync({
    content: {
      title: `ใกล้ถึงเวลา: ${event.title}`,
      body: `เริ่มในอีก 30 นาทีที่ ${event.location.name}`,
      data: { eventId: event.id },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: triggerDate,
      channelId: REMINDER_CHANNEL,
    },
  });
}
```

เก็บ notification identifier คู่กับ event ID เพื่อยกเลิกหรือเปลี่ยนเวลาได้

## เปิด Event detail จาก Notification

วาง observer ใน Root Layout เพื่อให้ทำงานทั้งตอนแอปเปิดอยู่ กลับจาก background และ cold start:

```tsx
function openEventFromResponse(
  response: Notifications.NotificationResponse | null
) {
  if (
    response &&
    response.actionIdentifier !== Notifications.DEFAULT_ACTION_IDENTIFIER
  ) {
    return;
  }

  const eventId = response?.notification.request.content.data.eventId;
  if (typeof eventId !== 'string') return;

  router.push({ pathname: '/events/[id]', params: { id: eventId } });
}

useEffect(() => {
  // รองรับ cold start: อ่าน notification ที่ใช้เปิดแอป
  const initialResponse = Notifications.getLastNotificationResponse();
  if (initialResponse) {
    openEventFromResponse(initialResponse);
    Notifications.clearLastNotificationResponse();
  }

  // รองรับตอนแอปกำลังทำงานหรืออยู่ background
  const subscription = Notifications.addNotificationResponseReceivedListener(
    (response) => openEventFromResponse(response)
  );

  return () => subscription.remove();
}, []);
```

หาก Event ถูกลบ ให้หน้า `/events/[id]` แสดง Not found state หากผู้ใช้ยังไม่ Login ให้ Protected route พาไป Login แล้วค่อยกลับสู่ intent เดิมตามนโยบายของแอป

<Callout type="warning">
  ข้อมูลใน notification payload ไม่ใช่แหล่งข้อมูลที่เชื่อถือได้ ใช้เพียง ID แล้วตรวจสิทธิ์/โหลดข้อมูลล่าสุดจาก repository หรือ API
</Callout>

## Platform behavior review

- Keyboard ไม่ควรบัง input หรือปุ่ม submit
- Safe area ต้องครอบคลุม custom header/bottom action
- ตรวจ `AppState` เมื่อต้อง refresh permission หรือข้อมูลหลังกลับจาก Settings
- Android ต้องใช้ notification channel ตามระดับความสำคัญ
- เวลาใน notification ต้องคำนึงถึง timezone และเปลี่ยนแปลงของ event

## Lab 11 — Local Event Reminder

1. เพิ่มปุ่มเตือนก่อนกิจกรรม 30 นาที
2. ขอ notification permission เมื่อผู้ใช้กดตั้งเตือน
3. สร้าง Android notification channel
4. เก็บ/cancel reminder ID
5. เปิด `/events/[id]` เมื่อแตะ notification
6. ทดสอบ foreground, background และ cold start

## สิ่งที่ส่ง

- Notification lifecycle diagram
- วิดีโอ schedule → receive → open detail
- ตารางทดสอบ app states และ invalid event ID

## Definition of Done

- [ ] ขอ permission เมื่อผู้ใช้เริ่มตั้งเตือน
- [ ] ตั้งและยกเลิก reminder ได้
- [ ] Notification payload ไม่มีข้อมูลอ่อนไหว
- [ ] Deep link validate `eventId`
- [ ] Cold start และ event not found มี fallback
- [ ] Android reminder ใช้ channel ที่ตั้งชื่อสื่อความหมาย

## Exit ticket

1. Local และ Push notification ต่างกันตรงใด?
2. เพราะเหตุใด payload ควรเก็บ ID แทน event object?
3. App lifecycle มีผลต่อ deep link handler อย่างไร?

## อ่านเพิ่ม

- [Expo Notifications](https://docs.expo.dev/versions/latest/sdk/notifications/)
- [Expo: Push notifications overview](https://docs.expo.dev/push-notifications/overview/)
- [React Native: AppState](https://reactnative.dev/docs/appstate)