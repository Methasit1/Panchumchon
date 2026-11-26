<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { PROJECT_STATUS, STATUS_SHORT_LABEL } from '@/shared/constants/status'
import { formatNumber } from '@/shared/utils/format'
import { villageLabel } from '@/shared/utils/village'
import AdminIcon from './icons/AdminIcon.vue'

const props = defineProps({
  village: { type: Object, required: true },
  year: { type: Number, required: true },
})

const router = useRouter()

const isEmpty = computed(() => props.village.projectCount === 0)

// แสดงเฉพาะสถานะที่มีจำนวนมากกว่า 0 เรียงตามลำดับความคืบหน้า (BR-13)
const statusSummary = computed(() => {
  const order = [
    PROJECT_STATUS.IN_PROGRESS,
    PROJECT_STATUS.PENDING_APPROVAL,
    PROJECT_STATUS.COMPLETED,
    PROJECT_STATUS.CANCELLED,
  ]

  return order
    .map((status) => ({
      label: STATUS_SHORT_LABEL[status],
      count: props.village.statusCounts[status] ?? 0,
    }))
    .filter((item) => item.count > 0)
})



function openProjects() {
  router.push({
    name: 'admin-projects',
    query: { village: String(props.village.id), year: String(props.year) },
  })
}
</script>

<template>
  <article
    :class="[
      'flex h-full flex-col rounded-[14px] border bg-white p-4',
      isEmpty ? 'border-dashed border-[#BFC9C3]' : 'border-[#BFC9C3]/70',
    ]"
  >
    <div class="flex items-start justify-between gap-2">
      <span class="rounded-[6px] bg-[#F1F4F2] px-2 py-[3px] text-[12px] leading-none text-[#505F76]">
        หมู่ที่ {{ village.mooNo }}
      </span>
      <span class="text-[32px] font-semibold leading-none tracking-tight">
        {{ village.projectCount }}
      </span>
    </div>

    <h3 class="mt-2 text-[19px] font-semibold leading-[24px] text-[#181C1B]">
      {{ villageLabel(village.name) }}
    </h3>
    <p class="mt-[2px] text-[13px] leading-[16px] text-[#505F76]">
      ปีงบประมาณ {{ year }}
    </p>

    <div class="mt-3 border-t border-[#E3E8E5] pt-2 text-[13px] leading-[18px]">
      <div class="flex items-baseline justify-between gap-2">
        <span class="text-[#505F76]">งบประมาณรวมที่จัดสรร:</span>
        <span class="font-semibold text-[#181C1B]">
          {{ formatNumber(village.budget) }}
          <span class="text-[12px] font-normal text-[#505F76]">บาท</span>
        </span>
      </div>

      <div class="mt-1 flex items-baseline justify-between gap-2">
        <span class="text-[#505F76]">สถานะโครงการ:</span>
        <span v-if="statusSummary.length" class="text-right text-[14px] text-[#181C1B]">
          {{ statusSummary.map((item) => `${item.label} ${item.count}`).join(' | ') }}
        </span>
        <span v-else class="text-[12px] italic text-[#707974]">
          ยังไม่มีโครงการในแผนปี {{ year }}
        </span>
      </div>

      <!-- ความคืบหน้าเฉลี่ยถูกตัดออก (ไม่ใช้เปอร์เซ็นต์แล้ว) -->
    </div>

    <div class="mt-auto pt-4">
      <template v-if="!isEmpty">
        <button
          type="button"
          class="flex w-full items-center justify-center gap-2 rounded-[8px] bg-[#EAF2EE] px-3 py-[9px] text-[12px] font-medium leading-none text-[#1D5C48] transition hover:bg-[#DCEBE3] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1D5C48]/30"
          @click="openProjects"
        >
          <AdminIcon name="eye" class="h-4 w-4" />
          ตรวจสอบทั้ง {{ village.projectCount }} โครงการ
        </button>
      </template>

      <template v-else>
        <div
          class="mb-2 flex items-center gap-[6px] rounded-[6px] bg-[#F1F4F2] px-2 py-[6px] text-[10px] leading-[14px] text-[#505F76]"
        >
          <AdminIcon name="info" class="h-3.5 w-3.5 shrink-0" />
          <span>สามารถเสนอก่อการใหม่ให้หมู่บ้านนี้</span>
        </div>
        <button
          type="button"
          class="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-[8px] border border-[#1D5C48] bg-white px-3 py-[8px] text-[12px] font-medium leading-none text-[#1D5C48]"
          disabled
          title="ยังไม่เปิดใช้งานในระบบ (อยู่นอกขอบเขต Proposal ข้อ 15)"
        >
          <AdminIcon name="plus" class="h-4 w-4" />
          เสนอก่อการใหม่ให้หมู่บ้านนี้
        </button>
      </template>
    </div>
  </article>
</template>
