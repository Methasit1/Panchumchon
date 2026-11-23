<script setup>
defineProps({
  title: { type: String, required: true },
  message: { type: String, default: '' },
  confirmLabel: { type: String, default: 'ยืนยัน' },
  cancelLabel: { type: String, default: 'ยกเลิก' },
  tone: { type: String, default: 'primary' }, // primary | danger
  loading: { type: Boolean, default: false },
})

const emit = defineEmits(['confirm', 'cancel'])
</script>

<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        class="absolute inset-0 bg-black/40"
        aria-label="ปิดหน้าต่าง"
        @click="!loading && emit('cancel')"
      />

      <div
        role="dialog"
        aria-modal="true"
        :aria-label="title"
        class="relative w-full max-w-[440px] rounded-[12px] bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.18)]"
      >
        <h2 class="text-[17px] font-semibold leading-[24px] text-[#181C1B]">{{ title }}</h2>
        <p v-if="message" class="mt-2 whitespace-pre-line text-[12px] leading-[19px] text-[#505F76]">
          {{ message }}
        </p>

        <div class="mt-5 flex justify-end gap-2">
          <button
            type="button"
            class="h-9 rounded-[8px] border border-[#BFC9C3] bg-white px-4 text-[12px] text-[#181C1B] transition hover:bg-[#F1F4F2] disabled:opacity-50"
            :disabled="loading"
            @click="emit('cancel')"
          >
            {{ cancelLabel }}
          </button>
          <button
            type="button"
            :class="[
              'h-9 rounded-[8px] px-4 text-[12px] font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-60',
              tone === 'danger' ? 'bg-[#B91C1C] hover:bg-[#991B1B]' : 'bg-[#1D5C48] hover:bg-[#174C3B]',
            ]"
            :disabled="loading"
            @click="emit('confirm')"
          >
            {{ loading ? 'กำลังดำเนินการ…' : confirmLabel }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
