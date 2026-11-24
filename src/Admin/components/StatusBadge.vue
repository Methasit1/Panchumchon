<script setup>
import { computed } from 'vue'
import { STATUS_LABEL } from '@/shared/constants/status'
import { STATUS_BADGE } from '@/shared/constants/colors'

const props = defineProps({
  status: { type: String, required: true },
})

const badge = computed(
  () => STATUS_BADGE[props.status] ?? { pill: 'bg-[#F1F4F2] text-[#6B7280]', dot: 'bg-[#9AA5A0]' },
)
const label = computed(() => STATUS_LABEL[props.status] ?? props.status)
</script>

<template>
  <span
    :class="[
      'inline-flex items-center gap-[6px] rounded-full px-[12px] py-[6px] text-[12px] font-medium leading-none whitespace-nowrap',
      badge.pill,
    ]"
  >
    <span :class="['h-[7px] w-[7px] shrink-0 rounded-full', badge.dot]" />
    {{ label }}
  </span>
</template>
