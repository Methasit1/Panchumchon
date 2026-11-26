<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { currentBuddhistYear } from '@/shared/utils/buddhistYear'
import { MANAGE_PAGE_SIZE, STATUS_SORT_ORDER } from '@/shared/constants/project'
import { PROJECT_STATUS } from '@/shared/constants/status'
import {
  cancelProject,
  completeProject,
  createProject,
  fetchManageProjects,
  getStartBlockers,
  softDeleteProject,
  startProject,
} from '@/services/projects'
import { fetchInfraTypeOptions, fetchVillageOptions } from '@/services/lookups'
import AdminIcon from '@/Admin/components/icons/AdminIcon.vue'
import CancelProjectDialog from '@/Admin/components/CancelProjectDialog.vue'
import ConfirmDialog from '@/Admin/components/ConfirmDialog.vue'
import CreateProjectModal from '@/Admin/components/CreateProjectModal.vue'
import EmptyState from '@/Admin/components/EmptyState.vue'
import FilterBar from '@/Admin/components/FilterBar.vue'
import PaginationBar from '@/Admin/components/PaginationBar.vue'
import ProjectManageCard from '@/Admin/components/ProjectManageCard.vue'
import StartBlockersDialog from '@/Admin/components/StartBlockersDialog.vue'

const route = useRoute()
const router = useRouter()

const year = currentBuddhistYear()

const projects = ref([])
const villages = ref([])
const infraTypes = ref([])
const loading = ref(true)
const error = ref('')

const villageId = ref('')
const status = ref('')
const search = ref('')
const page = ref(1)

const createOpen = ref(false)
const creating = ref(false)
const createError = ref('')

const confirmAction = ref(null) // { type: 'start' | 'complete' | 'delete', project }
const cancelTarget = ref(null)
const blockers = ref(null) // { project, items }
const busy = ref(false)
const actionError = ref('')

const notice = ref('')
let noticeTimer = null

const counts = computed(() => {
  const result = {
    [PROJECT_STATUS.PENDING_APPROVAL]: 0,
    [PROJECT_STATUS.IN_PROGRESS]: 0,
    [PROJECT_STATUS.COMPLETED]: 0,
    [PROJECT_STATUS.CANCELLED]: 0,
  }
  for (const project of projects.value) {
    if (result[project.status] !== undefined) result[project.status] += 1
  }
  return result
})

const filteredProjects = computed(() => {
  const keyword = search.value.trim().toLowerCase()
  const filterVillage = villageId.value === '' ? null : Number(villageId.value)

  return projects.value.filter((project) => {
    if (filterVillage !== null && project.villageId !== filterVillage) return false
    if (status.value && project.status !== status.value) return false

    if (keyword) {
      const haystack = [project.name, project.villageName, project.code]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      if (!haystack.includes(keyword)) return false
    }

    return true
  })
})

// เรียงตามลำดับสถานะที่ใช้ในดีไซน์ แล้วตามวันที่สร้าง
const sortedProjects = computed(() =>
  [...filteredProjects.value].sort((a, b) => {
    const statusDiff = (STATUS_SORT_ORDER[a.status] ?? 9) - (STATUS_SORT_ORDER[b.status] ?? 9)
    if (statusDiff !== 0) return statusDiff
    return String(a.createdAt).localeCompare(String(b.createdAt))
  }),
)

const lastPage = computed(() => Math.max(1, Math.ceil(sortedProjects.value.length / MANAGE_PAGE_SIZE)))
const safePage = computed(() => Math.min(Math.max(1, page.value), lastPage.value))

const pagedProjects = computed(() => {
  const start = (safePage.value - 1) * MANAGE_PAGE_SIZE
  return sortedProjects.value.slice(start, start + MANAGE_PAGE_SIZE)
})

watch([villageId, status, search], () => {
  page.value = 1
})

watch(
  () => route.query.create,
  (value) => {
    if (value === '1') createOpen.value = true
  },
  { immediate: true },
)

function showNotice(message) {
  notice.value = message
  if (noticeTimer) clearTimeout(noticeTimer)
  noticeTimer = setTimeout(() => {
    notice.value = ''
  }, 4000)
}

async function loadProjects() {
  error.value = ''
  try {
    projects.value = await fetchManageProjects(year)
  } catch (err) {
    error.value = err.message
    projects.value = []
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  if (route.query.create === '1') createOpen.value = true

  try {
    const [villageList, infraTypeList] = await Promise.all([
      fetchVillageOptions(),
      fetchInfraTypeOptions(),
    ])
    villages.value = villageList
    infraTypes.value = infraTypeList
  } catch (err) {
    error.value = err.message
  }

  await loadProjects()
})

