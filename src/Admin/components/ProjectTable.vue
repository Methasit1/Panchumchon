<script setup>
import { computed } from 'vue'
import { formatNumber } from '@/shared/utils/format'
import { villageLabel } from '@/shared/utils/village'
import PaginationBar from './PaginationBar.vue'
import StatusBadge from './StatusBadge.vue'

const props = defineProps({
  projects: { type: Array, default: () => [] },
  page: { type: Number, default: 1 },
  pageSize: { type: Number, default: 10 },
})

const emit = defineEmits(['update:page'])

const lastPage = computed(() => Math.max(1, Math.ceil(props.projects.length / props.pageSize)))

// กันกรณีตัวกรองเปลี่ยนแล้วหน้าปัจจุบันเกินจำนวนหน้า
const safePage = computed(() => Math.min(Math.max(1, props.page), lastPage.value))

const rows = computed(() => {
  const start = (safePage.value - 1) * props.pageSize
  return props.projects.slice(start, start + props.pageSize)
})
</script>

<template>
  <div>
    <div class="overflow-x-auto">
      <table class="w-full min-w-[760px] border-collapse text-left">
        <thead class="bg-[#F1F4F2] text-[13px] font-medium text-[#505F76]">
          <tr>
            <th scope="col" class="px-4 py-[10px] font-medium">ชื่อโครงการ / วัตถุประสงค์</th>
            <th scope="col" class="w-[180px] px-4 py-[10px] font-medium">พื้นที่ดำเนินงาน</th>
            <th scope="col" class="w-[150px] px-4 py-[10px] text-right font-medium">
              งบประมาณ (บาท)
            </th>
            <th scope="col" class="w-[160px] px-4 py-[10px] font-medium">สถานะโครงการ</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="project in rows"
            :key="project.id"
            class="border-t border-[#E3E8E5] align-top transition hover:bg-[#F8FAFC]"
          >
            <td class="px-4 py-[14px]">
              <p class="text-[15px] font-semibold leading-[19px] text-[#181C1B]">
                {{ project.name }}
              </p>
              <p
                v-if="project.objective"
                class="mt-[3px] line-clamp-2 max-w-[420px] text-[13px] leading-[16px] text-[#505F76]"
              >
                {{ project.objective }}
              </p>
            </td>

            <td class="px-4 py-[14px] text-[13px] leading-[18px] text-[#181C1B]">
              {{ villageLabel(project.villageName) }}
              <span v-if="project.mooNo != null" class="block text-[12px] text-[#505F76]">
                หมู่ที่ {{ project.mooNo }}
              </span>
            </td>

            <td class="px-4 py-[14px] text-right text-[15px] font-semibold leading-[18px]">
              {{ formatNumber(project.budget) }}
            </td>

            <td class="px-4 py-[14px]">
              <StatusBadge :status="project.status" />
            </td>
          </tr>

          <tr v-if="rows.length === 0">
            <td colspan="4" class="border-t border-[#E3E8E5] px-4 py-12 text-center">
              <p class="text-[14px] text-[#505F76]">ไม่พบโครงการตามเงื่อนไขที่เลือก</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <PaginationBar
      :total="projects.length"
      :page="safePage"
      :page-size="pageSize"
      @update:page="emit('update:page', $event)"
    />
  </div>
</template>
