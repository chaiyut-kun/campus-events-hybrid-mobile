---
theme: default
class: p-0
highlighter: shiki
lineNumbers: false
info: |
  ## Campus Events Mobile App
  Development Progress & Roadmap Presentation
drawings:
  persist: false
transition: slide-left
title: Campus Events — App Progress
mdc: true
---

<CoverSlide />

---
layout: default
hide: true
---

<OverviewSlide />

---
layout: default
---

<LabSlide
  labNumber="01"
  title="Mobile Foundation, React Native & Expo"
  status="completed"
  objective="เริ่มต้นพัฒนาด้วย Expo SDK 57 วางโครงสร้างมาตรฐานโมบายล์แอปพลิเคชัน และทดสอบรันแอปบนอุปกรณ์จริงผ่าน Expo Go อย่างมีประสิทธิภาพ"
  :highlights="[
    { bold: 'Project Scaffolding:', text: 'จัดระเบียบโฟลเดอร์สำหรับ Expo Router และ Components แยกเป็นสัดส่วน' },
    { bold: 'Expo Go Fast Refresh:', text: 'เชื่อมต่อทดสอบบนสมาร์ตโฟนจริงแบบเรียลไทม์ผ่าน QR Code' },
    { bold: 'Modern Baseline:', text: 'ใช้ React 19, React Native 0.86 และ TypeScript ควบคุมความถูกต้อง' }
  ]"
  :tags="['Expo 57', 'TypeScript', 'Expo Go']"
  imageSrc="./images/lab-01.webp"
  placeholderIcon="📱"
  placeholderLabel="Expo Go Setup"
/>

---
layout: default
---

<LabSlide
  labNumber="02"
  title="Components, Props, State & Events"
  status="completed"
  objective="สร้างคอมโพเนนต์พื้นฐานที่นำกลับมาใช้ซ้ำได้ ส่งผ่านข้อมูลกิจกรรมด้วย Props และจัดการปฏิสัมพันธ์ของผู้ใช้ผ่าน State และ Event Handlers"
  :highlights="[
    { bold: 'EventCard Component:', text: 'การ์ดแสดงข้อมูลกิจกรรม วัน เวลา สถานที่ และจำนวนผู้เข้าร่วม' },
    { bold: 'Local State & useState:', text: 'ควบคุมสถานะการกดบันทึกรายการโปรด (Bookmark) และการเปิด Modal' },
    { bold: 'List Rendering:', text: 'วนลูปแสดงผลรายการกิจกรรมจาก Data Structure อย่างมีประสิทธิภาพ' }
  ]"
  :tags="['EventCard', 'useState', 'Props Contract']"
  imageSrc="./images/lab-02.webp"
  placeholderIcon="🃏"
  placeholderLabel="Event Cards & State"
/>

---
layout: default
---

<LabSlide
  labNumber="03"
  title="Styling & Responsive Mobile UI"
  status="completed"
  objective="ออกแบบหน้าตาแอปพลิเคชันให้ทันสมัย รองรับขนาดหน้าจอสมาร์ตโฟนที่หลากหลายด้วย Flexbox และจัดการพื้นที่ปลอดภัย (Safe Area)"
  :highlights="[
    { bold: 'Responsive Layout:', text: 'จัดการสัดส่วนและระยะห่างด้วย Flexbox ให้รองรับทั้งหน้าจอเล็กและใหญ่' },
    { bold: 'Safe Area Insets:', text: 'ป้องกันไม่ให้คอนเทนต์ชนขอบหรือทับซ้อนกับ Notch และ Home Bar' },
    { bold: 'Design System:', text: 'กำหนดมาตรฐานชุดสี (Color Palette) และความโค้งมนของการ์ดกิจกรรม' }
  ]"
  :tags="['StyleSheet', 'Flexbox', 'SafeAreaContext']"
  imageSrc="./images/lab-03.webp"
  placeholderIcon="🎨"
  placeholderLabel="Responsive UI"
/>

---
layout: default
---

