<script setup>
import { RouterLink, useRouter } from 'vue-router'
import { logout } from '@/store/auth'
import logo from '@/assets/logo.png'
import AdminIcon from './icons/AdminIcon.vue'

const router = useRouter()

// เพิ่มหน้าใหม่ในอนาคต = เพิ่มหนึ่งรายการตรงนี้ + child route ใน router
const items = [
  { to: '/admin/dashboard', label: 'แดชบอร์ดภาพรวม', icon: 'dashboard' },
  { to: '/admin/projects', label: 'จัดการโครงการ', icon: 'clipboard' },
  { to: '/admin/villages', label: 'หมู่บ้าน', icon: 'home' },
  { to: '/admin/master-data', label: 'ข้อมูลหลัก', icon: 'database' },
]

async function handleLogout() {
  await logout()
  router.push('/admin/login')
}
</script>

<template>
  <aside class="flex-col border-r border-[#BFC9C3]/60 bg-white">
    <div class="flex h-[62px] shrink-0 items-center gap-2 bg-[#1D5C48] px-4 text-white">
      <span class="flex h-[22px] w-[22px] items-center justify-center overflow-hidden rounded-[5px] bg-white/15">
        <img :src="logo" alt="" class="h-[17px] w-[17px] object-contain" />
      </span>
      <span class="text-[14px] font-medium leading-none">แผนชุมชน</span>
    </div>

    <nav class="flex-1 space-y-[2px] overflow-y-auto px-2 py-3" aria-label="เมนูผู้ดูแลระบบ">
      <RouterLink
        v-for="item in items"
        :key="item.to"
        :to="item.to"
        class="flex items-center gap-3 rounded-[8px] px-3 py-[9px] text-[13px] leading-none text-[#181C1B] transition hover:bg-[#F1F4F2] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1D5C48]/30"
        active-class="bg-[#EAF2EE] font-medium text-[#1D5C48] hover:bg-[#EAF2EE]"
      >
        <AdminIcon :name="item.icon" class="h-[16px] w-[16px] shrink-0" />
        <span>{{ item.label }}</span>
      </RouterLink>
    </nav>

    <div class="border-t border-[#BFC9C3]/50 px-2 py-3">
      <button
        type="button"
        class="flex w-full items-center gap-3 rounded-[8px] px-3 py-[9px] text-[13px] leading-none text-[#505F76] transition hover:bg-[#F1F4F2] hover:text-[#181C1B] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1D5C48]/30"
        @click="handleLogout"
      >
        <AdminIcon name="logout" class="h-4 w-4 shrink-0" />
        <span>ออกจากระบบ</span>
      </button>
    </div>
  </aside>
</template>
