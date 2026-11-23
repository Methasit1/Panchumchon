<script setup>
import { computed } from 'vue'
import { PROJECT_STATUS, STATUS_SHORT_LABEL } from '@/shared/constants/status'
import AdminIcon from './icons/AdminIcon.vue'

const props = defineProps({
  villages: { type: Array, default: () => [] },
  counts: { type: Object, default: () => ({}) },
})

// ตัวกรองเป็นของหน้าแดชบอร์ดเท่านั้น จึงเก็บ state ไว้ใน DashboardView
const villageId = defineModel('villageId', { default: '' })
const status = defineModel('status', { default: '' })
const search = defineModel('search', { default: '' })

// เรียงตามลำดับสถานะจริง (BR-13) ไม่รวมตัวเลือก "ทั้งหมด"
const statusChips = computed(() => [
  { value: '', label: 'ทั้งหมด', count: null },
  ...Object.values(PROJECT_STATUS).map((value) => ({
    value,
    label: STATUS_SHORT_LABEL[value],
    count: props.counts[value] ?? 0,
  })),
])
</script>

<template>
  <div class="rounded-[14px] border border-[#BFC9C3]/70 bg-white px-4 py-3">
    <div class="flex flex-wrap items-center gap-x-2 gap-y-2">
      <span class="text-[12px] font-medium leading-none text-[#181C1B]">เลือกพื้นที่หมู่บ้าน:</span>

      <button
        type="button"
        class="h-7 rounded-[7px] bg-[#1D5C48] px-[10px] text-[12px] font-medium leading-none text-white transition hover:bg-[#174C3B] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1D5C48]/30"
        :aria-pressed="villageId === ''"
        @click="villageId = ''"
      >
        ทั้งหมด
      </button>

      <div class="relative">
        <select
          v-model="villageId"
          class="h-7 min-w-[118px] appearance-none rounded-[7px] border border-[#BFC9C3] bg-white pl-[10px] pr-7 text-[12px] leading-none text-[#181C1B] outline-none focus:border-[#1D5C48] focus:ring-2 focus:ring-[#1D5C48]/10"
        >
          <option value="">เลือกหมู่บ้าน</option>
          <option v-for="village in villages" :key="village.village_id" :value="village.village_id">
            บ้าน{{ village.village_name }} หมู่ {{ village.moo_no }}
          </option>
        </select>
        <AdminIcon
          name="chevron-down"
          class="pointer-events-none absolute right-[6px] top-[6px] h-4 w-4 text-[#505F76]"
        />
      </div>

      <div class="relative ml-auto w-full sm:w-auto">
        <AdminIcon
          name="search"
          class="pointer-events-none absolute left-[9px] top-[9px] h-[14px] w-[14px] text-[#707974]"
        />
        <input
          v-model="search"
          type="search"
          placeholder="ค้นหาด้วยชื่อโครงการ หรือ ชื่อหมู่บ้าน"
          class="h-8 w-full rounded-[7px] border border-[#BFC9C3] bg-white pl-[30px] pr-3 text-[12px] text-[#181C1B] outline-none placeholder:text-[#707974] focus:border-[#1D5C48] focus:ring-2 focus:ring-[#1D5C48]/10 sm:w-[260px]"
        />
      </div>
    </div>

    <div
      class="mt-[10px] flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-[#E3E8E5] pt-[10px]"
    >
      <span class="text-[12px] leading-none text-[#505F76]">สถานะ:</span>
      <button
        v-for="chip in statusChips"
        :key="chip.value"
        type="button"
        :class="[
          'rounded-[6px] px-2 py-[3px] text-[11px] leading-none transition',
          status === chip.value
            ? 'border border-[#1D5C48]/35 bg-[#EAF2EE] font-medium text-[#1D5C48]'
            : 'border border-transparent text-[#505F76] hover:bg-[#F1F4F2]',
        ]"
        :aria-pressed="status === chip.value"
        @click="status = chip.value"
      >
        {{ chip.label
        }}<template v-if="chip.value"> ({{ chip.count }})</template>
      </button>
    </div>
  </div>
</template>
