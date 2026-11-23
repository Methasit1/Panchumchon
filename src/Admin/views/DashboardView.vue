<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { fetchDashboardData, fetchPlanYears, summarize } from '@/services/dashboard'
import { currentBuddhistYear } from '@/shared/utils/buddhistYear'
import { formatNumber } from '@/shared/utils/format'
import { PROJECT_STATUS, STATUS_LABEL } from '@/shared/constants/status'
import { STATUS_DOT } from '@/shared/constants/colors'
import AdminIcon from '@/Admin/components/icons/AdminIcon.vue'
import FilterBar from '@/Admin/components/FilterBar.vue'
import ProjectTable from '@/Admin/components/ProjectTable.vue'
import StatCard from '@/Admin/components/StatCard.vue'
import VillageSummaryCard from '@/Admin/components/VillageSummaryCard.vue'

const PAGE_SIZE = 10

const years = ref([currentBuddhistYear()])
const selectedYear = ref(currentBuddhistYear())
const projects = ref([])
const villages = ref([])
const loading = ref(true)
const error = ref('')

// ตัวกรอง (client-side) — ตัวเลข KPI ยังอิงข้อมูลทั้งปีตามดีไซน์
const villageId = ref('')
const status = ref('')
const search = ref('')
const page = ref(1)

const stats = computed(() => summarize(projects.value, villages.value))

