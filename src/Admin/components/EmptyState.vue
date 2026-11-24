<script setup>
defineProps({
  title: { type: String, default: 'ยังไม่มีข้อมูล' },
  description: { type: String, default: '' },
})
</script>

<template>
  <div
    class="flex flex-col items-center justify-center rounded-[14px] border border-dashed border-[#BFC9C3] bg-white px-6 py-12 text-center"
  >
    <div class="flex h-12 w-12 items-center justify-center rounded-full bg-[#EAF2EE] text-[#1D5C48]">
      <svg viewBox="0 0 24 24" class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
        <path d="M4 7.5A1.5 1.5 0 0 1 5.5 6h4l2 2h7A1.5 1.5 0 0 1 20 9.5v8a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 17.5v-10Z" />
      </svg>
    </div>
    <p class="mt-3 text-[13px] font-semibold text-[#181C1B]">{{ title }}</p>
    <p v-if="description" class="mt-1 max-w-[420px] text-[11px] leading-[17px] text-[#505F76]">
      {{ description }}
    </p>
    <div class="mt-4">
      <slot />
    </div>
  </div>
</template>
