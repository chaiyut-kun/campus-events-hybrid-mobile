# Campus Events Mobile — Lab 1, Lab 2 & Lab 3

Mobile application built with **React Native**, **Expo SDK 57**, and **Expo Router** following the **Aura Mobile** design system.

---

## 📱 Features

### Lab 1: Setup & Profile Screen
- **Home Screen (`/`)**: Minimal clean landing page with brand header (`DevFolio`), avatar button, and burger menu.
- **Profile Screen (`/profile`)**:
  - Hero header with lavender wash, "Active Student" badge, and circular avatar with 3px white halo & verified checkmark.
  - Student identity (Chaiyut Tavon, Computer and Information Science, Student ID, Year/Semester).
  - GitHub profile card with direct link action (`chaiyut-kun`).
  - Enrolled subject card (`IN405109 - Hybrid Mobile Application Programming`).
  - Interested topics with emoji badges (Programming, Software Engineering, Networking, Badminton, Football).
  - Preferences (Dark Mode toggle UI & Settings).

### Lab 2: Components, Props, State & Events
- **Events Screen (`/events`)**:
  - Reusable, decoupled `<EventCard />` component driven by strictly typed props (`CampusEvent`, `isFavorite`, `onOpen`, `onToggleFavorite`).
  - Graceful image fallback placeholder banner for events missing images or network load failures.
  - Interactive Favorite toggling backed by immutable array state updates.
  - Derived values: Active saved count badge (`favoriteIds.length`) without duplicated state.
  - Filter tabs: Toggle between `All Events` and `Saved` events with empty state feedback.
  - Detailed Event Modal triggered by card press (`onOpen`), displaying venue coordinates, schedule, and category.
- **Navigation**: 3 Bottom Tabs (`Home | Events | Profile`) + Floating Burger Navigation Menu dropdown in headers.

### Lab 3: Styling & Responsive Mobile UI
- **Responsive Grid Layout**:
  - Dynamically calculates viewport width via `useWindowDimensions()`.
  - Seamlessly renders 1 column on phone viewports (`width < 720`) and 2 columns on tablet / wide viewports (`width >= 720`).
  - FlatList binds `key={`events-grid-${numColumns}`}` to properly reconstruct the layout on orientation change.
- **State Machine Architecture (`EventListState`)**:
  - Discriminated union type handling 4 distinct lifecycle states:
    - **Loading State (`<LoadingState />`)**: ActivityIndicator with accessible progress role.
    - **Empty State (`<EmptyState />`)**: Contextual empty icon, explanation, and filter reset action.
    - **Error State (`<ErrorState />`)**: Human-readable error message with accessible alert role and "ลองใหม่อีกครั้ง" (Retry action).
    - **Ready State**: Virtualized FlatList with **Pull-to-Refresh** (`RefreshControl`).
- **Safe Area & Accessibility (A11y)**:
  - Touch targets calibrated to at least **44×44 points** (e.g., Favorite buttons with `minHeight: 44` and `hitSlop`).
  - Safe Area padding prevents clipping against Notches, Status bars, and Home indicators.
  - Font scale and text-wrapping resilience across all cards and modal sheets.
- **Automated Testing Suite**: 29 tests across 7 suites covering models, state components, responsive layout, and user flows.

---

## 🛠️ Tech Stack & Baseline

| Item | Specification |
| --- | --- |
| Framework | React Native (0.86.3) via Expo (SDK 57) |
| Language | TypeScript (Strict mode) |
| Navigation | Expo Router (File-based routing) |
| UI Design System | Aura Mobile (`constants/theme.ts`) |
| Testing | Jest + `jest-expo` + `@testing-library/react-native` |

---

## 🚀 Getting Started

### Prerequisites
- Node.js LTS (v20+ or v22+)
- npm
- Expo Go app on mobile device or Android/iOS Emulator

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd campus-events

# Install dependencies
npm install --legacy-peer-deps
```

### Running the App

```bash
# Start the Expo development server
npx expo start

# Run on Android Emulator
npx expo start --android

# Run on iOS Simulator
npx expo start --ios

