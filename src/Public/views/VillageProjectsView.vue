<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import logo from '@/assets/logo.png'
import { PROJECT_STATUS, STATUS_LABEL } from '@/shared/constants/status'
import {
  getCachedProjects,
  getCachedVillage,
  getVillage,
  listProjectsByVillage,
} from '@/services/public'

const route = useRoute()
const villageId = computed(() => String(route.params.villageId ?? ''))

const STATUS_STYLE = {
  [PROJECT_STATUS.PENDING_APPROVAL]: {
    chip: 'bg-[#E2E8F0] text-[#475569]',
    dot: 'bg-[#94A3B8]',
    top: 'bg-[#64748B]',
    bar: 'bg-[#64748B]',
  },
  [PROJECT_STATUS.IN_PROGRESS]: {
    chip: 'bg-[#FEF3C7] text-[#92400E]',
    dot: 'bg-[#F2B705]',
    top: 'bg-[#F2B705]',
    bar: 'bg-[#F2B705]',
  },
  [PROJECT_STATUS.COMPLETED]: {
    chip: 'bg-[#DCFCE7] text-[#166534]',
    dot: 'bg-[#2E9E5B]',
    top: 'bg-[#2E9E5B]',
    bar: 'bg-[#2E9E5B]',
  },
  [PROJECT_STATUS.CANCELLED]: {
    chip: 'bg-[#F3F4F6] text-[#4B5563]',
    dot: 'bg-[#94A3B8]',
    top: 'bg-[#CBD5E1]',
    bar: 'bg-[#94A3B8]',
  },
}

const FILTERS = [
  { id: 'ALL', label: 'ทั้งหมด' },
  { id: PROJECT_STATUS.PENDING_APPROVAL, label: STATUS_LABEL[PROJECT_STATUS.PENDING_APPROVAL] },
  { id: PROJECT_STATUS.IN_PROGRESS, label: STATUS_LABEL[PROJECT_STATUS.IN_PROGRESS] },
  { id: PROJECT_STATUS.COMPLETED, label: STATUS_LABEL[PROJECT_STATUS.COMPLETED] },
  { id: PROJECT_STATUS.CANCELLED, label: STATUS_LABEL[PROJECT_STATUS.CANCELLED] },
]

const activeFilter = ref('ALL')
const village = ref(null)
const projects = ref([])
const loading = ref(true)
const errorMessage = ref('')

const villageName = computed(() => village.value?.name || 'หมู่บ้าน')

const visibleProjects = computed(() => {
  if (activeFilter.value === 'ALL') return projects.value
  return projects.value.filter((project) => project.status === activeFilter.value)
})

function statusStyle(status) {
  return STATUS_STYLE[status] ?? STATUS_STYLE[PROJECT_STATUS.PENDING_APPROVAL]
}

function statusLabel(status) {
  return STATUS_LABEL[status] || 'ไม่ระบุสถานะ'
}

function clampPercent(value) {
  const num = Number(value)
  if (!Number.isFinite(num)) return 0
  return Math.min(100, Math.max(0, num))
}

async function loadData({ force = false } = {}) {
  const id = villageId.value
  if (!id) {
    village.value = null
    projects.value = []
    loading.value = false
    return
  }

  const cachedVillage = getCachedVillage(id)
  const cachedProjects = getCachedProjects(id)
  if (cachedVillage) village.value = cachedVillage
  if (cachedProjects) projects.value = cachedProjects

  const hasData = Boolean(village.value) || projects.value.length > 0
  if (!hasData) loading.value = true
  errorMessage.value = ''

  try {
    const [villageResult, projectsResult] = await Promise.allSettled([
      getVillage(id, { force }),
      listProjectsByVillage(id, { force }),
    ])

    if (villageResult.status === 'fulfilled') {
      village.value = villageResult.value
    }

    if (projectsResult.status === 'fulfilled') {
      projects.value = projectsResult.value
    } else {
      throw projectsResult.reason
    }

    if (villageResult.status === 'rejected' && !village.value) {
      // Village name is helpful but not required to show projects.
      console.warn('Failed to load village', villageResult.reason)
    }
  } catch (error) {
    errorMessage.value = error?.message || 'ไม่สามารถโหลดรายการโครงการได้'
    if (!hasData) projects.value = []
  } finally {
    loading.value = false
  }
}

watch(villageId, () => {
  activeFilter.value = 'ALL'
  village.value = getCachedVillage(villageId.value)
  projects.value = getCachedProjects(villageId.value) ?? []
  loadData()
})

onMounted(() => loadData())
</script>

