# แผนแก้ไข: ปัญหา "API KEY REQUIRED" บนแผนที่

## 1. วิเคราะห์ปัญหา: ทำไมขึ้น "API KEY REQUIRED"?

หลังจากเปลี่ยนมาใช้ CARTO Voyager URL:
`https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png`

พบว่าแผนที่แสดงลายน้ำ (Watermark) ตัวใหญ่ว่า:
> **"API KEY REQUIRED"**
> `carto.com/basemaps/apikey`

### สาเหตุเชิงเทคนิค:
1. **CARTO ได้ปรับเปลี่ยนนโยบายการให้บริการ Raster Tiles**: บังคับว่าทุก Request ที่เรียกไปยัง `basemaps.cartocdn.com` จะต้องแนบ Query Parameter `?key=YOUR_API_KEY` เสมอ
2. หากไม่มี API Key ส่งไป ระบบ CDN ของ CARTO จะยังคงส่งรูปภาพ Tile ขนาด 256x256 / 512x512 กลับมา (HTTP 200) แต่จะ **ประทับตรายางลายน้ำตัวอักษร "API KEY REQUIRED" ทับลงไปบนภาพทุกแผ่น** (สังเกตได้จาก Header `etag: "wm-..."` ย่อมาจาก Watermarked)

---

## 2. สรุปวิวัฒนาการของปัญหา Map แต่ละตัว

| ตัวเลือก Map | ปัญหาที่พบ | สาเหตุ |
| :--- | :--- | :--- |
| **1. Google Maps (ค่าเริ่มต้น)** | แผนที่มืดดำ มีแต่ Marker แดง | Expo Go บน Android ไม่มี Google Maps API Key ฝังใน Native Manifest |
| **2. OSM หลัก (`tile.openstreetmap.org`)** | Error 403 "Access blocked" | เซิร์ฟเวอร์อาสาสมัครของ OSM Foundation บล็อก Mobile App ที่ไม่มี Custom User-Agent Header |
| **3. CARTO Voyager (ปัจจุบัน)** | มีลายน้ำ "API KEY REQUIRED" | CARTO บังคับใส่ API Key บน URL เสมอ |
| **4. OpenStreetMap Mirrors (ทางแก้ที่แนะนำ)** | **ไม่มีปัญหา (แสดงแผนที่ปกติ)** | ให้บริการข้อมูล OpenStreetMap แท้ 100%, ไม่บล็อก Mobile, ไม่ต้องใช้ API Key และไม่มีลายน้ำ |

---

## 3. ทางเลือกในการแก้ไข (Proposed Solutions)

### ทางเลือกที่ 1 (แนะนำอย่างยิ่ง): สลับไปใช้ OpenStreetMap Mirror ที่ไม่ต้องใช้ API Key
ใช้ Tile Server ของเครือข่าย OpenStreetMap ที่เปิดกว้างสำหรับ Community โดยไม่ต้องใช้ API Key:

- **OSM Standard (German Mirror - FOSSGIS):**
  - URL: `https://tile.openstreetmap.de/{z}/{x}/{y}.png`
  - สไตล์: หน้าตา OpenStreetMap Carto มาตรฐานที่ทุกคนคุ้นเคย
  - **ข้อดี:** เป็น OpenStreetMap แท้ 100%, โหลดเร็ว, ไม่ติด 403, ไม่มีลายน้ำ และ **ไม่ต้องสมัคร API Key ใดๆ เลย**
- **OSM Humanitarian (HOT France Mirror):**
  - URL: `https://a.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png`
  - สไตล์: โทนสีสบายตา เน้นถนนและอาคาร เหมาะกับแอป Campus

### ทางเลือกที่ 2: สมัคร CARTO Free API Key
- สมัครรับคีย์ฟรีที่ [carto.com/basemaps/apikey](https://carto.com/basemaps/apikey)
- นำคีย์มาต่อท้าย URL: `https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png?key=YOUR_KEY`
- ข้อเสีย: ต้องให้ผู้ใช้ไปกดสมัครและจัดการ Environment Variable เพิ่มเติม

---

## 4. รายละเอียดการแก้ไข (Proposed Changes)

เลือกใช้ **ทางเลือกที่ 1 (OpenStreetMap Mirror - `tile.openstreetmap.de`)** เพราะตรงตามความต้องการเดิมที่อยากได้ OpenStreetMap แท้ และทำงานได้ทันทีโดยไม่ต้องตั้งค่า Key

### [MODIFY] [`constants/map.ts`](file:///data/cs/4/hybrid-mobile/campus-events/constants/map.ts)

```diff
 export const OSM_CONFIG = {
-  tileUrl: 'https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png',
-  attribution: '© CARTO, © OpenStreetMap contributors',
+  tileUrl: 'https://tile.openstreetmap.de/{z}/{x}/{y}.png',
+  attribution: '© OpenStreetMap contributors',
   maxZoom: 19,
 };
```

> [!NOTE]
> แก้ไขที่ไฟล์ [`constants/map.ts`](file:///data/cs/4/hybrid-mobile/campus-events/constants/map.ts) เพียงไฟล์เดียว ส่วนประกอบทั้ง 3 หน้า (`EventVenueMap`, `LocationPickerMap`, `AllEventsMapView`) จะอัปเดตอัตโนมัติทันที

---

## 5. การตรวจสอบ (Verification Plan)

### Automated Verification
```bash
npm test
npx tsc --noEmit
```
- ตรวจสอบว่า Unit Test และ Integration Test ทั้ง 27 Test Suites ผ่านทั้งหมด (136/136 tests passed)
- ตรวจสอบว่าไม่มี TypeScript compile errors

### Manual Verification
1. สั่งรันแอป: `npx expo start -c`
2. เปิดหน้า **Events** -> สลับไปที่มุมมองแผนที่ (Map View)
   - สังเกตว่าแผนที่แสดง Tiles ของ OpenStreetMap ได้อย่างชัดเจน สวยงาม
   - **ต้องไม่มีลายน้ำ "API KEY REQUIRED"**
   - **ต้องไม่มีข้อความ "Access blocked"**
3. เข้าหน้ารายละเอียดกิจกรรม (Event Detail) -> ดู `EventVenueMap`
4. แตะปุ่มสร้างกิจกรรม (+) -> ดู `LocationPickerMap` ว่าเลื่อนและปักหมุดได้ตามปกติ
