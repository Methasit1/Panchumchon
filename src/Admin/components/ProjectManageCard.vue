<script setup>
import { computed, ref } from 'vue'
import { PROJECT_STATUS } from '@/shared/constants/status'
import { PROJECT_STATUS_GUIDE } from '@/shared/constants/project'
import { formatThaiDate } from '@/shared/utils/thaiDate'
import { villageLabel } from '@/shared/utils/village'
import AdminIcon from './icons/AdminIcon.vue'
import StatusBadge from './StatusBadge.vue'

const props = defineProps({
  project: { type: Object, required: true },
})

const emit = defineEmits(['start', 'complete', 'cancel', 'delete', 'edit', 'view'])

const menuOpen = ref(false)

const isLocked = computed(
  () =>
    props.project.status === PROJECT_STATUS.COMPLETED ||
    props.project.status === PROJECT_STATUS.CANCELLED,
)

const canCancel = computed(
  () =>
    props.project.status === PROJECT_STATUS.PENDING_APPROVAL ||
    props.project.status === PROJECT_STATUS.IN_PROGRESS,
)

// BR-18: ลบได้เฉพาะโครงการที่ยังรออนุมัติ
const canDelete = computed(() => props.project.status === PROJECT_STATUS.PENDING_APPROVAL)

const isLate = computed(
  () =>
    props.project.plan?.actualEnd &&
    props.project.plan?.plannedEnd &&
    props.project.plan.actualEnd > props.project.plan.plannedEnd,
)

const guide = computed(() => PROJECT_STATUS_GUIDE[props.project.status] ?? '')

function run(action) {
  menuOpen.value = false
  if (action === 'view') emit('view', props.project)
  else if (action === 'edit') emit('edit', props.project)
  else emit(action, props.project)
}
</script>

<template>
  <article class="rounded-[14px] border border-[#BFC9C3]/70 bg-white px-5 py-4">
    <div class="flex flex-wrap items-start justify-between gap-2">
      <div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] leading-[18px]">
        <span class="flex items-center gap-[5px] font-medium text-[#181C1B]">
          <AdminIcon name="pin" class="h-[13px] w-[13px] text-[#505F76]" />
          {{ villageLabel(project.villageName) }} หมู่ {{ project.mooNo }}
        </span>
        <span class="text-[#BFC9C3]" aria-hidden="true">•</span>
        <span class="flex items-center gap-[5px] text-[#505F76]">
          <AdminIcon name="layers" class="h-[13px] w-[13px]" />
          ประเภท: {{ project.typeName || '—' }}
        </span>
        <span v-if="project.code" class="text-[#BFC9C3]" aria-hidden="true">•</span>
        <span v-if="project.code" class="text-[#707974]">{{ project.code }}</span>
      </div>

      <div class="flex flex-wrap items-center gap-1.5">
        <span
          v-if="isLate"
          class="inline-flex items-center rounded-full bg-[#FEE2E2] px-[10px] py-[5px] text-[10px] font-medium leading-none text-[#B91C1C]"
        >
          เสร็จสิ้นล่าช้า
        </span>
        <StatusBadge :status="project.status" />
      </div>
    </div>

    <h3 class="mt-3 text-[17px] font-semibold leading-[24px] text-[#181C1B]">
      {{ project.name }}
    </h3>

    <p
      v-if="project.status === PROJECT_STATUS.CANCELLED && project.cancelReason"
      class="mt-1 text-[11px] leading-[17px] text-[#B91C1C]"
    >
      เหตุผลการยกเลิก: {{ project.cancelReason }}
    </p>

    <p
      v-else-if="guide"
      class="mt-[6px] flex items-start gap-[5px] text-[11px] leading-[17px] text-[#707974]"
    >
      <span class="mt-[1px] shrink-0" aria-hidden="true">ⓘ</span>
      <span>{{ guide }}</span>
    </p>

    <p
      v-if="project.status === PROJECT_STATUS.COMPLETED && project.plan?.actualEnd"
      class="mt-3 text-[11px] leading-[17px] text-[#181C1B]"
    >
      วันที่ส่งมอบงาน: {{ formatThaiDate(project.plan.actualEnd) }}
    </p>

    <div class="mt-3 flex flex-wrap items-center justify-end gap-2 border-t border-[#E3E8E5] pt-3">
      <p
        v-if="isLocked"
        class="mr-auto flex items-center gap-[5px] text-[11px] leading-[17px] text-[#707974]"
      >
        <AdminIcon name="lock" class="h-[13px] w-[13px]" />
        ล็อก: แก้ไขไม่ได้แล้ว
      </p>

      <div class="relative">
        <button
          type="button"
          class="flex h-8 items-center gap-1 rounded-[7px] border border-[#BFC9C3] bg-white px-3 text-[12px] text-[#181C1B] transition hover:bg-[#F1F4F2]"
          aria-label="การจัดการ"
          :aria-expanded="menuOpen"
          @click="menuOpen = !menuOpen"
        >
          การจัดการ
          <AdminIcon name="chevron-down" class="h-3.5 w-3.5" />
        </button>

        <template v-if="menuOpen">
          <button
            type="button"
            class="fixed inset-0 z-10 cursor-default"
            aria-label="ปิดเมนู"
            @click="menuOpen = false"
          />
          <div
            class="absolute right-0 top-[36px] z-20 w-[180px] overflow-hidden rounded-[8px] border border-[#BFC9C3] bg-white py-1 shadow-[0_8px_20px_rgba(15,23,42,0.12)]"
          >
            <button
              type="button"
              class="block w-full px-3 py-[7px] text-left text-[12px] text-[#181C1B] hover:bg-[#F1F4F2]"
              @click="run('view')"
            >
              ดูรายละเอียด
            </button>
            <button
              v-if="!isLocked"
              type="button"
              class="block w-full px-3 py-[7px] text-left text-[12px] text-[#181C1B] hover:bg-[#F1F4F2]"
              @click="run('edit')"
            >
              แก้ไขโครงการ
            </button>
            <button
              v-if="canCancel"
              type="button"
              class="block w-full px-3 py-[7px] text-left text-[12px] text-[#B91C1C] hover:bg-[#FEF2F2]"
              @click="run('cancel')"
            >
              ยกเลิกโครงการ
            </button>
            <button
              v-if="canDelete"
              type="button"
              class="block w-full px-3 py-[7px] text-left text-[12px] text-[#B91C1C] hover:bg-[#FEF2F2]"
              @click="run('delete')"
            >
              ลบโครงการ
            </button>
          </div>
        </template>
      </div>

      <button
        v-if="project.status === PROJECT_STATUS.PENDING_APPROVAL"
        type="button"
        class="h-8 rounded-[7px] bg-[#1D5C48] px-3 text-[12px] font-medium text-white transition hover:bg-[#174C3B]"
        @click="run('start')"
      >
        เริ่มดำเนินการ
      </button>
      <button
        v-else-if="project.status === PROJECT_STATUS.IN_PROGRESS"
        type="button"
        class="h-8 rounded-[7px] bg-[#1D5C48] px-3 text-[12px] font-medium text-white transition hover:bg-[#174C3B]"
        @click="run('complete')"
      >
        เสร็จสิ้นโครงการ
      </button>

      <p
        v-if="isLocked"
        class="mr-auto flex items-center gap-[5px] text-[11px] leading-[17px] text-[#707974]"
      >
        <AdminIcon name="lock" class="h-[13px] w-[13px]" />
        ล็อก: แก้ไขไม่ได้แล้ว
      </p>
    </div>
  </article>
</template>
