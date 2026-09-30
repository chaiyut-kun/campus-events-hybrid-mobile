/btw เราแก้ไขการที่เราไม่สามารถให้แอป notification ได้อย่างไร นะ? เหล่ามาเป็น step ๆ
• ถ้ายังไม่เคยขอ → ขอ permission          
• ถ้าถูกปฏิเสธ → แสดง Alert พร้อมปุ่ม "เปิดการตั้งค่า" ใช้ Linking.openSettings() ให้ผู้ใช้ไปเปิด permission เอง
• ถ้าได้รับอนุญาต → ดำเนินการตั้ง reminder ต่อ
• ตั้ง Android Notification Channel event-reminders ระดับ HIGH importance พร้อมชื่อภาษาไทย "การเตือนกิจกรรม" 
• เพิ่ม error diagnostics ที่ชัดเจน — แยก error message ตาม case                                          
──────
### Step 4: ตั้ง Notification Channel & Handler ที่ Root Layout

แก้ไขใน app/_layout.tsx:

• เรียก configureNotificationHandler() เพื่อให้แสดง alert + sound ขณะแอปเปิดอยู่ (foreground)
• จัดการ Cold Start → ตรวจ getLastNotificationResponse() แล้ว navigate ไป /events/[id]  
• จัดการ Background tap → ใช้ addNotificationResponseReceivedListener()                 
──────
### สรุปลำดับการแก้ทั้งหมด

Crash ตอนเปิดแอป
└─ Step 1: Patch push notification fatal throw
└─ Step 2: Safe fallback สำหรับ missing native modules
└─ Step 3: Just-in-Time permission + ปุ่มเปิด Settings
└─ Step 4: Channel config + Deep link handler  
└─ ✅ แอปทำงานได้ปกติบน Expo Go             

หัวใจหลัก: เนื่องจาก Expo Go SDK 53+ ถอด push notification ออก → เราต้อง "ปิดทาง crash" ทุกจุดที่เรียก push module + ใช้เฉพาะ Local
Notification ซึ่งยังทำงานได้ปกติบน Expo Go
