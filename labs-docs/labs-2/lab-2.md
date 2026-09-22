---
title: "สัปดาห์ 2: Components, Props, State และ Events"
sidebarTitle: "Components, Props และ State"
---

# สัปดาห์ 2: Components, Props, State และ Events

สัปดาห์นี้เปลี่ยนหน้า Profile ให้เป็นชุด Component ที่นำกลับมาใช้ซ้ำได้ และเริ่มสร้าง `EventCard` ซึ่งจะเป็นหน่วยหลักของ Campus Events Mobile

## ผลลัพธ์การเรียนรู้

- อ่านและเขียน TSX ได้ถูกต้อง
- เลือกใช้ `View`, `Text`, `Image`, `Pressable`, `TextInput` และ `FlatList`
- ออกแบบ typed props และแยกข้อมูลออกจากหน้าตา
- ใช้ `useState` กับ event handler โดยไม่แก้ค่า state เดิมโดยตรง
- แยก Component ตามหน้าที่และทดสอบ interaction พื้นฐาน

## TSX และ Core Components

ข้อความต้องอยู่ใน `<Text>` และ layout ใช้ `<View>` แทน HTML element ส่วนปุ่มที่ต้องปรับหน้าตาและ state การกดควรเริ่มจาก `Pressable`

```tsx
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

export type CampusEvent = {
  id: string;
  title: string;
  description: string;
  startsAt: string;
  imageUrl?: string;
  location: {
    name: string;
    latitude: number;
    longitude: number;
  };
};

type EventCardProps = {
  event: CampusEvent;
  isFavorite: boolean;
  onOpen: (id: string) => void;
  onToggleFavorite: (id: string) => void;
};

export function EventCard({
  event,
  isFavorite,
  onOpen,
  onToggleFavorite,
}: EventCardProps) {
  return (
    <Pressable style={styles.card} onPress={() => onOpen(event.id)}>
      {event.imageUrl ? (
        <Image
          source={{ uri: event.imageUrl }}
          style={styles.image}
          accessibilityLabel={`ภาพกิจกรรม ${event.title}`}
        />
      ) : null}
      <View style={styles.body}>
        <Text style={styles.title}>{event.title}</Text>
        <Text>{event.location.name}</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${isFavorite ? 'นำออกจาก' : 'เพิ่มใน'}รายการโปรด`}
          onPress={() => onToggleFavorite(event.id)}
        >
          <Text>{isFavorite ? '★ บันทึกแล้ว' : '☆ บันทึก'}</Text>
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: 'white', borderRadius: 16, overflow: 'hidden' },
  image: { width: '100%', height: 160 },
  body: { padding: 16, gap: 8 },
  title: { fontSize: 18, fontWeight: '700' },
});
```

## Props กับ State ต่างกันอย่างไร

| ข้อมูล | เจ้าของ | ตัวอย่าง |
| --- | --- | --- |
| Props | Component แม่ส่งเข้ามา อ่านอย่างเดียว | `event`, `onOpen` |
| Local state | Component เก็บและเปลี่ยนเอง | ข้อความค้นหา, สถานะเปิด/ปิด |
| Derived value | คำนวณจาก props/state ไม่ต้องเก็บซ้ำ | จำนวน Favorite |

```tsx
const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

function toggleFavorite(id: string) {
  setFavoriteIds((current) =>
    current.includes(id)
      ? current.filter((favoriteId) => favoriteId !== id)
      : [...current, id]
  );
}
```

การใช้ updater function ทำให้ค่าที่คำนวณอ้างอิง state ล่าสุด และการสร้าง array ใหม่ช่วยให้ React ตรวจพบการเปลี่ยนแปลง

## Lab 2 — EventCard ที่นำกลับมาใช้ซ้ำได้

1. สร้าง type `CampusEvent` และ mock events อย่างน้อย 4 รายการ
2. แยก `EventCard.tsx` ออกจาก screen
3. ส่งข้อมูลและ callbacks ผ่าน typed props
4. เพิ่มปุ่ม Favorite และแสดงจำนวนรายการที่บันทึก
5. ทดลองข้อความยาว รูปที่โหลดไม่ได้ และการกดซ้ำ

## สิ่งที่ส่ง

- `types/event.ts`, `data/events.ts` และ `components/EventCard.tsx`
- วิดีโอแสดง Open event และ Toggle favorite
- คำอธิบายสั้น ๆ ว่า state แต่ละตัวควรอยู่ที่ Component ใด

## Definition of Done

- [ ] ไม่มี `any` ที่หลีกเลี่ยงได้
- [ ] Component ไม่แก้ props และไม่ผูกกับ mock data ภายใน
- [ ] รายการใช้ ID เป็น key ไม่ใช้ array index
- [ ] ปุ่มมี label ที่โปรแกรมอ่านหน้าจอเข้าใจได้
- [ ] กด Favorite แล้ว UI สอดคล้องกับ state

## Exit ticket

1. เมื่อใดควรแยก Component?
2. เพราะเหตุใดจึงไม่ควรแก้ array ใน state โดยตรง?
3. Derived value ต่างจาก state ที่ต้องเก็บอย่างไร?

## อ่านเพิ่ม

- [React Native: Core Components](https://reactnative.dev/docs/components-and-apis)
- [React: Passing props](https://react.dev/learn/passing-props-to-a-component)
- [React: State as a snapshot](https://react.dev/learn/state-as-a-snapshot)