<template>
  <div class="min-h-screen bg-[#F8FAFC] text-[#181C1B]">
    <header class="sticky top-0 z-20 border-b border-[#BFC9C3]/60 bg-white/90 backdrop-blur-[4px]">
      <div class="mx-auto flex h-[58px] w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <RouterLink to="/public/villages" class="flex min-w-0 items-center gap-[7px]">
          <img :src="logo" alt="" class="h-[29px] w-[29px] shrink-0" />
          <span class="truncate text-[14px] font-normal leading-none text-[#181C1B] sm:text-[15px]">
            ระบบติดตามโครงการ
          </span>
        </RouterLink>

        <RouterLink
          to="/admin/login"
          class="inline-flex h-[34px] shrink-0 items-center justify-center rounded-[8px] bg-[#1D5C48] px-3 text-[12px] font-medium leading-none text-white transition hover:bg-[#174C3B] focus:outline-none focus:ring-2 focus:ring-[#1D5C48]/30 focus:ring-offset-2 sm:px-4 sm:text-[13px]"
        >
          สำหรับเจ้าหน้าที่
        </RouterLink>
      </div>
    </header>

    <main class="mx-auto w-full max-w-6xl px-4 pb-10 pt-5 sm:px-6 sm:pt-8 lg:px-8">
      <div class="flex flex-col items-start gap-4">
        <RouterLink
          to="/public/villages"
          class="inline-flex items-center gap-2 rounded-md text-[15px] font-medium text-[#004432] transition hover:text-[#1D5C48] focus:outline-none focus:ring-2 focus:ring-[#1D5C48]/20"
        >
          <svg viewBox="0 0 24 24" class="h-5 w-5 shrink-0" fill="none" aria-hidden="true">
            <path
              d="M19 12H5m0 0l6 6m-6-6l6-6"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span>กลับไปหน้าหมู่บ้าน</span>
        </RouterLink>

        <h1 class="w-full truncate text-[24px] font-semibold leading-tight text-[#181C1B] sm:text-[30px]">
          {{ villageName }}
        </h1>
      </div>

      <div class="mt-5 flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible">
        <button
          v-for="filter in FILTERS"
          :key="filter.id"
          type="button"
          class="shrink-0 rounded-full border px-3 py-1.5 text-[12px] font-medium transition focus:outline-none focus:ring-2 focus:ring-[#1D5C48]/20 sm:text-[13px]"
          :class="
            activeFilter === filter.id
              ? 'border-[#1D5C48] bg-[#E8F0EA] text-[#1D5C48]'
              : 'border-[#BFC9C3] bg-white text-[#505F76] hover:border-[#1D5C48]/40 hover:text-[#1D5C48]'
          "
          @click="activeFilter = filter.id"
        >
          {{ filter.label }}
        </button>
      </div>

      <div class="mt-4 flex items-center justify-between gap-3">
        <p class="text-[13px] text-[#505F76]">
          <span v-if="loading">กำลังโหลดโครงการ...</span>
          <span v-else>พบ {{ visibleProjects.length }} โครงการ</span>
        </p>
        <button
          v-if="!loading"
          type="button"
          class="text-[13px] font-medium text-[#1D5C48] hover:underline"
          @click="loadData({ force: true })"
        >
          รีเฟรช
        </button>
      </div>

      <div
        v-if="errorMessage"
        class="mt-4 rounded-[12px] border border-red-200 bg-red-50 px-4 py-3 text-[14px] text-red-700"
        role="alert"
      >
        <p>{{ errorMessage }}</p>
        <button
          type="button"
          class="mt-2 rounded border border-red-300 px-3 py-1 text-[12px] font-medium text-red-700 hover:bg-red-100"
          @click="loadData({ force: true })"
        >
          ลองใหม่
        </button>
      </div>

      <div v-else-if="loading" class="mt-4 grid gap-4 lg:grid-cols-2" aria-hidden="true">
        <div v-for="n in 4" :key="n" class="h-[220px] animate-pulse rounded-[12px] border border-[#BFC9C3]/70 bg-white" />
      </div>

      <p
        v-else-if="visibleProjects.length === 0"
        class="mt-4 rounded-[12px] border border-[#BFC9C3] bg-white px-4 py-8 text-center text-[14px] text-[#505F76]"
      >
        <span v-if="projects.length === 0">ยังไม่มีโครงการในหมู่บ้านนี้</span>
        <span v-else>ไม่พบโครงการในสถานะที่เลือก</span>
      </p>

      <div v-else class="mt-4 grid gap-4 lg:grid-cols-2">
        <article
          v-for="project in visibleProjects"
          :key="project.id"
          class="overflow-hidden rounded-[12px] border border-[#BFC9C3] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
        >
          <div class="h-1 w-full" :class="statusStyle(project.status).top" aria-hidden="true" />

          <div class="p-4 sm:p-5">
            <div class="flex flex-wrap items-center gap-2">
              <span
                class="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[12px] font-medium"
                :class="statusStyle(project.status).chip"
              >
                <span class="h-1.5 w-1.5 rounded-full" :class="statusStyle(project.status).dot" aria-hidden="true" />
                {{ statusLabel(project.status) }}
              </span>
              <span v-if="project.planYear" class="text-[12px] text-[#707974]">ปีแผน {{ project.planYear }}</span>
            </div>

            <h2 class="mt-3 text-[18px] font-semibold leading-7 text-[#181C1B]">
              {{ project.name }}
            </h2>

            <p v-if="project.objective" class="mt-2 line-clamp-3 text-[14px] leading-6 text-[#505F76]">
              {{ project.objective }}
            </p>

            <div class="mt-4">
              <div class="mb-1.5 flex items-center justify-between text-[12px] text-[#505F76]">
                <span>ความคืบหน้า</span>
                <span class="font-medium text-[#181C1B]">{{ clampPercent(project.progressPercent) }}%</span>
              </div>
              <div class="h-2 overflow-hidden rounded-full bg-[#E5E7EB]" role="progressbar" :aria-valuenow="clampPercent(project.progressPercent)" aria-valuemin="0" aria-valuemax="100">
                <div
                  class="h-full rounded-full transition-all"
                  :class="statusStyle(project.status).bar"
                  :style="{ width: `${clampPercent(project.progressPercent)}%` }"
                />
              </div>
            </div>

            <div class="mt-4 flex justify-end border-t border-[#E5E7EB] pt-3">
              <RouterLink
                :to="{ name: 'public-project-detail', params: { projectId: project.id } }"
                class="inline-flex items-center gap-1 text-[14px] font-medium text-[#1D5C48] transition hover:text-[#174C3B] focus:outline-none focus:ring-2 focus:ring-[#1D5C48]/20 rounded"
              >
                ดูรายละเอียด
                <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" aria-hidden="true">
                  <path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </RouterLink>
            </div>
          </div>
        </article>
      </div>
    </main>
  </div>
</template>
