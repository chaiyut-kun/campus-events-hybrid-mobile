---
title: "สัปดาห์ 5: Forms และ State Management"
sidebarTitle: "Forms และ State Management"
---

import { Callout } from "nextra/components";

# สัปดาห์ 5: Forms และ State Management

สัปดาห์นี้เพิ่ม Search, Favorite state และฟอร์มลงทะเบียนกิจกรรม โดยเลือกตำแหน่งของ state ตามขอบเขตการใช้งาน ไม่เริ่มจาก global state ทุกอย่าง

## ผลลัพธ์การเรียนรู้

- สร้าง controlled inputs และจัดการ keyboard
- validate ข้อมูลและแสดง error ใกล้ field
- เลือก `useState`, `useReducer`, Context และ custom hook ได้เหมาะสม
- แยก server state, app state, form state และ derived state
- ป้องกัน submit ซ้ำและรักษาข้อมูลเมื่อเกิดข้อผิดพลาด

## State ควรอยู่ที่ใด

| ประเภท | ตัวอย่าง | ตำแหน่งที่เหมาะสม |
| --- | --- | --- |
| Local UI | search text, modal เปิด/ปิด | `useState` ใน screen/component |
| Complex transition | registration form หลายสถานะ | `useReducer` |
| Shared app state | favorite IDs, session | Context + custom hook |
| Server state | events จาก API | service/query hook และ cache |
| Derived state | filtered events, count | คำนวณระหว่าง render หรือ `useMemo` เมื่อจำเป็น |

## Controlled form

```tsx
type RegistrationForm = {
  fullName: string;
  email: string;
};

const [form, setForm] = useState<RegistrationForm>({
  fullName: '',
  email: '',
});

const errors = {
  fullName: form.fullName.trim() ? '' : 'กรุณากรอกชื่อ',
  email: /^\S+@\S+\.\S+$/.test(form.email) ? '' : 'อีเมลไม่ถูกต้อง',
};

<TextInput
  value={form.email}
  onChangeText={(email) => setForm((current) => ({ ...current, email }))}
  keyboardType="email-address"
  autoCapitalize="none"
  accessibilityLabel="อีเมล"
/>
```

Validation ฝั่งแอปช่วย UX แต่ไม่แทน validation ฝั่ง API เพราะข้อมูลสามารถถูกส่งจาก client อื่นได้

## Reducer สำหรับ Favorite

```tsx
type FavoriteAction =
  | { type: 'hydrate'; ids: string[] }
  | { type: 'toggle'; id: string }
  | { type: 'clear' };

function favoriteReducer(state: string[], action: FavoriteAction): string[] {
  switch (action.type) {
    case 'hydrate':
      return action.ids;
    case 'toggle':
      return state.includes(action.id)
        ? state.filter((id) => id !== action.id)
        : [...state, action.id];
    case 'clear':
      return [];
  }
}
```

Discriminated union ทำให้ TypeScript ตรวจว่าทุก action มีข้อมูลที่ถูกต้อง และง่ายต่อการทดสอบในสัปดาห์ 13

## Custom Hook และ Context

สร้าง `FavoritesProvider` ใกล้ route group ที่ต้องใช้ และเปิด API ผ่าน `useFavorites()` ไม่ให้ screen เข้าถึง Context ดิบ เพื่อง่ายต่อการเปลี่ยน implementation และแสดง error เมื่อ Provider หาย

<Callout type="warning">
  อย่าใส่ทุก state ไว้ใน Context เดียว เพราะทุก consumer อาจ render ใหม่พร้อมกัน แบ่ง Context ตามข้อมูลและความถี่การเปลี่ยน
</Callout>

## Lab 5 — Search, Favorite และ Registration

1. เพิ่มช่องค้นหาที่กรองชื่อ/สถานที่โดยไม่เก็บ filtered array ซ้ำ
2. ย้าย Favorite state ไป `FavoritesProvider`
3. สร้างฟอร์มลงทะเบียนกิจกรรมพร้อม validation
4. เพิ่ม `KeyboardAvoidingView`, focus flow และสถานะ submitting
5. ป้องกันการกดส่งซ้ำ

### แบบฝึกเสริม Todo App

ใช้ [Todo workshop](/react_native/workshop) เป็นแบบฝึกสั้น 30–45 นาทีเพื่อทบทวน `useState`, custom hook และ reducer ไม่ใช่โปรเจกต์ใหม่ประจำสัปดาห์

## สิ่งที่ส่ง

- State ownership diagram
- Search, Favorite และ Registration form ที่ใช้งานได้
- Reducer/custom hook พร้อมตัวอย่าง input/output

## Definition of Done

- [ ] ไม่มี derived state ที่เก็บซ้ำโดยไม่จำเป็น
- [ ] Error แสดงใกล้ field และ screen reader อ่านได้
- [ ] Submit ไม่ทำงานเมื่อข้อมูลไม่ผ่าน validation
- [ ] Form รักษาค่าที่กรอกเมื่อส่งไม่สำเร็จ
- [ ] Screen ไม่มี logic การจัดเก็บข้อมูลถาวร

## Exit ticket

1. เมื่อใด `useReducer` อ่านง่ายกว่า `useState` หลายตัว?
2. เพราะเหตุใด client validation จึงไม่เพียงพอด้านความปลอดภัย?
3. ข้อมูลใดไม่ควรอยู่ใน Context?

## อ่านเพิ่ม

- [React: Choosing state structure](https://react.dev/learn/choosing-the-state-structure)
- [React: Scaling up with reducer and context](https://react.dev/learn/scaling-up-with-reducer-and-context)
- [React Native: TextInput](https://reactnative.dev/docs/textinput)