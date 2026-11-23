<script setup>
import { computed } from 'vue'
import { formatNumber } from '@/shared/utils/format'
import AdminIcon from './icons/AdminIcon.vue'
import StatusBadge from './StatusBadge.vue'

const props = defineProps({
  projects: { type: Array, default: () => [] },
  page: { type: Number, default: 1 },
  pageSize: { type: Number, default: 10 },
})

const emit = defineEmits(['update:page'])

const total = computed(() => props.projects.length)
const lastPage = computed(() => Math.max(1, Math.ceil(total.value / props.pageSize)))

// กันกรณีตัวกรองเปลี่ยนแล้วหน้าปัจจุบันเกินจำนวนหน้า
const safePage = computed(() => Math.min(Math.max(1, props.page), lastPage.value))

const rows = computed(() => {
  const start = (safePage.value - 1) * props.pageSize
  return props.projects.slice(start, start + props.pageSize)
})

const from = computed(() => (total.value === 0 ? 0 : (safePage.value - 1) * props.pageSize + 1))
const to = computed(() => Math.min(safePage.value * props.pageSize, total.value))

const visiblePages = computed(() => {
  const windowSize = 5
  let start = Math.max(1, safePage.value - Math.floor(windowSize / 2))
  const end = Math.min(lastPage.value, start + windowSize - 1)
  start = Math.max(1, end - windowSize + 1)
  return Array.from({ length: end - start + 1 }, (_, index) => start + index)
})

function goTo(page) {
  if (page < 1 || page > lastPage.value || page === safePage.value) return
  emit('update:page', page)
}
</script>

<template>
  <div>
    <div class="overflow-x-auto">
      <table class="w-full min-w-[760px] border-collapse text-left">
        <thead class="bg-[#F1F4F2] text-[12px] font-medium text-[#505F76]">
          <tr>
            <th scope="col" class="px-4 py-[9px] font-medium">ชื่อโครงการ / วัตถุประสงค์</th>
            <th scope="col" class="w-[180px] px-4 py-[9px] font-medium">พื้นที่ดำเนินงาน</th>
            <th scope="col" class="w-[150px] px-4 py-[9px] text-right font-medium">
              งบประมาณ (บาท)
            </th>
            <th scope="col" class="w-[160px] px-4 py-[9px] font-medium">สถานะโครงการ</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="project in rows"
            :key="project.id"
            class="border-t border-[#E3E8E5] align-top transition hover:bg-[#F8FAFC]"
          >
            <td class="px-4 py-[14px]">
              <p class="text-[13px] font-semibold leading-[19px] text-[#181C1B]">
                {{ project.name }}
              </p>
              <p
                v-if="project.objective"
                class="mt-[3px] line-clamp-2 max-w-[420px] text-[11px] leading-[16px] text-[#505F76]"
              >
                {{ project.objective }}
              </p>
            </td>

            <td class="px-4 py-[14px] text-[12px] leading-[18px] text-[#181C1B]">
              {{ project.villageName || '—' }}
              <span v-if="project.mooNo != null" class="block text-[11px] text-[#505F76]">
                หมู่ที่ {{ project.mooNo }}
              </span>
            </td>

            <td class="px-4 py-[14px] text-right text-[13px] font-semibold leading-[18px]">
              {{ formatNumber(project.budget) }}
            </td>

            <td class="px-4 py-[14px]">
              <StatusBadge :status="project.status" />
            </td>
          </tr>

          <tr v-if="rows.length === 0">
            <td colspan="4" class="border-t border-[#E3E8E5] px-4 py-12 text-center">
              <p class="text-[12px] text-[#505F76]">ไม่พบโครงการตามเงื่อนไขที่เลือก</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <footer
      class="flex flex-wrap items-center justify-between gap-2 border-t border-[#E3E8E5] px-4 py-[9px] text-[11px] text-[#505F76]"
    >
      <span>แสดง {{ from }} ถึง {{ to }} จากทั้งหมด {{ total }} รายการ</span>

      <div class="flex items-center gap-1">
        <button
          type="button"
          class="flex h-7 w-7 items-center justify-center rounded-[6px] border border-[#BFC9C3] text-[#505F76] transition hover:bg-[#F1F4F2] disabled:cursor-not-allowed disabled:opacity-40"
          :disabled="safePage <= 1"
          aria-label="หน้าก่อนหน้า"
          @click="goTo(safePage - 1)"
        >
          <AdminIcon name="chevron-left" class="h-3.5 w-3.5" />
        </button>

        <button
          v-for="pageNumber in visiblePages"
          :key="pageNumber"
          type="button"
          :class="[
            'h-7 min-w-7 rounded-[6px] px-2 text-[11px] transition',
            pageNumber === safePage
              ? 'bg-[#1D5C48] font-medium text-white'
              : 'border border-[#BFC9C3] text-[#505F76] hover:bg-[#F1F4F2]',
          ]"
          :aria-current="pageNumber === safePage ? 'page' : undefined"
          @click="goTo(pageNumber)"
        >
          {{ pageNumber }}
        </button>

        <button
          type="button"
          class="flex h-7 w-7 items-center justify-center rounded-[6px] border border-[#BFC9C3] text-[#505F76] transition hover:bg-[#F1F4F2] disabled:cursor-not-allowed disabled:opacity-40"
          :disabled="safePage >= lastPage"
          aria-label="หน้าถัดไป"
          @click="goTo(safePage + 1)"
        >
          <AdminIcon name="chevron-right" class="h-3.5 w-3.5" />
        </button>
      </div>
    </footer>
  </div>
</template>