<LabSlide
  labNumber="04"
  title="Expo Router & Navigation"
  status="completed"
  objective="จัดการการเปลี่ยนหน้าด้วย File-based Routing ของ Expo Router สร้าง Bottom Tabs Navigator และเปิดดูรายละเอียดกิจกรรมผ่าน Dynamic Routes"
  :highlights="[
    { bold: 'Bottom Tabs Navigation:', text: 'แถบนำทางด้านล่าง 3 หน้าหลัก (Events, Favorites, Profile)' },
    { bold: 'Dynamic Event Routes:', text: 'เจาะลึกรายละเอียดกิจกรรมใน app/events/[id].tsx อย่างแม่นยำ' },
    { bold: '404 & Stack Integration:', text: 'ป้องกันการหลุดด้วย +not-found.tsx พร้อม Header ย้อนกลับ' }
  ]"
  :tags="['Expo Router', 'Bottom Tabs', 'Dynamic Routes']"
  imageSrc="./images/lab-04.webp"
  placeholderIcon="🧭"
  placeholderLabel="Tabs & Detail Route"
/>

---
layout: default
hide: true
---

<div class="h-full flex flex-col justify-between py-1">
  <div class="flex items-center justify-between mb-1">
    <div>
      <span class="text-[11px] font-bold uppercase tracking-wider text-[#732ee4]">Future Roadmap</span>
      <h2 class="text-2xl font-bold text-[#1b1b1e] tracking-tight">Roadmap Milestones (Labs 05 – 11)</h2>
    </div>
    <span class="badge-planned">Planned Phases</span>
  </div>

  <p class="text-xs text-[#3d4a40] mb-2">
    แผนการพัฒนาฟีเจอร์ระดับสูงในเฟสถัดไปเพื่อยกระดับ Campus Events สู่แอปพลิเคชันที่พร้อมใช้งานจริง
  </p>

  <div class="grid grid-cols-3 gap-3 text-xs flex-1 my-1">
    <div class="design-card">
      <div class="font-bold text-[#732ee4] mb-1 flex items-center gap-1">
        <span>📝</span>
        <span>Lab 05: Forms & State</span>
      </div>
      <p class="text-[#3d4a40] text-[11px] leading-tight">ฟอร์มลงทะเบียนกิจกรรม, Input Validation และ Context API</p>
    </div>

    <div class="design-card">
      <div class="font-bold text-[#732ee4] mb-1 flex items-center gap-1">
        <span>🌐</span>
        <span>Lab 06: REST API</span>
      </div>
      <p class="text-[#3d4a40] text-[11px] leading-tight">ดึงข้อมูลจาก Server, Loading / Empty / Error State และ Retry</p>
    </div>

    <div class="design-card">
      <div class="font-bold text-[#732ee4] mb-1 flex items-center gap-1">
        <span>💾</span>
        <span>Lab 07: Local Storage</span>
      </div>
      <p class="text-[#3d4a40] text-[11px] leading-tight">บันทึกรายการโปรดและแคชข้อมูลด้วย AsyncStorage รองรับ Offline</p>
    </div>

    <div class="design-card">
      <div class="font-bold text-[#732ee4] mb-1 flex items-center gap-1">
        <span>🔐</span>
        <span>Lab 08: Auth & Security</span>
      </div>
      <p class="text-[#3d4a40] text-[11px] leading-tight">Login Session, SecureStore เก็บ Token และ Route Guard</p>
    </div>

    <div class="design-card">
      <div class="font-bold text-[#732ee4] mb-1 flex items-center gap-1">
        <span>📷</span>
        <span>Lab 09: Camera & Image</span>
      </div>
      <p class="text-[#3d4a40] text-[11px] leading-tight">ถ่ายภาพกิจกรรม, เลือกรูปภาพ และระบบขอ Permission ที่ดี</p>
    </div>

    <div class="design-card">
      <div class="font-bold text-[#732ee4] mb-1 flex items-center gap-1">
        <span>🗺️</span>
        <span>Lab 10: Location & Maps</span>
      </div>
      <p class="text-[#3d4a40] text-[11px] leading-tight">แผนที่สถานที่จัดงานแบบ Interactive ด้วย MapView และ Marker</p>
    </div>
  </div>

  <div class="mt-2 p-2.5 rounded-xl bg-[#faf5ff] border border-[#e9d5ff] flex items-center justify-between text-xs">
    <div class="flex items-center gap-2">
      <span class="text-base">🔔</span>
      <span class="text-[#3d4a40]"><strong class="text-[#732ee4]">Lab 11: Notifications & Platform APIs:</strong> แจ้งเตือนล่วงหน้าก่อนเริ่มกิจกรรมพร้อม Deep Link เข้าแอป</span>
    </div>
    <span class="px-2 py-0.5 rounded-full bg-[#ede9fe] text-[#732ee4] font-bold text-[10px]">Final Milestone</span>
  </div>
