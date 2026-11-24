<script setup>
import { computed, ref, watch } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import { displayName } from '@/store/auth'
import logo from '@/assets/logo.png'
import AdminIcon from '@/Admin/components/icons/AdminIcon.vue'
import AdminSidebar from '@/Admin/components/AdminSidebar.vue'
import ThemeToggle from '@/Admin/components/ThemeToggle.vue'

const route = useRoute()
const mobileOpen = ref(false)

const initial = computed(() => {
  const name = displayName.value.trim()
  return name ? name.charAt(0) : 'ผ'
})

watch(
  () => route.fullPath,
  () => {
    mobileOpen.value = false
  },
)
</script>

<template>
  <div class="min-h-screen bg-[#F8FAFC] text-[#181C1B]">
    <header
      class="sticky top-0 z-30 flex h-[58px] items-center justify-between border-b border-[#BFC9C3]/60 bg-white px-4"
    >
      <div class="flex items-center gap-2">
        <button
          type="button"
          class="-ml-1 flex h-8 w-8 items-center justify-center rounded-[8px] text-[#505F76] hover:bg-[#F1F4F2] lg:hidden"
          aria-label="เปิดเมนู"
          @click="mobileOpen = true"
        >
          <AdminIcon name="menu" class="h-5 w-5" />
        </button>
        <img :src="logo" alt="" class="h-[29px] w-[29px]" />
        <span class="text-[14px] leading-none text-[#181C1B]">ระบบติดตามโครงการ</span>
      </div>

      <div class="flex items-center gap-2">
        <ThemeToggle />
        <span class="hidden text-[12px] text-[#505F76] sm:block">{{ displayName }}</span>
        <span
          class="flex h-8 w-8 items-center justify-center rounded-full bg-[#1D5C48] text-[13px] font-medium text-white"
          :title="displayName"
        >
          {{ initial }}
        </span>
      </div>
    </header>

    <div class="flex">
      <AdminSidebar
        class="sticky top-[58px] hidden h-[calc(100vh-58px)] w-[214px] shrink-0 lg:flex"
      />

      <main class="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-7">
        <RouterView />
      </main>
    </div>

    <!-- จอเล็ก: sidebar แบบ drawer -->
    <div v-if="mobileOpen" class="fixed inset-0 z-40 lg:hidden">
      <button
        type="button"
        class="absolute inset-0 bg-black/40"
        aria-label="ปิดเมนู"
        @click="mobileOpen = false"
      />
      <AdminSidebar class="relative flex h-full w-[214px] shadow-xl" />
    </div>
  </div>
</template>
