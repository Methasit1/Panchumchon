<script setup>
import { computed } from 'vue'
import { useTheme } from '@/shared/composables/useTheme'
import AdminIcon from './icons/AdminIcon.vue'

const { theme, toggle } = useTheme()
const isDark = computed(() => theme.value === 'dark')
</script>

<template>
  <button
    type="button"
    :aria-label="isDark ? 'เปลี่ยนเป็นโหมดสว่าง' : 'เปลี่ยนเป็นโหมดมืด'"
    class="flex h-8 w-8 items-center justify-center rounded-[8px] text-[#505F76] transition hover:bg-[#F1F4F2] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1D5C48]/30 dark:text-[#9AA5A0] dark:hover:bg-[#222A33]"
    @click="toggle"
  >
    <AdminIcon :name="isDark ? 'sun' : 'moon'" class="h-[18px] w-[18px]" />
  </button>
</template>
