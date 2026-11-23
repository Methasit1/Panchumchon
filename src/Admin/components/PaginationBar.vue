<script setup>
import { computed } from 'vue'
import AdminIcon from './icons/AdminIcon.vue'

const props = defineProps({
  total: { type: Number, default: 0 },
  page: { type: Number, default: 1 },
  pageSize: { type: Number, default: 5 },
  standalone: { type: Boolean, default: false },
})

const emit = defineEmits(['update:page'])

const lastPage = computed(() => Math.max(1, Math.ceil(props.total / props.pageSize)))
const safePage = computed(() => Math.min(Math.max(1, props.page), lastPage.value))

const from = computed(() => (props.total === 0 ? 0 : (safePage.value - 1) * props.pageSize + 1))
const to = computed(() => Math.min(safePage.value * props.pageSize, props.total))

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
  <div
    :class="[
      'flex flex-wrap items-center justify-between gap-2 px-4 py-[9px] text-[11px] text-[#505F76]',
      standalone ? '' : 'border-t border-[#E3E8E5]',
    ]"
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
  </div>
</template>
