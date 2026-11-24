<script setup>
import { reactive, ref } from 'vue'
import AdminIcon from './icons/AdminIcon.vue'

const props = defineProps({
  // ค่าจาก MASTER_KINDS (pageTitle / fieldLabel / placeholder)
  kind: { type: Object, required: true },
  // null = สร้างใหม่, มีค่า = แก้ไข
  option: { type: Object, default: null },
  submitting: { type: Boolean, default: false },
  error: { type: String, default: '' },
})

const emit = defineEmits(['close', 'submit'])

const isEdit = Boolean(props.option)

const form = reactive({
  name: props.option?.name ?? '',
  isActive: props.option?.isActive ?? true,
})

const submitted = ref(false)
const nameError = ref('')

function submit() {
  submitted.value = true
  nameError.value = form.name.trim() ? '' : 'กรุณากรอกชื่อตัวเลือก'
  if (nameError.value) return

  emit('submit', { name: form.name.trim(), isActive: form.isActive })
}
</script>

<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4">
      <button
        type="button"
        class="fixed inset-0 bg-black/40"
        aria-label="ปิดหน้าต่าง"
        @click="!submitting && emit('close')"
      />

      <div
        role="dialog"
        aria-modal="true"
        :aria-label="isEdit ? 'แก้ไขตัวเลือก' : 'เพิ่มตัวเลือก'"
        class="relative my-4 w-full max-w-[560px] rounded-[12px] bg-white px-6 pb-6 pt-5 shadow-[0_16px_40px_rgba(15,23,42,0.18)]"
      >
        <header class="flex items-start justify-between gap-3">
          <div>
            <h2 class="text-[20px] font-semibold leading-[28px] text-[#181C1B]">
              {{ isEdit ? 'แก้ไขตัวเลือก' : 'เพิ่มตัวเลือก' }}
            </h2>
            <p class="mt-[2px] max-w-[420px] text-[11px] leading-[17px] text-[#505F76]">
              {{
                isEdit
                  ? 'แก้ไขชื่อหรือปิดใช้งานตัวเลือกนี้ ข้อมูลโครงการเดิมยังอยู่ครบ'
                  : `ตัวเลือกใหม่จะไปปรากฏในแบบฟอร์มสร้างโครงการ (${kind.pageTitle}) ทันที`
              }}
            </p>
          </div>

          <button
            type="button"
            class="flex h-7 w-7 shrink-0 items-center justify-center rounded-[6px] text-[#505F76] transition hover:bg-[#F1F4F2]"
            aria-label="ปิด"
            :disabled="submitting"
            @click="emit('close')"
          >
            <AdminIcon name="close" class="h-[18px] w-[18px]" />
          </button>
        </header>

        <form class="mt-4" @submit.prevent="submit">
          <div>
            <label for="master-name" class="block text-[13px] font-medium text-[#181C1B]">
              {{ kind.fieldLabel }} <span class="text-[#B91C1C]">*</span>
            </label>
            <input
              id="master-name"
              v-model="form.name"
              type="text"
              maxlength="160"
              :placeholder="kind.placeholder"
              class="mt-1 h-11 w-full rounded-[8px] border bg-white px-3 text-[13px] text-[#181C1B] outline-none placeholder:text-[#707974] focus:border-[#1D5C48] focus:ring-2 focus:ring-[#1D5C48]/10"
              :class="submitted && nameError ? 'border-[#B91C1C]' : 'border-[#BFC9C3]'"
            />
            <p v-if="submitted && nameError" class="mt-1 text-[11px] text-[#B91C1C]">
              {{ nameError }}
            </p>
            <p v-else class="mt-[5px] text-[10px] leading-[15px] text-[#707974]">
              ชื่อต้องไม่ซ้ำกับตัวเลือกที่มีอยู่แล้ว
            </p>
          </div>

          <div
            v-if="isEdit"
            class="mt-4 rounded-[8px] border border-[#E3E8E5] bg-[#F8FAFC] px-3 py-2.5"
          >
            <label class="flex cursor-pointer items-center gap-2">
              <input
                v-model="form.isActive"
                type="checkbox"
                class="h-4 w-4 rounded border-[#BFC9C3] text-[#1D5C48] focus:ring-[#1D5C48]/20"
              />
              <span class="text-[12px] font-medium text-[#181C1B]">เปิดใช้งานตัวเลือกนี้</span>
            </label>
            <p class="mt-1 pl-6 text-[10px] leading-[15px] text-[#707974]">
              ตัวเลือกที่ปิดใช้งานจะไม่แสดงในฟอร์มสร้างโครงการ แต่ข้อมูลเดิมยังอยู่ (BR-26)
            </p>
          </div>

          <p
            v-if="error"
            role="alert"
            class="mt-3 rounded-[7px] bg-red-50 px-3 py-2 text-[11px] leading-[17px] text-red-700"
          >
            {{ error }}
          </p>

          <div class="mt-5 flex justify-end gap-2">
            <button
              type="button"
              class="h-10 rounded-[8px] border border-[#BFC9C3] bg-white px-5 text-[13px] text-[#181C1B] transition hover:bg-[#F1F4F2] disabled:opacity-50"
              :disabled="submitting"
              @click="emit('close')"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              class="h-10 rounded-[8px] bg-[#1D5C48] px-5 text-[13px] font-medium text-white transition hover:bg-[#174C3B] disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="submitting"
            >
              {{ submitting ? 'กำลังบันทึก…' : 'บันทึก' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>
