<script setup lang="ts">
import { computed } from 'vue'

interface HighlightItem {
  bold: string
  text: string
}

const props = withDefaults(
  defineProps<{
    labNumber: string
    title: string
    status: 'completed' | 'planned'
    statusLabel?: string
    objective: string
    highlights: HighlightItem[]
    tags: string[]
    imageSrc?: string
    placeholderIcon?: string
    placeholderLabel?: string
  }>(),
  {
    statusLabel: '',
    imageSrc: '',
    placeholderIcon: '📱',
    placeholderLabel: 'App Screenshot',
  }
)

// Import all webp images in ../images
const imageModules = import.meta.glob<{ default: string }>('../images/*.webp', { eager: true })

const actualImageSrc = computed(() => {
  if (props.imageSrc) {
    for (const [path, mod] of Object.entries(imageModules)) {
      const filename = path.split('/').pop()
      if (props.imageSrc.endsWith(filename || '')) {
        return mod.default || mod
      }
    }
    return props.imageSrc
  }

  // Auto-detect by labNumber (e.g. "01", "02", ...)
  const paddedLab = props.labNumber.padStart(2, '0')
  const expectedKey = `../images/lab-${paddedLab}.webp`
  if (imageModules[expectedKey]) {
    return imageModules[expectedKey].default || imageModules[expectedKey]
  }

  return ''
})
</script>

<template>
  <div class="h-full flex flex-col justify-between py-1">
    <!-- Top Header Bar -->
    <div class="flex items-center justify-between mb-2">
      <div class="flex items-center gap-2">
        <span
          class="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
          :class="props.status === 'completed' ? 'bg-emerald-100 text-[#006d3e]' : 'bg-purple-100 text-[#732ee4]'"
        >
          LAB {{ props.labNumber }}
        </span>
        <span class="text-xs text-[#6c7b6f] font-medium">Campus Events Progress</span>
      </div>

      <span
        v-if="props.status === 'completed'"
        class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#dcfce7] text-[#006d3e] border border-[#86efac]"
      >
        <span class="w-1.5 h-1.5 rounded-full bg-[#1dbf73]"></span>
        {{ props.statusLabel || 'Completed' }}
      </span>
    </div>

    <!-- Main Title -->
    <h2 class="text-2xl font-bold text-[#1b1b1e] tracking-tight mb-3">
      {{ props.title }}
    </h2>

    <!-- Main 2-Column Body -->
    <div class="grid grid-cols-12 gap-5 items-center flex-1">
      <!-- Left Column: Content Cards (7 cols) -->
      <div class="col-span-7 flex flex-col gap-2.5">
        <!-- Objective Card -->
        <div class="bg-white rounded-xl p-3.5 border border-[#e4e1e6] shadow-[0_2px_8px_-2px_rgba(27,27,30,0.04)]">
          <div class="text-[11px] font-bold uppercase tracking-wider text-[#006d3e] mb-1">
            Objective (วัตถุประสงค์)
          </div>
          <p class="text-[13px] text-[#3d4a40] leading-snug">
            {{ props.objective }}
          </p>
        </div>

        <!-- Highlights Card -->
        <div class="bg-white rounded-xl p-3.5 border border-[#e4e1e6] shadow-[0_2px_8px_-2px_rgba(27,27,30,0.04)]">
          <div class="text-[11px] font-bold uppercase tracking-wider text-[#1b1b1e] mb-2">
            {{ props.status === 'completed' ? 'Key Features & Highlights' : 'Planned Capabilities' }}
          </div>
          <ul class="text-[12px] space-y-1.5 text-[#3d4a40]">
            <li
              v-for="(item, idx) in props.highlights"
              :key="idx"
              class="flex items-start gap-2"
            >
              <span
                class="font-bold text-xs mt-0.5"
                :class="props.status === 'completed' ? 'text-[#006d3e]' : 'text-[#732ee4]'"
              >
                {{ props.status === 'completed' ? '✔' : '•' }}
              </span>
              <span class="leading-tight">
                <strong class="text-[#1b1b1e]">{{ item.bold }}</strong> {{ item.text }}
              </span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Right Column: Phone Mockup Frame (5 cols) -->
      <div class="col-span-5 flex justify-center items-center">
        <div class="phone-frame-light">
          <!-- Top Speaker / Dynamic Island Notch -->
          <div class="phone-notch-light"></div>

          <!-- Phone Screen Area -->
          <div class="phone-screen-light">
            <!-- If image provided or auto-detected, render image -->
            <img
              v-if="actualImageSrc"
              :src="actualImageSrc"
              :alt="props.title"
              class="w-full h-full object-cover object-top rounded-[20px]"
            />
            <!-- Else render elegant placeholder -->
            <div
              v-else
              class="w-full h-full flex flex-col items-center justify-center p-3 text-center bg-[#f6f2f7] border border-dashed border-[#bbcabd] rounded-2xl"
            >
              <span class="text-3xl mb-1.5">{{ props.placeholderIcon }}</span>
              <span class="text-xs font-bold text-[#1b1b1e]">{{ props.placeholderLabel }}</span>
              <span class="text-[10px] text-[#6c7b6f] mt-0.5">`presentations/images/lab-{{ props.labNumber }}.webp`</span>
              <span
                class="text-[9px] font-semibold mt-2 px-2 py-0.5 rounded-full"
                :class="props.status === 'completed' ? 'bg-[#dcfce7] text-[#006d3e]' : 'bg-[#ede9fe] text-[#732ee4]'"
              >
                {{ props.status === 'completed' ? 'Verified in App' : 'Roadmap Mockup' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.phone-frame-light {
  position: relative;
  width: 240px;
  height: 400px;
  background: #18181b;
  border-radius: 32px;
  border: 6px solid #27272a;
  box-shadow: 0 15px 30px -10px rgba(27, 27, 30, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.phone-notch-light {
  position: absolute;
  top: 6px;
  left: 50%;
  transform: translateX(-50%);
  width: 65px;
  height: 14px;
  background: #27272a;
  border-radius: 7px;
  z-index: 20;
}

.phone-screen-light {
  flex: 1;
  width: 100%;
  height: 100%;
  border-radius: 24px;
  overflow: hidden;
  padding: 4px;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
