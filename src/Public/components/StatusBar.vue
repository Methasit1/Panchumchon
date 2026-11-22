<script setup>
import { computed } from 'vue'
import { STATUS_COLOR } from '@/shared/constants/colors'

const props = defineProps({
  status: { type: String, default: '' },
})

// BR-15: สีมาจากสถานะโดยตรง — สถานะที่เอกสารยังไม่กำหนดสีจะไม่แสดงแถบสี
const colorClass = computed(() => STATUS_COLOR[props.status] ?? '')
</script>

<template>
  <div v-if="status" class="flex items-center gap-2 text-sm">
    <span
      v-if="colorClass"
      class="inline-block h-3 w-3 rounded-full border border-slate-300"
      :class="colorClass"
      aria-hidden="true"
    />
    <span>{{ status }}</span>
  </div>
</template>
