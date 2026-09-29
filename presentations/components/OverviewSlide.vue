<template>
  <div class="h-full flex flex-col justify-between py-1">
    <div class="flex items-center justify-between mb-2">
      <div>
        <span class="text-[11px] font-bold uppercase tracking-wider text-[#524584]">Executive Summary</span>
        <h2 class="text-2xl font-bold text-[#1b1b1e] tracking-tight">Project Overview & Architecture</h2>
      </div>
      <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#dcfce7] text-[#006d3e] border border-[#86efac]">
        <span class="w-1.5 h-1.5 rounded-full bg-[#1dbf73]"></span>
        Progress Baseline
      </span>
    </div>

    <div class="grid grid-cols-2 gap-5 flex-1 items-stretch my-1">
      <div class="bg-white rounded-xl p-4 border border-[#e4e1e6] shadow-[0_2px_8px_-2px_rgba(27,27,30,0.04)] flex flex-col justify-between">
        <div>
          <div class="text-xs font-bold uppercase tracking-wider text-[#006d3e] mb-2 flex items-center gap-1.5">
            <span>🎯</span>
            <span>ภาพรวมโครงงาน (Objective)</span>
          </div>
          <p class="text-[13px] text-[#3d4a40] leading-relaxed">
            พัฒนาแอปพลิเคชันสำหรับค้นหา ดูรายละเอียด ลงทะเบียน และแจ้งเตือนกิจกรรมในมหาวิทยาลัย โดยยึดหลัก <strong class="text-[#1b1b1e]">Mobile-First</strong> และสถาปัตยกรรม Cross-Platform ที่เสถียร รองรับทั้ง iOS และ Android
          </p>
        </div>

        <div class="mt-4 pt-3 border-t border-[#e4e1e6]">
          <div class="text-[11px] font-semibold text-[#6c7b6f] uppercase tracking-wider mb-2">Core Tech Stack</div>
          <div class="flex flex-wrap gap-1.5">
            <span class="px-2 py-0.5 rounded-md bg-[#f0edf1] text-[#524584] text-xs font-medium border border-[#e4e1e6]">Expo SDK 57</span>
            <span class="px-2 py-0.5 rounded-md bg-[#f0edf1] text-[#524584] text-xs font-medium border border-[#e4e1e6]">React Native 0.86</span>
            <span class="px-2 py-0.5 rounded-md bg-[#f0edf1] text-[#524584] text-xs font-medium border border-[#e4e1e6]">Expo Router</span>
            <span class="px-2 py-0.5 rounded-md bg-[#f0edf1] text-[#524584] text-xs font-medium border border-[#e4e1e6]">Jest Testing</span>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl p-4 border border-[#e4e1e6] shadow-[0_2px_8px_-2px_rgba(27,27,30,0.04)] flex flex-col justify-between">
        <div>
          <div class="text-xs font-bold uppercase tracking-wider text-[#524584] mb-2 flex items-center gap-1.5">
            <span>📊</span>
            <span>สถานะความก้าวหน้า (Milestones)</span>
          </div>
          <div class="space-y-2 text-xs">
            <div class="flex items-center justify-between p-2 rounded-lg bg-[#f0fdf4] border border-[#bbf7d0]">
              <span class="font-semibold text-[#006d3e]">✅ Phase 1: Core Foundation (Labs 1–4)</span>
              <span class="px-2 py-0.5 rounded-full bg-[#dcfce7] text-[#006d3e] font-bold text-[11px]">Completed</span>
            </div>
            <div class="flex items-center justify-between p-2 rounded-lg bg-[#faf5ff] border border-[#e9d5ff]">
              <span class="font-medium text-[#524584]">⏳ Phase 2: Data & Networking (Labs 5–7)</span>
              <span class="px-2 py-0.5 rounded-full bg-[#ede9fe] text-[#732ee4] font-bold text-[11px]">Planned</span>
            </div>
            <div class="flex items-center justify-between p-2 rounded-lg bg-[#faf5ff] border border-[#e9d5ff]">
              <span class="font-medium text-[#524584]">⏳ Phase 3: Hardware & Device APIs (Labs 8–11)</span>
              <span class="px-2 py-0.5 rounded-full bg-[#ede9fe] text-[#732ee4] font-bold text-[11px]">Planned</span>
            </div>
          </div>
        </div>

        <div class="mt-4 pt-3 border-t border-[#e4e1e6] text-[12px] text-[#6c7b6f] flex items-center gap-1.5">
          <span>⚡</span>
          <span>ทุกฟีเจอร์ผ่านการทดสอบ Unit & Integration Test ก่อนขึ้น Main Branch</span>
        </div>
      </div>
    </div>
  </div>
</template>