onBeforeUnmount(() => {
  if (noticeTimer) clearTimeout(noticeTimer)
})

function openCreate() {
  createError.value = ''
  createOpen.value = true
}

function closeCreate() {
  if (creating.value) return
  createOpen.value = false
  createError.value = ''
  if (route.query.create) {
    const query = { ...route.query }
    delete query.create
    router.replace({ query })
  }
}

async function handleCreate(payload) {
  creating.value = true
  createError.value = ''
  try {
    await createProject(payload)
    await loadProjects()
    showNotice('สร้างการ์ดโครงการเรียบร้อยแล้ว — เผยแพร่ในสถานะรออนุมัติแผนงาน')
    createOpen.value = false
    if (route.query.create) {
      const query = { ...route.query }
      delete query.create
      router.replace({ query })
    }
  } catch (err) {
    createError.value = err.message
  } finally {
    creating.value = false
  }
}

function openEdit(project) {
  router.push(`/admin/projects/${project.id}`)
}

function openView(project) {
  router.push(`/admin/projects/${project.id}?mode=view`)
}

function handleStart(project) {
  const items = getStartBlockers(project)
  if (items.length) {
    blockers.value = { project, items }
    return
  }
  confirmAction.value = { type: 'start', project }
}

function handleComplete(project) {
  confirmAction.value = { type: 'complete', project }
}

function handleCancel(project) {
  cancelTarget.value = project
  actionError.value = ''
}

function handleDelete(project) {
  confirmAction.value = { type: 'delete', project }
}

const confirmText = computed(() => {
  const action = confirmAction.value
  if (!action) return null

  if (action.type === 'start') {
    return {
      title: 'เริ่มดำเนินการโครงการ',
      message: `${action.project.name}\nระบบจะเปลี่ยนสถานะเป็น "กำลังดำเนินการ"`,
      confirmLabel: 'เริ่มดำเนินการ',
      tone: 'primary',
    }
  }
  if (action.type === 'complete') {
    return {
      title: 'เสร็จสิ้นโครงการ',
      message: `${action.project.name}\nระบบจะเปลี่ยนสถานะเป็น "เสร็จสิ้นโครงการ" และล็อกข้อมูลแท็บ 1–3 (BR-24)`,
      confirmLabel: 'ยืนยันเสร็จสิ้น',
      tone: 'primary',
    }
  }
  return {
    title: 'ลบโครงการ',
    message: `${action.project.name}\nใช้เฉพาะกรณีลงข้อมูลผิด โครงการจะหายจากระบบและประชาชนจะไม่เห็นข้อมูลนี้ (BR-18)`,
    confirmLabel: 'ยืนยันลบ',
    tone: 'danger',
  }
})

async function confirmActionRun() {
  const action = confirmAction.value
  if (!action) return

  busy.value = true
  actionError.value = ''
  try {
    if (action.type === 'start') {
      await startProject(action.project.id)
      showNotice(`เริ่มดำเนินการ "${action.project.name}" แล้ว (ความคืบหน้า 1%)`)
    } else if (action.type === 'complete') {
      await completeProject(action.project.id)
      showNotice(`ปิดโครงการ "${action.project.name}" เป็นเสร็จสิ้นแล้ว`)
    } else {
      await softDeleteProject(action.project.id)
      showNotice(`ลบโครงการ "${action.project.name}" แล้ว`)
    }
    confirmAction.value = null
    await loadProjects()
  } catch (err) {
    actionError.value = err.message
    confirmAction.value = null
  } finally {
    busy.value = false
  }
}

async function confirmCancel(reason) {
  busy.value = true
  actionError.value = ''
  try {
    await cancelProject(cancelTarget.value.id, reason)
    showNotice(`ยกเลิกโครงการ "${cancelTarget.value.name}" แล้ว`)
    cancelTarget.value = null
    await loadProjects()
  } catch (err) {
    actionError.value = err.message
  } finally {
    busy.value = false
  }
}

function goToForm(project) {
  blockers.value = null
  router.push(`/admin/projects/${project.id}`)
}
</script>