</div>

---
layout: default
---

<LabSlide
  labNumber="05"
  title="Forms & State Management"
  status="planned"
  objective="สร้างฟอร์มลงทะเบียนเข้าร่วมกิจกรรมและเพิ่มกิจกรรมใหม่ พร้อมระบบตรวจทานความถูกต้อง (Validation) และแชร์สถานะผ่าน Global Context"
  :highlights="[
    { bold: 'Event Registration Modal:', text: 'ป็อปอัปกรอกชื่อ อีเมล รหัสนักศึกษา พร้อมตรวจสอบเงื่อนไข' },
    { bold: 'Real-time Input Validation:', text: 'แจ้งเตือนข้อผิดพลาดทันทีเพื่อลดความผิดพลาดของผู้ใช้' },
    { bold: 'Events & Registration Context:', text: 'จัดการ State การลงทะเบียนร่วมกันทั้งระบบ' }
  ]"
  :tags="['Form Validation', 'Context API', 'Modal Sheet']"
  imageSrc="./images/lab-05.webp"
  placeholderIcon="📋"
  placeholderLabel="Registration Form"
/>

---
layout: default
---

<LabSlide
  labNumber="06"
  title="REST API & Networking"
  status="planned"
  objective="เชื่อมต่อแอปพลิเคชันเข้ากับ Backend Server ผ่าน REST API เพื่อโหลดข้อมูลกิจกรรมแบบไดนามิก พร้อมระบบจัดการสถานะเครือข่าย"
  :highlights="[
    { bold: 'Async API Client:', text: 'โหลดและส่งข้อมูลกิจกรรมผ่าน RESTful endpoints อย่างมีแบบแผน' },
    { bold: 'Tri-State UI Feedback:', text: 'จัดการหน้าจอ Loading, Empty State และ Error State ชัดเจน' },
    { bold: 'Pull to Refresh & Retry:', text: 'รองรับการรูดหน้าจอเพื่อดึงข้อมูลใหม่และปุ่มกดลองใหม่อัตโนมัติ' }
  ]"
  :tags="['REST API', 'Error Handling', 'PullToRefresh']"
  imageSrc="./images/lab-06.webp"
  placeholderIcon="🌐"
  placeholderLabel="API Feed & States"
/>

---
layout: default
---

<LabSlide
  labNumber="07"
  title="Local Storage & Offline Applications"
  status="planned"
  objective="เพิ่มประสิทธิภาพการทำงานแบบ Offline โดยจัดเก็บรายการกิจกรรมที่บันทึกไว้ในเครื่องด้วย AsyncStorage เพื่อประสบการณ์ใช้งานที่ราบรื่น"
  :highlights="[
    { bold: 'Persistent Favorites:', text: 'บันทึกกิจกรรมที่ชื่นชอบลง Storage ของเครื่อง ข้อมูลไม่หายเมื่อปิดแอป' },
    { bold: 'Offline-First Resilience:', text: 'เปิดดูรายการกิจกรรมและข้อมูลเดิมได้แม้ไม่มีสัญญาณอินเทอร์เน็ต' },
    { bold: 'Storage Synchronization:', text: 'ตรวจสอบความถูกต้องและอัปเดตข้อมูลอัตโนมัติเมื่อกลับมาออนไลน์' }
  ]"
  :tags="['AsyncStorage', 'Offline Cache', 'Persistence']"
  imageSrc="./images/lab-07.webp"
  placeholderIcon="💾"
  placeholderLabel="Offline Storage"
/>

---
layout: default
---

<LabSlide
  labNumber="08"
  title="Authentication & Mobile Security"
  status="planned"
  objective="วางระบบรักษาความปลอดภัย ยืนยันตัวตนผู้ใช้ เก็บรักษา Access Token ด้วย SecureStore และสร้าง Route Guards ป้องกันสิทธิ์การเข้าถึง"
  :highlights="[
    { bold: 'SecureStore Token Vault:', text: 'จัดเก็บ Sensitive Token ลงในระดับฮาร์ดแวร์ KeyStore / Keychain' },
    { bold: 'Protected Route Guards:', text: 'กรองสิทธิ์ผู้ใช้ก่อนเข้าหน้าสร้างกิจกรรมหรือข้อมูลส่วนตัว' },
    { bold: 'Session Restoration:', text: 'ต่ออายุและฟื้นฟู Session การเข้าใช้งานอัตโนมัติเมื่อเปิดแอปใหม่' }
  ]"
  :tags="['SecureStore', 'JWT / Token', 'Route Guards']"
  placeholderIcon="🔐"
  placeholderLabel="Login & Auth Flow"
