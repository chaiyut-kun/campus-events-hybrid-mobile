<template>
  <div class="h-full flex flex-col justify-between py-1">
    <div>
      <span class="text-[11px] font-bold uppercase tracking-wider text-[#524584]">Conclusion & Verification</span>
      <h2 class="text-2xl font-bold text-[#1b1b1e] tracking-tight mb-1">Quality Assurance & Next Steps</h2>
      <p class="text-xs text-[#3d4a40]">
        สรุปผลการทดสอบความถูกต้อง ความเสถียรของแอปพลิเคชัน และขั้นตอนการพัฒนาถัดไป
      </p>
    </div>

    <div class="grid grid-cols-2 gap-4 my-2">
      <div class="bg-white rounded-xl p-3.5 border border-[#e4e1e6] shadow-[0_2px_8px_-2px_rgba(27,27,30,0.04)]">
        <div class="text-xs font-bold uppercase tracking-wider text-[#006d3e] mb-2 flex items-center gap-1.5">
          <span>🧪</span>
          <span>Test Automation & Quality</span>
        </div>
        <ul class="text-xs space-y-1.5 text-[#3d4a40]">
          <li class="flex items-start gap-2">
            <span class="text-[#006d3e] font-bold">✔</span>
            <span><strong class="text-[#1b1b1e]">Unit Testing:</strong> ทดสอบ Logic, State และ Event Handling ด้วย Jest</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-[#006d3e] font-bold">✔</span>
            <span><strong class="text-[#1b1b1e]">Integration Testing:</strong> ตรวจสอบการทำงานร่วมกันของ Navigation, Tabs และ Modal</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-[#006d3e] font-bold">✔</span>
            <span><strong class="text-[#1b1b1e]">Expo Go Compatibility:</strong> ทดสอบจริงบนสมาร์ตโฟน รองรับทั้ง Android และ iOS</span>
          </li>
        </ul>
      </div>

      <div class="bg-white rounded-xl p-3.5 border border-[#e4e1e6] shadow-[0_2px_8px_-2px_rgba(27,27,30,0.04)]">
        <div class="text-xs font-bold uppercase tracking-wider text-[#524584] mb-2 flex items-center gap-1.5">
          <span>🚀</span>
          <span>Next Milestones</span>
        </div>
        <ul class="text-xs space-y-1.5 text-[#3d4a40]">
          <li class="flex items-start gap-2">
            <span class="text-[#732ee4] font-bold">→</span>
            <span>รวมฟีเจอร์ Forms (Lab 5) และ REST API (Lab 6) เข้าสู่ Main Branch</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-[#732ee4] font-bold">→</span>
            <span>เปิดใช้งานระบบแคชและออฟไลน์ด้วย AsyncStorage (Lab 7)</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-[#732ee4] font-bold">→</span>
            <span>เชื่อมต่อ Hardware APIs: Camera, Maps และ Notifications (Labs 9–11)</span>
          </li>
        </ul>
      </div>
    </div>

    <div class="bg-white rounded-xl p-3 border border-[#e4e1e6] shadow-[0_2px_8px_-2px_rgba(27,27,30,0.04)] flex items-center justify-between px-4">
      <div>
        <div class="text-base font-bold text-[#1b1b1e]">Thank You! 🙏</div>
        <div class="text-[11px] text-[#6c7b6f]">Questions & Feedback are welcome</div>
      </div>
      <div class="text-right">
        <div class="text-xs font-semibold text-[#006d3e]">Campus Events Team</div>
        <div class="text-[10px] text-[#6c7b6f]">Expo SDK 57 • React Native 0.86</div>
      </div>
    </div>
  </div>
</template>