<template>
  <section class="text-[#181C1B]">
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 class="text-[20px] font-semibold leading-[28px]">จัดการโครงการ</h1>
        <p class="mt-[2px] text-[11px] leading-[17px] text-[#505F76]">
          บริหารจัดการสถานะ ติดตามความคืบหน้า และควบคุมโครงการโครงสร้างพื้นฐานทุกหมู่บ้าน
        </p>
      </div>

      <button
        type="button"
        class="flex h-9 items-center gap-2 rounded-[8px] bg-[#1D5C48] px-4 text-[13px] font-medium text-white transition hover:bg-[#174C3B] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1D5C48]/30"
        @click="openCreate"
      >
        <AdminIcon name="plus" class="h-4 w-4" />
        สร้างโครงการใหม่
      </button>
    </div>

    <p
      v-if="notice"
      role="status"
      class="mt-3 rounded-[8px] border border-[#1D5C48]/30 bg-[#EAF2EE] px-4 py-2 text-[12px] text-[#1D5C48]"
    >
      {{ notice }}
    </p>

    <p
      v-if="error || actionError"
      role="alert"
      class="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-[8px] border border-red-200 bg-red-50 px-4 py-2 text-[12px] text-red-700"
    >
      <span>{{ error || actionError }}</span>
      <button
        type="button"
        class="rounded-[6px] border border-red-300 px-2 py-1 text-[11px] hover:bg-red-100"
        @click="loadProjects"
      >
        ลองอีกครั้ง
      </button>
    </p>

    <FilterBar
      v-model:village-id="villageId"
      v-model:status="status"
      v-model:search="search"
      :villages="villages"
      :counts="counts"
      class="mt-3"
    />

    <div class="mt-3 space-y-3">
      <template v-if="loading">
        <div
          v-for="index in 3"
          :key="index"
          class="h-[150px] animate-pulse rounded-[14px] border border-[#BFC9C3]/50 bg-white"
        />
      </template>

      <template v-else-if="pagedProjects.length">
        <ProjectManageCard
          v-for="project in pagedProjects"
          :key="project.id"
          :project="project"
          @edit="openEdit"
          @view="openView"
          @start="handleStart"
          @complete="handleComplete"
          @cancel="handleCancel"
          @delete="handleDelete"
        />
      </template>

      <EmptyState
        v-else-if="projects.length === 0"
        :title="`ยังไม่มีโครงการในแผนปี ${year}`"
        description="เริ่มสร้างการ์ดโครงการเพื่อให้ประชาชนติดตามความคืบหน้าได้ทันที"
      >
        <button
          type="button"
          class="flex h-9 items-center gap-2 rounded-[8px] bg-[#1D5C48] px-4 text-[12px] font-medium text-white transition hover:bg-[#174C3B]"
          @click="openCreate"
        >
          <AdminIcon name="plus" class="h-4 w-4" />
          สร้างโครงการใหม่
        </button>
      </EmptyState>

      <EmptyState
        v-else
        title="ไม่พบโครงการตามเงื่อนไข"
        description="ลองเปลี่ยนหมู่บ้าน สถานะ หรือคำค้นหา"
      />
    </div>

    <div v-if="!loading && sortedProjects.length" class="mt-3 rounded-[14px] border border-[#BFC9C3]/70 bg-white">
      <PaginationBar
        v-model:page="page"
        :total="sortedProjects.length"
        :page-size="MANAGE_PAGE_SIZE"
        standalone
      />
    </div>

    <!-- Modal สร้างการ์ด -->
    <CreateProjectModal
      v-if="createOpen"
      :villages="villages"
      :infra-types="infraTypes"
      :default-year="year"
      :submitting="creating"
      :error="createError"
      @close="closeCreate"
      @submit="handleCreate"
    />

    <!-- ยืนยัน เริ่ม / เสร็จสิ้น / ลบ -->
    <ConfirmDialog
      v-if="confirmAction"
      :title="confirmText.title"
      :message="confirmText.message"
      :confirm-label="confirmText.confirmLabel"
      :tone="confirmText.tone"
      :loading="busy"
      @cancel="confirmAction = null"
      @confirm="confirmActionRun"
    />

    <!-- ยกเลิกโครงการ -->
    <CancelProjectDialog
      v-if="cancelTarget"
      :project-name="cancelTarget.name"
      :loading="busy"
      :error="actionError"
      @cancel="cancelTarget = null"
      @confirm="confirmCancel"
    />

    <!-- ข้อมูลไม่ครบก่อนเริ่มดำเนินการ -->
    <StartBlockersDialog
      v-if="blockers"
      :project-name="blockers.project.name"
      :blockers="blockers.items"
      @close="blockers = null"
      @go-to-form="goToForm(blockers.project)"
    />
  </section>
</template>
