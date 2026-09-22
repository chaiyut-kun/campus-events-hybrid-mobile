---
title: "สัปดาห์ 3: Styling และ Responsive Mobile UI"
sidebarTitle: "Styling และ Responsive UI"
---

import { Callout } from "nextra/components";

# สัปดาห์ 3: Styling และ Responsive Mobile UI

เป้าหมายคือทำ Event list ที่อ่านง่ายบนหลายขนาดหน้าจอ ใช้งานได้เมื่อข้อมูลกำลังโหลด ไม่มีข้อมูล หรือเกิดข้อผิดพลาด และไม่ละเลย Safe area กับ Accessibility

## ผลลัพธ์การเรียนรู้

- ใช้ `StyleSheet`, Flexbox, spacing และ visual hierarchy
- ออกแบบ responsive layout ด้วยพื้นที่ที่มีอยู่ ไม่ยึดกับขนาดเครื่องเดียว
- เลือก `FlatList` แทน `ScrollView` สำหรับรายการข้อมูล
- สร้าง Loading, Empty และ Error UI ที่ผู้ใช้ดำเนินการต่อได้
- รองรับ Safe area, dynamic text และ touch target

## StyleSheet และ Flexbox

React Native ใช้ style object แบบ camelCase และมี `flexDirection: 'column'` เป็นค่าเริ่มต้น หลีกเลี่ยงการคำนวณจาก `Dimensions.get()` ไว้นอก Component เพราะค่าอาจไม่อัปเดตเมื่อหน้าจอเปลี่ยนขนาด ให้ใช้ `useWindowDimensions()` เมื่อจำเป็น

```tsx
import { StyleSheet, useWindowDimensions, View } from 'react-native';

export function EventGrid({ children }: { children: React.ReactNode }) {
  const { width } = useWindowDimensions();
  const columns = width >= 720 ? 2 : 1;

  return <View style={[styles.grid, { gap: columns === 2 ? 20 : 12 }]}>{children}</View>;
}

const styles = StyleSheet.create({
  grid: { padding: 16 },
});
```

สำหรับ `FlatList` ให้คำนวณ `numColumns` จากขนาดหน้าจอและเปลี่ยน `key` เมื่อจำนวนคอลัมน์เปลี่ยน เพื่อให้ list สร้าง layout ใหม่อย่างถูกต้อง

## สถานะของหน้ารายการ

```tsx
type EventListState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; events: CampusEvent[] };
```

| State | UI ที่ควรมี |
| --- | --- |
| Loading | Progress indicator หรือ skeleton พร้อมข้อความ |
| Empty | เหตุผลที่อาจไม่มีข้อมูลและปุ่มล้าง filter |
| Error | ข้อความที่เข้าใจง่ายและปุ่ม Retry |
| Ready | รายการพร้อม feedback เมื่อ refresh |

<Callout type="warning">
  อย่าใช้ข้อความสีแดงเพียงอย่างเดียวเพื่อสื่อ Error ควรมีข้อความ ไอคอน หรือ action ที่ชัดเจน และประกาศสถานะสำคัญให้ screen reader
</Callout>

## FlatList ที่พร้อมใช้งานจริง

```tsx
<FlatList
  data={events}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => (
    <EventCard
      event={item}
      isFavorite={favoriteIds.includes(item.id)}
      onOpen={openEvent}
      onToggleFavorite={toggleFavorite}
    />
  )}
  contentContainerStyle={events.length === 0 ? styles.emptyList : styles.list}
  ListEmptyComponent={
    <EmptyState
      title="ไม่พบกิจกรรม"
      actionLabel="ล้างตัวกรอง"
      onAction={clearFilters}
    />
  }
  ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
/>
```

## Safe area และ Accessibility

ติดตั้งและใช้ `SafeAreaView` จาก `react-native-safe-area-context` ซึ่งทำงานร่วมกับ Expo Router ได้ดี ตรวจอย่างน้อย:

- ปุ่มสำคัญมีพื้นที่แตะประมาณ 44×44 points ขึ้นไป
- ข้อความยังอ่านได้เมื่อเพิ่มขนาด font ของระบบ
- `accessibilityRole`, `accessibilityLabel` และ `accessibilityHint` สื่อความหมาย
- สีตัวอักษรกับพื้นหลังมี contrast เพียงพอ
- Focus order สอดคล้องกับลำดับที่มองเห็น

## Lab 3 — Responsive Event list

1. แสดง mock events ด้วย `FlatList`
2. ปรับ `EventCard` สำหรับหน้าจอแคบและ tablet
3. เพิ่ม Loading, Empty และ Error states
4. เพิ่ม Safe area และตรวจ touch target
5. ทดสอบข้อความยาวและ font scale อย่างน้อย 150%

## สิ่งที่ส่ง

- ภาพหน้าจอสองขนาดและทั้ง Ready/Empty/Error
- Accessibility checklist พร้อมสิ่งที่แก้ไข
- Component `EventListState` หรือโครงสร้าง state ที่เทียบเท่า

## Definition of Done

- [ ] รายการใช้ `FlatList` และ stable key
- [ ] ไม่มีข้อความหรือปุ่มล้นหน้าจอที่ทดสอบ
- [ ] Empty/Error state มี action ที่เหมาะสม
- [ ] เนื้อหาไม่ทับ notch, status bar หรือ home indicator
- [ ] ใช้งานปุ่มหลักด้วย screen reader label ได้

## Exit ticket

1. `ScrollView` และ `FlatList` ต่างกันอย่างไรเมื่อข้อมูลมากขึ้น?
2. เพราะเหตุใด responsive mobile UI จึงไม่ควรอิงความกว้างคงที่?
3. Error state ที่ดีช่วยให้ผู้ใช้ฟื้นตัวอย่างไร?

## อ่านเพิ่ม

- [React Native: Style](https://reactnative.dev/docs/style)
- [React Native: Flexbox](https://reactnative.dev/docs/flexbox)
- [React Native: Accessibility](https://reactnative.dev/docs/accessibility)