# Run on Web
npx expo start --web
```

---

## 🧪 Running Tests & Quality Checks

```bash
# Run Unit and Integration tests
npm test

# Run TypeScript typecheck
npx tsc --noEmit
```

---

## 📁 Project Structure

```text
campus-events/
├── __tests__/
│   ├── unit/
│   │   ├── profile.test.ts          # Unit tests for profile data models
│   │   └── events.test.ts           # Unit tests for event data & toggle helper
│   └── integration/
│       ├── HomeScreen.test.tsx      # Integration tests for Home screen & menu
│       ├── ProfileScreen.test.tsx   # Integration tests for Profile screen
│       ├── EventCard.test.tsx       # Component tests for reusable EventCard
│       ├── EventsScreen.test.tsx    # Integration tests for Events screen, filters & grid
│       └── StateComponents.test.tsx # Component tests for Loading, Error, Empty states
├── app/
│   ├── _layout.tsx                  # Root Stack layout
│   └── (tabs)/
│       ├── _layout.tsx              # Bottom Tab navigator (Home, Events, Profile)
│       ├── index.tsx                # Home screen
│       ├── events.tsx               # Events screen with responsive grid & states
│       └── profile.tsx              # Profile screen
├── assets/
│   └── lab1/
│       ├── me.jpeg                  # Profile image
│       └── github.png               # GitHub icon
├── components/
│   ├── EventCard.tsx                # Reusable event card with >= 44x44 touch target
│   ├── BurgerMenuModal.tsx          # Floating navigation dropdown modal
│   ├── LoadingState.tsx             # Loading indicator state component
│   ├── ErrorState.tsx               # Error alert with retry action
│   └── EmptyState.tsx               # Empty filter feedback with reset action
├── constants/
│   └── theme.ts                     # Aura Mobile design tokens
├── data/
│   ├── profile.ts                   # Typed student profile data
│   └── events.ts                    # Mock campus events & toggle helper
├── types/
│   └── event.ts                     # CampusEvent, Location, & EventListState types
├── jest.setup.js                    # Jest setup & vector icon mocks
├── app.json                         # Expo configuration
├── package.json
└── tsconfig.json
```

---

## 📝 Lab 1 — Exit Ticket

1. **React Native ต่างจากเว็บใน WebView อย่างไร?**
   - React Native คอมไพล์และบริดจ์คำสั่งไปเรนเดอร์เป็น Native UI Components ของระบบปฏิบัติการจริง (เช่น `UIView` บน iOS หรือ `android.view.View` บน Android) ทำให้ได้ประสิทธิภาพ ความลื่นไหล และ Look & Feel ที่เป็น Native แท้ ไม่ใช่การโหลดหน้าเว็บ HTML/CSS/DOM มาแสดงผลภายในเบราว์เซอร์เสมือนเหมือน WebView
2. **Expo Go และ Development Build มี trade-off ต่างกันอย่างไร?**
   - **Expo Go:** สะดวกและรวดเร็วสำหรับการเรียนรู้และ Prototyping ไม่ต้องลง Xcode/Android Studio แต่ถูกจำกัดให้ใช้เฉพาะ Native Modules ที่ Bundle มาพร้อมกับ Expo Go เท่านั้น
   - **Development Build:** สามารถปรับแต่ง Native Code, Config Plugins, และเชื่อมต่อ Third-party SDKs ที่ต้องใช้ Native Code พิเศษได้ตามต้องการ แต่ต้องเสียเวลา Build Client เอง
3. **TypeScript ช่วยลดข้อผิดพลาดของข้อมูลกิจกรรมได้อย่างไร?**
   - TypeScript ช่วยกำหนด Type Schema (เช่น `StudentProfile`, `Subject`, `Interest`) และตรวจสอบความถูกต้องตั้งแต่ช่วง Compile time (Static Analysis) ป้องกันข้อผิดพลาดประเภท Typo, Missing Required Fields, หรือ Type Mismatch เช่น การส่งข้อมูลวันที่หรือตัวเลขผิดประเภทก่อนที่แอปจะรันจริง

---

## 📝 Lab 2 — Exit Ticket

1. **เมื่อใดควรแยก Component?**
   - เมื่อ UI หรือ Logic นั้นถูกนำมาใช้ซ้ำในหลายจุด (Reusability) เช่น `EventCard`
   - เมื่อ Component เดิมมีขนาดใหญ่หรือรับผิดชอบหลายหน้าที่เกินไป เพื่อให้โค้ดอ่านง่ายและดูแลรักษาได้ตามหลัก Single Responsibility
   - เมื่อต้องการแยกขอบเขต State ให้ทำงานเฉพาะส่วน เพื่อป้องกันไม่ให้ Component แม่ Re-render ทั้งหมดโดยไม่จำเป็น
2. **เพราะเหตุใดจึงไม่ควรแก้ array ใน state โดยตรง?**
   - ใน React การตรวจจับการเปลี่ยนแปลงของ State ใช้การเปรียบเทียบเชิงอ้างอิง (Reference Equality / `Object.is`) หากเรา Mutate อาเรย์เดิม (เช่น `arr.push()` หรือ `arr.splice()`) ตัวชี้หน่วยความจำ (Reference) ยังคงเป็นตัวเดิม ทำให้ React คิดว่าไม่มีการเปลี่ยนแปลงและไม่ทำการ Re-render หน้าจอ อีกทั้งยังขัดต่อหลักการ Immutability ที่จำเป็นต่อการทำ Time-travel debugging และ Concurrent features ใน React
3. **Derived value ต่างจาก state ที่ต้องเก็บอย่างไร?**
   - **State ที่ต้องเก็บ:** คือข้อมูลต้นทาง (Source of Truth) ที่เปลี่ยนแปลงตามเวลาและไม่สามารถคำนวณจากค่าอื่นได้ เช่น `favoriteIds: string[]`
   - **Derived Value:** คือค่าที่สามารถคำนวณหรือกรองได้จาก State หรือ Props ที่มีอยู่แล้ว เช่น จำนวนกิจกรรมที่บันทึก (`favoriteIds.length`) หรือรายการกิจกรรมที่ถูกบันทึก (`events.filter(...)`) ซึ่งไม่ควรเก็บเป็น State ซ้ำซ้อน เพื่อป้องกันปัญหาข้อมูลไม่ตรงกัน (Out of sync)

---

## 📝 Lab 3 — Exit Ticket

1. **`ScrollView` และ `FlatList` ต่างกันอย่างไรเมื่อข้อมูลมากขึ้น?**
   - `ScrollView` เรนเดอร์ child components ทั้งหมดลงในหน่วยความจำทันทีตั้งแต่เริ่มต้น แม้ว่ารายการเหล่านั้นจะยังอยู่นอกจอ (Off-screen) ทำให้เมื่อจำนวนข้อมูลมากขึ้นเรื่อย ๆ จะทำให้เปลือง RAM สูงมากจนแอปกระตุกหรือ Crash ได้
   - `FlatList` ใช้ระบบ Virtualization / Windowing โดยจะสร้างและเรนเดอร์เฉพาะไอเทมที่กำลังมองเห็นบนหน้าจอและบัฟเฟอร์ใกล้เคียงเท่านั้น พร้อมทั้ง Recycle มุมมองที่เลื่อนพ้นจอไปแล้ว ทำให้ใช้ Memory คงที่และเลื่อนดูข้อมูลได้ลื่นไหลแม้มีข้อมูลหลายร้อยหรือหลายพันรายการ
2. **เพราะเหตุใด responsive mobile UI จึงไม่ควรอิงความกว้างคงที่?**
   - อุปกรณ์พกพามีความหลากหลายอย่างมาก ทั้งขนาดหน้าจอ (โทรศัพท์ขนาดกะทัดรัด, Phablet, แท็บเล็ต, หน้าจอพับได้), การหมุนจอ (แนวตั้ง/แนวนอน), และการแบ่งหน้าจอ (Split-Screen / Multitasking) การกำหนดขนาดความกว้างคงที่ (เช่น `width: 375`) จะทำให้เนื้อหาตกขอบหรือล้นจอในหน้าจอเล็ก และเหลือพื้นที่ว่างเปล่ามหาศาลบนแท็บเล็ต การใช้ Flexbox, Relative sizing และ `useWindowDimensions()` ช่วยให้ UI ปรับเปลี่ยนตามพื้นที่ว่างจริงได้อย่างยืดหยุ่นและสวยงาม
3. **Error state ที่ดีช่วยให้ผู้ใช้ฟื้นตัวอย่างไร?**
   - แจ้งเตือนด้วยข้อความที่ชัดเจน เข้าใจง่าย ไม่ใช้ศัพท์เทคนิคที่สับสน
   - ไม่ใช้สีแดงเพียงอย่างเดียวในการสื่อความหมาย โดยมีไอคอนเตือนและข้อความบรรยายที่โปรแกรมอ่านหน้าจอ (Screen Reader) เข้าใจได้
   - มี Action หรือทางออกที่ชัดเจน เช่น ปุ่ม "ลองใหม่อีกครั้ง" (Retry button) หรือตัวเลือกกลับสู่หน้าหลัก เพื่อให้ผู้ใช้สามารถกู้คืนระบบกลับสู่สภาวะปกติได้ทันทีโดยไม่ต้องปิดหรือรีสตาร์ตแอป

---

## 🚀 Lab 5 — Forms และ State Management

### ภาพรวมสถาปัตยกรรมการจัดการ State

ใน Lab 5 มีการจัดสรร State ออกเป็น 4 ขอบเขตอย่างชัดเจน เพื่อป้องกันปัญหา Re-render พร่ำเพรื่อ และหลีกเลี่ยงการเก็บ Derived State ซ้ำซ้อน:

| ขอบเขต State | รายการข้อมูล | กลไกที่เลือกใช้ | วัตถุประสงค์ |
| --- | --- | --- | --- |
| **Shared App State** | `favoriteIds: string[]` | `FavoritesContext` + `favoriteReducer` (`hydrate`, `toggle`, `clear`) + `useFavorites()` hook | แชร์สถานะรายการโปรดและเคาน์เตอร์ข้ามหน้าจอ (Events, Profile, Home) |
| **Local UI State** | `searchQuery`, `filter`, `modalVisible` | `useState` ภายในหน้าจอ/คอมโพเนนต์ | การเปิด/ปิด Modal หรือข้อความค้นหาที่ใช้เฉพาะหน้านั้น ๆ |
| **Form State** | `RegistrationForm`, `fieldErrors`, `isSubmitting` | `useState` + `formRef` ภายใน `EventRegistrationModal` | วงจรชั่วคราวในการกรอกฟอร์ม ตรวจสอบความถูกต้อง และรีเซ็ตเมื่อปิด Modal |
| **Derived State** | `filteredEvents`, `savedCount` | คำนวณระหว่าง Render หรือผ่าน `useMemo` | หลีกเลี่ยงการเก็บ State ซ้ำซ้อน คำนวณตามเงื่อนไขค้นหาและแท็บ |

### ฟีเจอร์ที่พัฒนาใน Lab 5
1. **Live Search Bar (`components/SearchBar.tsx`):** กรองกิจกรรมตามชื่อ, สถานที่, และหมวดหมู่แบบ Real-time โดยคำนวณผ่าน Derived State
2. **Favorites Context & Reducer (`context/FavoritesContext.tsx`):** ย้าย Favorite state จาก local screen ไปสู่ Global Context ที่จัดการด้วย pure reducer function
3. **Controlled Registration Modal (`components/EventRegistrationModal.tsx`):**
   - Pre-fill ข้อมูลนักศึกษาจาก Profile (ชื่อ, รหัสนักศึกษา, คณะ)
   - ตรวจสอบความถูกต้องของข้อมูล (Validation) และแสดงข้อความเตือนสีแดงใกล้ฟิลด์ที่ผิดพลาด พร้อม Accessibility alert
   - ป้องกันการกดส่งซ้ำ (Double Submit Lockout) ด้วยสถานะ `isSubmitting`
   - รองรับ Keyboard UX ด้วย `KeyboardAvoidingView` และ `returnKeyType` focus navigation
   - แสดง Success confirmation screen ภายใน Modal เมื่อลงทะเบียนสำเร็จ

---

## 📝 Lab 5 — Exit Ticket

1. **เมื่อใด `useReducer` อ่านง่ายกว่า `useState` หลายตัว?**
   - เมื่อ State มีโครงสร้างที่ซับซ้อน หรือมี State หลายตัวที่มีความสัมพันธ์และต้องเปลี่ยนแปลงพร้อมกันในจังหวะเดียว (Multiple related state transitions)
   - เมื่อต้องการแยก Logic การแปลง State (State transitions) ออกจาก Component เพื่อทำให้อ่านง่าย เป็นระเบียบ และสามารถเขียน Unit Test ทดสอบ Pure Reducer Function ได้อย่างอิสระโดยไม่ต้อง Render Component
   - เมื่อมี Action หลายรูปแบบที่มากระทำกับ State ชุดเดียวกัน (เช่น `hydrate`, `toggle`, `clear`) การใช้ Discriminated Union ร่วมกับ Reducer จะช่วยให้ TypeScript ตรวจสอบความถูกต้องของ Action payload ได้อย่างรัดกุม
2. **เพราะเหตุใด client validation จึงไม่เพียงพอด้านความปลอดภัย?**
   - Client-side validation ถูกสร้างขึ้นเพื่อจุดประสงค์ด้าน **User Experience (UX)** เป็นหลัก เพื่อให้ผู้ใช้ได้รับ Feedback รวดเร็วและแก้ไขข้อผิดพลาดได้ทันที
   - แต่ Client-side validation ไม่สามารถป้องกันการโจมตีหรือข้อมูลผิดปกติได้จริง เนื่องจากผู้โจมตีหรือผู้ไม่ประสงค์ดีสามารถ Bypass หน้าแอปแล้วยิง HTTP Request เข้าสู่ Server / API ได้โดยตรงผ่านเครื่องมือ เช่น Postman, cURL หรือ Script จึงจำเป็นต้องมี Server-side Validation เป็นด่านตรวจสอบความถูกต้องและความปลอดภัยขั้นสุดท้ายเสมอ
3. **ข้อมูลใดไม่ควรอยู่ใน Context?**
   - **ข้อมูลที่มีการเปลี่ยนแปลงบ่อยมาก (High-frequency changing state):** เช่น พิกัดการเลื่อนหน้าจอ (Scroll position), ตำแหน่งนิ้ว Gesture, การพิมพ์ตัวอักษรทุกตัวใน Input ฟอร์ม เพราะการอัปเดต Context จะทำให้ Consumer Components ทั้งหมด Re-render ใหม่พร้อมกัน ส่งผลกระทบต่อ Performance อย่างรุนแรง
   - **ข้อมูลที่เป็น Local State หรือใช้เฉพาะในคอมโพเนนต์เดียว:** เช่น สถานะการเปิด/ปิด Dropdown, Modal flag ของหน้านั้น ๆ
   - **Derived State:** ข้อมูลที่สามารถคำนวณได้จาก State อื่นอยู่แล้ว ไม่ควรนำมาเก็บซ้ำใน Context

---

## 📸 Lab 9 — Camera, Image Picker และ Permissions

### ฟีเจอร์ที่พัฒนาใน Lab 9
1. **Just-In-Time Permissions Lifecycle:**
   - ขอสิทธิ์กล้อง (`expo-camera`) หรือคลังภาพ (`expo-image-picker`) เฉพาะเมื่อผู้ใช้เลือกกดฟังก์ชันนั้นจริง ๆ
   - จัดการกรณี `granted`, `denied`, และกรณีถูกปฏิเสธถาวร (`canAskAgain: false`) โดยแสดง Native `Alert.alert` พร้อมปุ่ม "เปิดการตั้งค่า" (`Linking.openSettings()`) ตามแนวทาง Mobile HIG
2. **Custom Image Picker Action Sheet (`components/ImagePickerActionSheet.tsx`):**
   - เมนูเลือกแหล่งที่มาของรูปภาพ (ถ่ายรูปด้วยกล้อง / เลือกจากคลังภาพ / ยกเลิก) สไตล์ Aura Mobile
3. **In-app CameraView Modal (`components/CameraViewModal.tsx`):**
   - หน้าต่าง Viewfinder กล้องถ่ายภาพในแอปด้วย `CameraView` จาก `expo-camera`
   - ปุ่มสลับกล้องหน้า/หลัง (Flip Camera), ปุ่มชัตเตอร์ (Shutter Button) และปุ่มปิด
4. **Create Event Modal พร้อม Image Preview & Actions (`components/CreateEventModal.tsx`):**
   - กล่องเลือกภาพ (Dashed Box) สำหรับสถานะว่าง
   - แสดงภาพ Preview ทันทีเมื่อเลือกรูปแล้ว พร้อมปุ่ม **"เปลี่ยนรูป" (Replace)** และปุ่ม **"ลบรูป" (Remove)**
   - จำลองการอัปโหลดรูปภาพและสร้าง Event ใหม่เข้าสู่ `listState.events` แสดงผลการ์ดบนฟีดทันที
   - ผู้ใช้ยกเลิกการถ่ายรูปหรือเลือกภาพ ข้อมูลฟอร์มที่กรอกไว้เดิมยังอยู่ครบถ้วน
5. **Floating Action Button (FAB) ในหน้า Events (`app/(tabs)/events.tsx`):**
   - ปุ่มสร้างกิจกรรมใหม่สี Primary ทรงกลมลอยที่มุมขวาล่าง ใช้งานสะดวก

---

## 📝 Lab 9 — Exit Ticket

1. **`canAskAgain` เปลี่ยน UX อย่างไร?**
   - เมื่อ `canAskAgain === true`: ผู้ใช้เพียงแค่ปฏิเสธในครั้งนั้นหรือยังไม่เคยถูกถาม ระบบของระบบปฏิบัติการยังอนุญาตให้แอปเรียก Dialog ขอสิทธิ์ซ้ำได้ UX จึงสามารถปล่อยให้ผู้ใช้ลองกดปุ่มใหม่ได้โดยตรง
   - เมื่อ `canAskAgain === false`: ผู้ใช้ได้เลือก "Don't ask again" หรือระบบปฏิบัติการบล็อกการขอสิทธิ์ถาวรแล้ว การเรียก Permission Dialog อีกครั้งจะไม่ปรากฏขึ้นและจะคืนค่า `denied` เสมอ UX จึงจำเป็นต้องเปลี่ยนกลยุทธ์เป็นการแสดงคำอธิบายเหตุผลและให้ปุ่มพาผู้ใช้ไปที่หน้าการตั้งค่าของเครื่อง (`Linking.openSettings()`) แทน
2. **เพราะเหตุใด backend ต้อง validate รูปซ้ำ?**
   - ฝั่ง Client สามารถถูก Bypass หรือปลอมแปลงข้อมูลได้ (เช่น เปลี่ยนนามสกุลไฟล์จาก `.exe` หรือ `.sh` เป็น `.jpg`, หรือส่ง payload ขนาดมหึมาผ่าน API โดยตรง)
   - Backend จึงต้องเป็นด่านรักษาความปลอดภัยขั้นสุดท้าย (Zero-Trust) โดยตรวจสอบ Magic Bytes / MIME Type ที่แท้จริงของไฟล์, ตรวจสอบขนาดไฟล์จริง, สแกนมัลแวร์, และบีบอัด/Re-encode ภาพใหม่ก่อนบันทึกลง Object Storage
3. **ควรเก็บรูปไว้ที่ใดเมื่อผู้ใช้ยังไม่ submit form?**
   - ควรเก็บไว้เป็น **Local Cache / Temporary URI** ในเครื่องผู้ใช้ (เช่น ไฟล์ชั่วคราวใน Cache directory ที่ได้จาก `CameraView` หรือ Image Picker)
   - ไม่ควรรีบอัปโหลดขึ้น Cloud Storage ก่อนผู้ใช้กดยืนยันการส่งฟอร์ม เพื่อป้องกันปัญหาไฟล์ขยะ (Orphaned / Abandoned files) ในกรณีที่ผู้ใช้ยกเลิกฟอร์มหรือปิดแอปทิ้ง และช่วยประหยัด Bandwidth / ค่าใช้จ่าย Storage
