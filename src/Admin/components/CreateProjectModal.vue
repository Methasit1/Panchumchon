<script setup>
import { computed, reactive, ref } from 'vue'
import { STRUCTURE_STATUS_OPTIONS } from '@/shared/constants/project'
import { villageLabel } from '@/shared/utils/village'
import AdminIcon from './icons/AdminIcon.vue'

const props = defineProps({
  villages: { type: Array, default: () => [] },
  infraTypes: { type: Array, default: () => [] },
  defaultYear: { type: Number, required: true },
  submitting: { type: Boolean, default: false },
  error: { type: String, default: '' },
})

const emit = defineEmits(['close', 'submit'])

const form = reactive({
  villageId: '',
  name: '',
  infraTypeId: '',
  structureStatus: '',
  objective: '',
  planYear: props.defaultYear,
})

const submitted = ref(false)

// แจ้งเมื่อยังไม่มีข้อมูลพื้นฐานให้เลือก (ต้องไปเพิ่มที่หน้าหมู่บ้าน/ข้อมูลพื้นฐานก่อน)
const missingPrerequisites = computed(() => {
  const missing = []
  if (!props.villages.length) missing.push('หมู่บ้าน')
  if (!props.infraTypes.length) missing.push('ประเภทโครงสร้างพื้นฐาน')
  if (!missing.length) return ''
  return `ยังไม่มี${missing.join('และ')}ในระบบ — เพิ่มข้อมูลหลักก่อนสร้างโครงการ`
})

const errors = reactive({
  villageId: '',
  name: '',
  infraTypeId: '',
  structureStatus: '',
  objective: '',
  planYear: '',
})

function validate() {
  errors.villageId = form.villageId ? '' : 'กรุณาเลือกหมู่บ้าน'
  errors.name = form.name.trim() ? '' : 'กรุณากรอกชื่อโครงการ'
  errors.infraTypeId = form.infraTypeId ? '' : 'กรุณาเลือกประเภทโครงสร้างพื้นฐาน'
  errors.structureStatus = form.structureStatus ? '' : 'กรุณาเลือกสถานะปัจจุบันของสิ่งก่อสร้าง'
  errors.objective = form.objective.trim() ? '' : 'กรุณากรอกวัตถุประสงค์'
  errors.planYear = /^\d{4}$/.test(String(form.planYear))
    ? ''
    : 'กรุณากรอกปีแผนเป็น พ.ศ. 4 หลัก'

  return !Object.values(errors).some(Boolean)
}

function submit() {
  submitted.value = true
  if (!validate()) return

  emit('submit', {
    villageId: Number(form.villageId),
    name: form.name,
    infraTypeId: Number(form.infraTypeId),
    structureStatus: form.structureStatus,
    objective: form.objective,
    planYear: Number(form.planYear),
  })
}
</script>

