<script setup>
import { computed, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { logout } from '@/store/auth'
import { MASTER_KINDS, MASTER_ORDER } from '@/shared/constants/masterData'
import logo from '@/assets/logo.png'
import AdminIcon from './icons/AdminIcon.vue'

const route = useRoute()
const router = useRouter()

// เพิ่มหน้าใหม่ในอนาคต = เพิ่มหนึ่งรายการตรงนี้ + child route ใน router
const items = [
  { to: '/admin/dashboard', label: 'แดชบอร์ดภาพรวม', icon: 'dashboard' },
  { to: '/admin/projects', label: 'จัดการโครงการ', icon: 'clipboard' },
  {
    label: 'ข้อมูลพื้นฐาน',
    icon: 'database',
    children: [
      { to: '/admin/villages', label: 'หมู่บ้าน' },
      ...MASTER_ORDER.map((key) => ({
        to: MASTER_KINDS[key].path,
        label: MASTER_KINDS[key].summaryLabel,
      })),
    ],
  },
]

// กลุ่ม "ข้อมูลพื้นฐาน" ครอบคลุมทั้งหมู่บ้านและข้อมูลหลัก
const inSection = computed(
  () =>
    route.path === '/admin/villages' ||
    route.path.startsWith('/admin/villages/') ||
    route.path.startsWith('/admin/master-data'),
)

const open = ref(false)
// กางอัตโนมัติเมื่ออยู่ในกลุ่ม แต่ยังให้ผู้ใช้หุบเองได้ (watch ไม่บังคับปิด)
watch(inSection, (value) => {
  if (value) open.value = true
}, { immediate: true })
function toggleGroup() {
  open.value = !open.value
}

function isChildActive(path) {
  return route.path === path || route.path.startsWith(`${path}/`)
}

function isItemActive(item) {
  return route.path === item.to || route.path.startsWith(`${item.to}/`)
}

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
      <template v-for="item in items" :key="item.label">
        <RouterLink
          v-if="!item.children"
          :to="item.to"
          :aria-current="isItemActive(item) ? 'page' : undefined"
          :class="[
            'flex items-center gap-3 rounded-[10px] px-3 py-[9px] text-[13px] leading-none transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1D5C48]/30',
            isItemActive(item)
              ? 'bg-[#1D5C48] font-medium text-[#9AD9BF]'
              : 'text-[#181C1B] hover:bg-[#F1F4F2]',
          ]"
        >
          <AdminIcon :name="item.icon" class="h-[16px] w-[16px] shrink-0" />
          <span>{{ item.label }}</span>
        </RouterLink>

        <div v-else>
          <button
            type="button"
            :aria-expanded="open"
            class="flex w-full items-center gap-3 rounded-[10px] px-3 py-[9px] text-[13px] leading-none text-[#181C1B] transition hover:bg-[#F1F4F2] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1D5C48]/30"
            @click="toggleGroup"
          >
            <AdminIcon :name="item.icon" class="h-[16px] w-[16px] shrink-0" />
            <span>{{ item.label }}</span>
            <AdminIcon
              name="chevron-down"
              :class="[
                'ml-auto h-[14px] w-[14px] shrink-0 transition-transform',
                open ? 'rotate-180' : '',
              ]"
            />
          </button>

          <div v-if="open" class="mt-[2px] space-y-[2px]">
            <RouterLink
              v-for="child in item.children"
              :key="child.to"
              :to="child.to"
              :aria-current="isChildActive(child.to) ? 'page' : undefined"
              :class="[
                'block rounded-[10px] py-[9px] pl-[40px] pr-3 text-[13px] leading-none transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1D5C48]/30',
                isChildActive(child.to)
                  ? 'bg-[#1D5C48] font-medium text-[#9AD9BF]'
                  : 'text-[#181C1B] hover:bg-[#F1F4F2]',
              ]"
            >
              {{ child.label }}
            </RouterLink>
          </div>
        </div>
      </template>
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