/>

---
layout: default
---

<LabSlide
  labNumber="09"
  title="Camera, Image Picker & Permissions"
  status="planned"
  objective="เชื่อมต่อกับกล้องและคลังภาพของสมาร์ตโฟนสำหรับอัปโหลดภาพกิจกรรม พร้อมทั้งจัดการวงจรการขอ Permission ที่ถูกต้องตามหลัก UX"
  :highlights="[
    { bold: 'Camera & Image Picker:', text: 'ถ่ายภาพสดจากกล้อง หรือเลือกโปสเตอร์กิจกรรมจาก Photo Library' },
    { bold: 'Contextual Permissions:', text: 'ขอสิทธิ์กล้องเมื่อผู้ใช้กดใช้งาน ไม่ขอพร่ำเพรื่อตั้งแต่เปิดแอป' },
    { bold: 'Permission Recovery UX:', text: 'มีหน้าจอรองรับกรณีผู้ใช้ปฏิเสธสิทธิ์ พร้อมปุ่มนำทางไปหน้า Settings' }
  ]"
  :tags="['expo-camera', 'expo-image-picker', 'Permissions UX']"
  imageSrc="./images/lab-09.webp"
  placeholderIcon="📸"
  placeholderLabel="Camera & Picker"
/>

---
layout: default
---

<LabSlide
  labNumber="10"
  title="Location & Interactive Maps"
  status="planned"
  objective="แสดงพิกัดสถานที่จัดกิจกรรมบนแผนที่แบบ Interactive ระบุตำแหน่งปัจจุบันของผู้ใช้ และเลือกจุดจัดกิจกรรมบนแผนที่ได้อย่างแม่นยำ"
  :highlights="[
    { bold: 'Interactive MapView:', text: 'แสดงแผนที่มหาวิทยาลัยพร้อมหมุด (Markers) แสดงสถานที่จัดงานทั้งหมด' },
    { bold: 'User Geolocation:', text: 'ขอสิทธิ์ Foreground Location เพื่อแสดงตำแหน่งเปรียบเทียบกับสถานที่จัดงาน' },
    { bold: 'Location Picker Modal:', text: 'จิ้มเลือกพิกัดจัดงานใหม่ผ่านแผนที่แบบเรียลไทม์' }
  ]"
  :tags="['react-native-maps', 'expo-location', 'GPS Markers']"
  imageSrc="./images/lab-10.webp"
  placeholderIcon="🗺️"
  placeholderLabel="Campus Maps & Pins"
/>

---
layout: default
---

<LabSlide
  labNumber="11"
  title="Notifications & Mobile Platform APIs"
  status="planned"
  objective="สร้างระบบแจ้งเตือนกิจกรรมล่วงหน้า (Local Event Reminder) พร้อมเชื่อมโยงการกด Notification เพื่อเปิดดูรายละเอียดกิจกรรมโดยตรง"
  :highlights="[
    { bold: 'Scheduled Local Notifications:', text: 'ตั้งเวลาแจ้งเตือนก่อนกิจกรรมเริ่มล่วงหน้าตามเวลาที่กำหนด' },
    { bold: 'Notification Channels:', text: 'ปรับแต่ง Channel บน Android กำหนดระดับเสียง ความสำคัญ และสั่นเตือน' },
    { bold: 'Deep Linking to Event:', text: 'แตะการแจ้งเตือนเพื่อเปิดหน้าจอ app/events/[id] ได้อย่างแม่นยำ' }
  ]"
  :tags="['expo-notifications', 'Deep Link', 'Android Channel']"
  imageSrc="./images/lab-11.webp"
  placeholderIcon="🔔"
  placeholderLabel="Event Reminder"
/>

---
layout: default
hide: true
---

<ConclusionSlide />

---
layout: default
---

<QASlide />
