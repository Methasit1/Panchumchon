<script setup>
defineProps({
  projectName: { type: String, default: '' },
  blockers: { type: Array, default: () => [] },
})

const emit = defineEmits(['close', 'go-to-form'])
</script>

<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        class="absolute inset-0 bg-black/40"
        aria-label="ปิดหน้าต่าง"
        @click="emit('close')"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="ข้อมูลยังไม่ครบ"
        class="relative w-full max-w-[520px] rounded-[12px] bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.18)]"
      >
        <h2 class="text-[17px] font-semibold leading-[24px] text-[#181C1B]">
          ยังเริ่มดำเนินการไม่ได้
        </h2>
        <p class="mt-1 text-[12px] leading-[18px] text-[#505F76]">
          {{ projectName }} — ต้องกรอกข้อมูลต่อไปนี้ให้ครบก่อนเปลี่ยนสถานะ (BR-08 ถึง BR-11)
        </p>

        <ul class="mt-3 space-y-1.5 rounded-[8px] bg-[#FDF6D8]/60 p-3 text-[12px] leading-[19px] text-[#8A6A00]">
          <li v-for="item in blockers" :key="item" class="flex gap-2">
            <span aria-hidden="true">•</span>
            <span>{{ item }}</span>
          </li>
        </ul>

        <div class="mt-5 flex justify-end gap-2">
          <button
            type="button"
            class="h-9 rounded-[8px] border border-[#BFC9C3] bg-white px-4 text-[12px] transition hover:bg-[#F1F4F2]"
            @click="emit('close')"
          >
            ปิด
          </button>
          <button
            type="button"
            class="h-9 rounded-[8px] bg-[#1D5C48] px-4 text-[12px] font-medium text-white transition hover:bg-[#174C3B]"
            @click="emit('go-to-form')"
          >
            ไปที่แบบฟอร์มโครงการ
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