const kpiCards = computed(() => {
  const { totalProjects, counts, totalBudget } = stats.value

  return [
    { label: 'โครงการทั้งหมด', value: formatNumber(totalProjects), unit: 'โครงการ' },
    {
      label: STATUS_LABEL[PROJECT_STATUS.PENDING_APPROVAL],
      value: formatNumber(counts[PROJECT_STATUS.PENDING_APPROVAL]),
      unit: 'โครงการ',
      dot: STATUS_DOT[PROJECT_STATUS.PENDING_APPROVAL],
    },
    {
      label: STATUS_LABEL[PROJECT_STATUS.IN_PROGRESS],
      value: formatNumber(counts[PROJECT_STATUS.IN_PROGRESS]),
      unit: 'โครงการ',
      dot: STATUS_DOT[PROJECT_STATUS.IN_PROGRESS],
    },
    {
      label: STATUS_LABEL[PROJECT_STATUS.COMPLETED],
      value: formatNumber(counts[PROJECT_STATUS.COMPLETED]),
      unit: 'โครงการ',
      dot: STATUS_DOT[PROJECT_STATUS.COMPLETED],
    },
    {
      label: STATUS_LABEL[PROJECT_STATUS.CANCELLED],
      value: formatNumber(counts[PROJECT_STATUS.CANCELLED]),
      unit: 'โครงการ',
      dot: STATUS_DOT[PROJECT_STATUS.CANCELLED],
    },
    {
      label: 'งบประมาณรวม',
      value: formatNumber(totalBudget),
      unit: 'บาท',
      hint: `(ปีงบ ${selectedYear.value})`,
      accent: true,
    },
  ]
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

async function loadDashboard(year) {
  loading.value = true
  error.value = ''

  try {
    const data = await fetchDashboardData(year)
    projects.value = data.projects
    villages.value = data.villages
  } catch (err) {
    error.value = err.message
    projects.value = []
    villages.value = []
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  try {
    const list = await fetchPlanYears()
    // BR-28: แสดงเฉพาะปีที่มีข้อมูล — ถ้ายังไม่มีข้อมูลเลยให้ใช้ปีปัจจุบัน (พ.ศ.)
    years.value = list.length ? list : [currentBuddhistYear()]

    const nextYear = years.value.includes(currentBuddhistYear())
      ? currentBuddhistYear()
      : years.value[0]

    if (nextYear === selectedYear.value) {
      await loadDashboard(nextYear)
    } else {
      selectedYear.value = nextYear // watch ด้านล่างจะโหลดข้อมูลให้เอง
    }
  } catch (err) {
    error.value = err.message
    loading.value = false
  }
})

watch(selectedYear, (year) => {
  page.value = 1
  loadDashboard(year)
})

watch([villageId, status, search], () => {
  page.value = 1
})
</script>

<template>
  <section class="text-[#181C1B]">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <h1 class="text-[20px] font-semibold leading-[28px]">
        แดชบอร์ดภาพรวมการพัฒนาโครงสร้างพื้นฐาน
      </h1>

      <div class="relative">
        <label for="dashboard-year" class="sr-only">ปีงบประมาณ</label>
        <select
          id="dashboard-year"
          v-model.number="selectedYear"
          class="h-9 appearance-none rounded-[8px] border border-[#BFC9C3] bg-white pl-3 pr-8 text-[12px] text-[#181C1B] outline-none focus:border-[#1D5C48] focus:ring-2 focus:ring-[#1D5C48]/10"
        >
          <option v-for="year in years" :key="year" :value="year">ปีงบประมาณ {{ year }}</option>
        </select>
        <AdminIcon
          name="chevron-down"
          class="pointer-events-none absolute right-2 top-[10px] h-4 w-4 text-[#505F76]"
        />
      </div>
    </div>

    <p
      v-if="error"
      role="alert"
      class="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-[10px] border border-red-200 bg-red-50 px-4 py-3 text-[12px] text-red-700"
    >
      <span>โหลดข้อมูลไม่สำเร็จ: {{ error }}</span>
      <button
        type="button"
        class="rounded-[6px] border border-red-300 px-2 py-1 text-[11px] font-medium hover:bg-red-100"
        @click="loadDashboard(selectedYear)"
      >
        ลองอีกครั้ง
      </button>
    </p>

    <!-- KPI -->
    <div class="mt-4 grid grid-cols-2 gap-[10px] sm:grid-cols-3 xl:grid-cols-6">
      <template v-if="loading && projects.length === 0">
        <div
          v-for="index in 6"
          :key="index"
          class="h-[92px] animate-pulse rounded-[12px] border border-[#BFC9C3]/50 bg-white"
        />
      </template>
      <template v-else>
        <StatCard v-for="card in kpiCards" :key="card.label" v-bind="card" />
      </template>
    </div>

    <FilterBar
      v-model:village-id="villageId"
      v-model:status="status"
      v-model:search="search"
      :villages="villages"
      :counts="stats.counts"
      class="mt-4"
    />

    <section class="mt-4 rounded-[14px] border border-[#BFC9C3]/70 bg-white">
      <header class="flex items-center gap-2 px-4 py-3">
        <AdminIcon name="table" class="h-4 w-4 text-[#1D5C48]" />
        <h2 class="text-[13px] font-semibold leading-[20px]">
          ทะเบียนโครงการโครงสร้างพื้นฐาน ประจำปีงบประมาณ {{ selectedYear }}
        </h2>
      </header>

      <ProjectTable
        v-model:page="page"
        :projects="filteredProjects"
        :page-size="PAGE_SIZE"
      />
    </section>

    <section class="mt-6">
      <h2 class="text-[14px] font-semibold leading-[22px]">
        สรุปสถานะการพัฒนาโครงสร้างพื้นฐาน รายหมู่บ้าน
      </h2>
      <p class="mt-[2px] text-[11px] leading-[16px] text-[#505F76]">
        ติดตามการกระจายงบประมาณและความคืบหน้าของโครงการในแต่ละหมู่บ้าน
      </p>

      <div v-if="stats.byVillage.length" class="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        <VillageSummaryCard
          v-for="village in stats.byVillage"
          :key="village.id"
          :village="village"
          :year="selectedYear"
        />
      </div>
      <p
        v-else-if="!loading"
        class="mt-3 rounded-[12px] border border-dashed border-[#BFC9C3] bg-white px-4 py-8 text-center text-[12px] text-[#505F76]"
      >
        ยังไม่มีหมู่บ้านที่เปิดใช้งานในระบบ
      </p>
    </section>
  </section>
</template>
