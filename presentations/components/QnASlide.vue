<template>
  <div class="h-full flex flex-col justify-between py-1">
    <!-- Top Header Bar -->
    <div class="flex items-center justify-between mb-2">
      <div class="flex items-center gap-2">
        <span class="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-100 text-[#732ee4]">
          Discussion & Feedback
        </span>
        <span class="text-xs text-[#6c7b6f] font-medium">Campus Events Progression</span>
      </div>

      <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#dcfce7] text-[#006d3e] border border-[#86efac]">
        <span class="w-1.5 h-1.5 rounded-full bg-[#1dbf73]"></span>
        Q&A Session
      </span>
    </div>

    <!-- Title and Subtitle -->
    <div>
      <h2 class="text-3xl font-extrabold text-[#1b1b1e] tracking-tight mb-1 flex items-center gap-3">
        <span>Questions & Answers</span>
        <span class="text-lg font-bold text-[#732ee4] font-mono">(Q&A)</span>
      </h2>
      <p class="text-xs text-[#3d4a40]">
        เปิดรับคำถาม แลกเปลี่ยนความคิดเห็น และข้อเสนอแนะในการพัฒนาแอปพลิเคชัน Campus Events (Labs 01 – 11)
      </p>
    </div>

    <!-- 4 Key Discussion Pillars Grid -->
    <div class="grid grid-cols-2 gap-3.5 my-2">
      <!-- Pillar 1: Architecture -->
      <div class="bg-white rounded-xl p-3 border border-[#e4e1e6] shadow-[0_2px_8px_-2px_rgba(27,27,30,0.04)] hover:border-[#c4b5fd] transition-all">
        <div class="text-xs font-bold uppercase tracking-wider text-[#732ee4] mb-1.5 flex items-center gap-1.5">
          <span>🏛️</span>
          <span>Architecture & Navigation</span>
        </div>
        <ul class="text-[11px] space-y-1 text-[#3d4a40]">
          <li class="flex items-start gap-1.5">
            <span class="text-[#732ee4] font-bold">•</span>
            <span><strong class="text-[#1b1b1e]">Expo SDK 57 + RN 0.86:</strong> โครงสร้างมาตรฐานและประสิทธิภาพ</span>
          </li>
          <li class="flex items-start gap-1.5">
            <span class="text-[#732ee4] font-bold">•</span>
            <span><strong class="text-[#1b1b1e]">Expo Router v4:</strong> File-based routing, Bottom Tabs & Dynamic routes</span>
          </li>
          <li class="flex items-start gap-1.5">
            <span class="text-[#732ee4] font-bold">•</span>
            <span><strong class="text-[#1b1b1e]">Context API:</strong> การจัดการ Global State ของกิจกรรมและรายการโปรด</span>
          </li>
        </ul>
      </div>

      <!-- Pillar 2: Data & Offline -->
      <div class="bg-white rounded-xl p-3 border border-[#e4e1e6] shadow-[0_2px_8px_-2px_rgba(27,27,30,0.04)] hover:border-[#86efac] transition-all">
        <div class="text-xs font-bold uppercase tracking-wider text-[#006d3e] mb-1.5 flex items-center gap-1.5">
          <span>💾</span>
          <span>Data Sync & Offline Resilience</span>
        </div>
        <ul class="text-[11px] space-y-1 text-[#3d4a40]">
          <li class="flex items-start gap-1.5">
            <span class="text-[#006d3e] font-bold">•</span>
            <span><strong class="text-[#1b1b1e]">AsyncStorage Cache:</strong> บันทึกรายการโปรดและแคชข้อมูลแบบออฟไลน์</span>
          </li>
          <li class="flex items-start gap-1.5">
            <span class="text-[#006d3e] font-bold">•</span>
            <span><strong class="text-[#1b1b1e]">REST API & Tri-State UI:</strong> จัดการ Loading, Empty และ Error อย่างรัดกุม</span>
          </li>
          <li class="flex items-start gap-1.5">
            <span class="text-[#006d3e] font-bold">•</span>
            <span><strong class="text-[#1b1b1e]">Data Validation:</strong> ตรวจสอบฟอร์มลงทะเบียนแบบ Real-time</span>
          </li>
        </ul>
      </div>

      <!-- Pillar 3: Hardware & Native Features -->
      <div class="bg-white rounded-xl p-3 border border-[#e4e1e6] shadow-[0_2px_8px_-2px_rgba(27,27,30,0.04)] hover:border-[#c4b5fd] transition-all">
        <div class="text-xs font-bold uppercase tracking-wider text-[#524584] mb-1.5 flex items-center gap-1.5">
          <span>📱</span>
          <span>Hardware APIs & Permissions UX</span>
        </div>
        <ul class="text-[11px] space-y-1 text-[#3d4a40]">
          <li class="flex items-start gap-1.5">
            <span class="text-[#732ee4] font-bold">•</span>
            <span><strong class="text-[#1b1b1e]">Camera & Image Picker:</strong> จัดการสิทธิ์การเข้าถึงกล้องและคลังภาพ</span>
          </li>
          <li class="flex items-start gap-1.5">
            <span class="text-[#732ee4] font-bold">•</span>
            <span><strong class="text-[#1b1b1e]">Interactive Maps:</strong> พิกัดสถานที่จัดกิจกรรมและปักหมุดตำแหน่ง</span>
          </li>
          <li class="flex items-start gap-1.5">
            <span class="text-[#732ee4] font-bold">•</span>
            <span><strong class="text-[#1b1b1e]">Notifications:</strong> ตั้งเวลาแจ้งเตือนล่วงหน้าพร้อม Deep Link สู่หน้ากิจกรรม</span>
          </li>
        </ul>
      </div>

      <!-- Pillar 4: Quality & Testing -->
      <div class="bg-white rounded-xl p-3 border border-[#e4e1e6] shadow-[0_2px_8px_-2px_rgba(27,27,30,0.04)] hover:border-[#86efac] transition-all">
        <div class="text-xs font-bold uppercase tracking-wider text-[#006d3e] mb-1.5 flex items-center gap-1.5">
          <span>🧪</span>
          <span>Testing & Verification</span>
        </div>
        <ul class="text-[11px] space-y-1 text-[#3d4a40]">
          <li class="flex items-start gap-1.5">
            <span class="text-[#006d3e] font-bold">•</span>
            <span><strong class="text-[#1b1b1e]">Jest Unit Testing:</strong> ตรวจสอบ Logic ของ Reducer, Storage และ Service</span>
          </li>
          <li class="flex items-start gap-1.5">
            <span class="text-[#006d3e] font-bold">•</span>
            <span><strong class="text-[#1b1b1e]">Integration Testing:</strong> ทดสอบหน้าจอ Navigation, Tabs และ Modal</span>
          </li>
          <li class="flex items-start gap-1.5">
            <span class="text-[#006d3e] font-bold">•</span>
            <span><strong class="text-[#1b1b1e]">Device Verification:</strong> รันจริงบน Expo Go ทั้ง Android และ iOS</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- Bottom Footer Callout -->
    <div class="bg-gradient-to-r from-[#fbf8fc] via-white to-[#fbf8fc] rounded-xl p-3 border border-[#e4e1e6] shadow-[0_2px_8px_-2px_rgba(27,27,30,0.04)] flex items-center justify-between px-4">
      <div class="flex items-center gap-3">
        <span class="text-2xl">💬</span>
        <div>
          <div class="text-sm font-bold text-[#1b1b1e]">ยินดีตอบทุกข้อซักถามและรับฟังคำแนะนำ</div>
          <div class="text-[11px] text-[#6c7b6f]">Campus Events Development Team • Expo SDK 57</div>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <span class="px-2.5 py-1 rounded-lg bg-[#ede9fe] text-[#732ee4] font-semibold text-[11px]">
          GitHub: campus-events
        </span>
        <span class="px-2.5 py-1 rounded-lg bg-[#dcfce7] text-[#006d3e] font-semibold text-[11px]">
          Expo Go Live
        </span>
      </div>
    </div>
  </div>
</template>