<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 sm:items-center">
      <button
        type="button"
        class="fixed inset-0 bg-black/40"
        aria-label="ปิดหน้าต่าง"
        @click="!submitting && emit('close')"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="สร้างการ์ดโครงการ"
        class="relative my-4 flex max-h-[92vh] w-full max-w-[620px] flex-col rounded-[12px] bg-white shadow-[0_16px_40px_rgba(15,23,42,0.18)]"
      >
        <header class="flex items-start justify-between gap-3 px-6 pb-2 pt-5">
          <div>
            <div class="flex flex-wrap items-center gap-2">
              <h2 class="text-[19px] font-semibold leading-[26px] text-[#181C1B]">สร้างการ์ดโครงการ</h2>
              <span
                class="inline-flex items-center gap-[5px] rounded-full border border-[#BFC9C3]/70 bg-[#F1F4F2] px-2 py-[3px] text-[10px] leading-none text-[#505F76]"
              >
                <span class="h-[5px] w-[5px] rounded-full bg-[#9AA5A0]" />
                ถูกเพิ่มในแผนล่าสุด: รออนุมัติแผนงาน
              </span>
            </div>
            <p class="mt-[3px] text-[11px] leading-[16px] text-[#505F76]">
              กรอกข้อมูลขั้นต้นเพื่อเผยแพร่สู่กระบวนการตัดสินใจภาคประชาชน
            </p>
          </div>

          <button
            type="button"
            class="flex h-7 w-7 shrink-0 items-center justify-center rounded-[6px] text-[#505F76] transition hover:bg-[#F1F4F2]"
            aria-label="ปิด"
            :disabled="submitting"
            @click="emit('close')"
          >
            <AdminIcon name="close" class="h-4 w-4" />
          </button>
        </header>

        <form class="flex min-h-0 flex-1 flex-col" @submit.prevent="submit">
          <div class="min-h-0 flex-1 overflow-y-auto px-6 pb-2 pt-2">
            <!-- หมู่บ้าน -->
            <div>
              <label for="project-village" class="block text-[12px] font-medium text-[#181C1B]">
                หมู่บ้าน <span class="text-[#B91C1C]">*</span>
              </label>
              <div class="relative mt-1">
                <select
                  id="project-village"
                  v-model="form.villageId"
                  class="h-9 w-full appearance-none rounded-[7px] border bg-white pl-3 pr-8 text-[12px] text-[#181C1B] outline-none focus:border-[#1D5C48] focus:ring-2 focus:ring-[#1D5C48]/10"
                  :class="submitted && errors.villageId ? 'border-[#B91C1C]' : 'border-[#BFC9C3]'"
                >
                  <option value="">เลือกหมู่บ้าน</option>
                  <option v-for="village in villages" :key="village.village_id" :value="village.village_id">
                    {{ villageLabel(village.village_name) }} หมู่ {{ village.moo_no }}
                  </option>
                </select>
                <AdminIcon
                  name="chevron-down"
                  class="pointer-events-none absolute right-2 top-[9px] h-4 w-4 text-[#505F76]"
                />
              </div>
              <p class="mt-[5px] flex items-start gap-1 text-[10px] leading-[15px] text-[#C2410C]">
                <span aria-hidden="true">⚠</span>
                <span>เลือกแล้วย้ายไม่ได้ กรุณาตรวจสอบให้ถูกต้องตรงตามพื้นที่จริง (BR-04)</span>
              </p>
              <p v-if="submitted && errors.villageId" class="mt-1 text-[11px] text-[#B91C1C]">
                {{ errors.villageId }}
              </p>
            </div>

            <!-- ชื่อโครงการ -->
            <div class="mt-3">
              <label for="project-name" class="block text-[12px] font-medium text-[#181C1B]">
                ชื่อโครงการ <span class="text-[#B91C1C]">*</span>
              </label>
              <input
                id="project-name"
                v-model="form.name"
                type="text"
                maxlength="200"
                placeholder="เช่น ติดตั้งไฟส่องสว่างซอย 2 หรือ ก่อสร้างฝายชะลอน้ำ"
                class="mt-1 h-9 w-full rounded-[7px] border bg-white px-3 text-[12px] text-[#181C1B] outline-none placeholder:text-[#707974] focus:border-[#1D5C48] focus:ring-2 focus:ring-[#1D5C48]/10"
                :class="submitted && errors.name ? 'border-[#B91C1C]' : 'border-[#BFC9C3]'"
              />
              <p v-if="submitted && errors.name" class="mt-1 text-[11px] text-[#B91C1C]">
                {{ errors.name }}
              </p>
            </div>

            <!-- ประเภท -->
            <div class="mt-3">
              <label for="project-type" class="block text-[12px] font-medium text-[#181C1B]">
                ประเภทโครงสร้างพื้นฐาน <span class="text-[#B91C1C]">*</span>
              </label>
              <div class="relative mt-1">
                <select
                  id="project-type"
                  v-model="form.infraTypeId"
                  class="h-9 w-full appearance-none rounded-[7px] border bg-white pl-3 pr-8 text-[12px] text-[#181C1B] outline-none focus:border-[#1D5C48] focus:ring-2 focus:ring-[#1D5C48]/10"
                  :class="submitted && errors.infraTypeId ? 'border-[#B91C1C]' : 'border-[#BFC9C3]'"
                >
                  <option value="">เลือกหมวดหมู่พื้นฐาน</option>
                  <option v-for="type in infraTypes" :key="type.infra_type_id" :value="type.infra_type_id">
                    {{ type.type_name }}
                  </option>
                </select>
                <AdminIcon
                  name="chevron-down"
                  class="pointer-events-none absolute right-2 top-[9px] h-4 w-4 text-[#505F76]"
                />
              </div>
              <p v-if="submitted && errors.infraTypeId" class="mt-1 text-[11px] text-[#B91C1C]">
                {{ errors.infraTypeId }}
              </p>
            </div>

            <!-- สถานะสิ่งก่อสร้าง -->
            <div class="mt-3">
              <label for="project-structure-status" class="block text-[12px] font-medium text-[#181C1B]">
                สถานะปัจจุบันของสิ่งก่อสร้าง <span class="text-[#B91C1C]">*</span>
              </label>
              <div class="relative mt-1">
                <select
                  id="project-structure-status"
                  v-model="form.structureStatus"
                  class="h-9 w-full appearance-none rounded-[7px] border bg-white pl-3 pr-8 text-[12px] text-[#181C1B] outline-none focus:border-[#1D5C48] focus:ring-2 focus:ring-[#1D5C48]/10"
                  :class="submitted && errors.structureStatus ? 'border-[#B91C1C]' : 'border-[#BFC9C3]'"
                >
                  <option value="">เลือกสถานะของสิ่งก่อสร้าง</option>
                  <option v-for="option in STRUCTURE_STATUS_OPTIONS" :key="option" :value="option">
                    {{ option }}
                  </option>
                </select>
                <AdminIcon
                  name="chevron-down"
                  class="pointer-events-none absolute right-2 top-[9px] h-4 w-4 text-[#505F76]"
                />
              </div>
              <p v-if="submitted && errors.structureStatus" class="mt-1 text-[11px] text-[#B91C1C]">
                {{ errors.structureStatus }}
              </p>
            </div>

            <!-- ปีแผน -->
            <div class="mt-3">
              <label for="project-year" class="block text-[12px] font-medium text-[#181C1B]">
                ปีแผน (พ.ศ.) <span class="text-[#B91C1C]">*</span>
              </label>
              <input
                id="project-year"
                v-model="form.planYear"
                type="number"
                min="2400"
                max="2700"
                class="mt-1 h-9 w-full rounded-[7px] border bg-white px-3 text-[12px] text-[#181C1B] outline-none focus:border-[#1D5C48] focus:ring-2 focus:ring-[#1D5C48]/10"
                :class="submitted && errors.planYear ? 'border-[#B91C1C]' : 'border-[#BFC9C3]'"
              />
              <p class="mt-[4px] text-[10px] leading-[15px] text-[#707974]">
                ค่าเริ่มต้นคือปีปัจจุบัน (BR-27)
              </p>
              <p v-if="submitted && errors.planYear" class="mt-1 text-[11px] text-[#B91C1C]">
                {{ errors.planYear }}
              </p>
            </div>

            <!-- วัตถุประสงค์ -->
            <div class="mt-3">
              <label for="project-objective" class="block text-[12px] font-medium text-[#181C1B]">
                วัตถุประสงค์ <span class="text-[#B91C1C]">*</span>
              </label>
              <textarea
                id="project-objective"
                v-model="form.objective"
                rows="3"
                maxlength="1000"
                placeholder="ระบุปัญหาที่เกิดขึ้น ผลกระทบต่อชาวบ้าน และเหตุผลความจำเป็น…"
                class="mt-1 w-full resize-none rounded-[7px] border bg-white px-3 py-2 text-[12px] leading-[19px] text-[#181C1B] outline-none placeholder:text-[#707974] focus:border-[#1D5C48] focus:ring-2 focus:ring-[#1D5C48]/10"
                :class="submitted && errors.objective ? 'border-[#B91C1C]' : 'border-[#BFC9C3]'"
              />
              <p class="mt-[4px] flex items-start gap-1 text-[10px] leading-[15px] text-[#707974]">
                <span aria-hidden="true">ⓘ</span>
                <span>ปัญหาที่ชุมชนอยากแก้ เพื่อให้กรรมการหมู่บ้านและประชาชนเข้าใจตรงกัน</span>
              </p>
              <p v-if="submitted && errors.objective" class="mt-1 text-[11px] text-[#B91C1C]">
                {{ errors.objective }}
              </p>
            </div>

            <p
              v-if="error"
              role="alert"
              class="mt-3 rounded-[7px] bg-red-50 px-3 py-2 text-[11px] text-red-700"
            >
              {{ error }}
            </p>

            <p
              v-if="missingPrerequisites"
              class="mt-3 rounded-[7px] bg-[#FDF6D8] px-3 py-2 text-[11px] leading-[17px] text-[#8A6A00]"
            >
              {{ missingPrerequisites }}
            </p>
          </div>

          <footer class="flex justify-end gap-2 border-t border-[#E3E8E5] px-6 py-3">
            <button
              type="button"
              class="h-9 rounded-[8px] border border-[#BFC9C3] bg-white px-4 text-[12px] text-[#181C1B] transition hover:bg-[#F1F4F2] disabled:opacity-50"
              :disabled="submitting"
              @click="emit('close')"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              class="h-9 rounded-[8px] bg-[#1D5C48] px-4 text-[12px] font-medium text-white transition hover:bg-[#174C3B] disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="submitting || !villages.length || !infraTypes.length"
            >
              {{ submitting ? 'กำลังสร้าง…' : 'สร้างโครงการ' }}
            </button>
          </footer>
        </form>
      </div>
    </div>
  </Teleport>
</template>
