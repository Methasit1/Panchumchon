<script setup>
import { ref } from 'vue'

const props = defineProps({
  projectName: { type: String, default: '' },
  loading: { type: Boolean, default: false },
  error: { type: String, default: '' },
})

const emit = defineEmits(['confirm', 'cancel'])

const reason = ref('')
const touched = ref(false)

function submit() {
  touched.value = true
  if (!reason.value.trim()) return
  emit('confirm', reason.value.trim())
}
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
        aria-label="ยกเลิกโครงการ"
        class="relative w-full max-w-[480px] rounded-[12px] bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.18)]"
      >
        <h2 class="text-[17px] font-semibold leading-[24px] text-[#181C1B]">ยกเลิกโครงการ</h2>
        <p class="mt-1 text-[12px] leading-[18px] text-[#505F76]">
          {{ props.projectName }}
        </p>

        <label for="cancel-reason" class="mt-4 block text-[12px] font-medium text-[#181C1B]">
          เหตุผลการยกเลิก <span class="text-[#B91C1C]">*</span>
        </label>
        <textarea
          id="cancel-reason"
          v-model="reason"
          rows="3"
          maxlength="500"
          placeholder="ระบุเหตุผล เช่น ชุมชนมีมติเลิก หรืองบประมาณถูกตัด"
          class="mt-1 w-full resize-none rounded-[8px] border bg-white px-3 py-2 text-[12px] leading-[19px] outline-none placeholder:text-[#707974] focus:border-[#1D5C48] focus:ring-2 focus:ring-[#1D5C48]/10"
          :class="touched && !reason.trim() ? 'border-[#B91C1C]' : 'border-[#BFC9C3]'"
        />
        <p v-if="touched && !reason.trim()" class="mt-1 text-[11px] text-[#B91C1C]">
          ต้องระบุเหตุผลก่อนบันทึก (BR-20)
        </p>
        <p v-if="error" class="mt-1 text-[11px] text-[#B91C1C]">{{ error }}</p>

        <p class="mt-2 text-[11px] leading-[17px] text-[#707974]">
          เมื่อยกเลิกแล้วจะย้อนกลับไม่ได้ และความคืบหน้าจะคงไว้ที่ค่าล่าสุด (BR-22)
        </p>

        <div class="mt-5 flex justify-end gap-2">
          <button
            type="button"
            class="h-9 rounded-[8px] border border-[#BFC9C3] bg-white px-4 text-[12px] transition hover:bg-[#F1F4F2] disabled:opacity-50"
            :disabled="loading"
            @click="emit('cancel')"
          >
            ปิด
          </button>
          <button
            type="button"
            class="h-9 rounded-[8px] bg-[#B91C1C] px-4 text-[12px] font-medium text-white transition hover:bg-[#991B1B] disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="loading"
            @click="submit"
          >
            {{ loading ? 'กำลังบันทึก…' : 'ยืนยันยกเลิก' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
