<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { currentBuddhistYear } from '@/shared/utils/buddhistYear'
import { PROJECT_STATUS } from '@/shared/constants/status'
import { STRUCTURE_STATUS_OPTIONS } from '@/shared/constants/project'
import { formatThaiDate } from '@/shared/utils/thaiDate'
import { villageLabel } from '@/shared/utils/village'
import {
  addProjectNote,
  fetchProject,
  getStartBlockers,
  setProjectAgencies,
  updateProjectCore,
  upsertProjectLocationBudget,
  upsertProjectPlan,
  uploadProjectAttachment,
} from '@/services/projects'
import {
  fetchAgencyOptions,
  fetchDocTypeOptions,
  fetchFundingSourceOptions,
  fetchInfraTypeOptions,
  fetchVillageOptions,
} from '@/services/lookups'
import AdminIcon from '@/Admin/components/icons/AdminIcon.vue'
import EmptyState from '@/Admin/components/EmptyState.vue'
import StatusBadge from '@/Admin/components/StatusBadge.vue'

const route = useRoute()
const router = useRouter()

const projectId = computed(() => Number(route.params.projectId))

const project = ref(null)
const loading = ref(true)
const error = ref('')
const saving = ref(false)
const saveMessage = ref('')
const saveError = ref('')
let saveTimer = null

const activeTab = ref('core')

const villages = ref([])
const infraTypes = ref([])
const agencies = ref([])
const fundingSources = ref([])
const docTypes = ref([])

const tabItems = [
  { key: 'core', label: 'ข้อมูลโครงการ' },
  { key: 'location', label: 'พื้นที่และงบประมาณ' },
  { key: 'plan', label: 'แผนการดำเนินงาน' },
]

// Tab 1 form
const coreForm = reactive({
  name: '',
  villageId: '',
  infraTypeId: '',
  objective: '',
  structureStatus: '',
  planYear: currentBuddhistYear(),
})

// Tab 2 form
const locationForm = reactive({
  latitude: '',
  longitude: '',
  locationText: '',
  budgetAmount: '',
  fiscalYear: '',
  fundingSourceId: '',
})

// Tab 3 form
const planForm = reactive({
  plannedStart: '',
  plannedEnd: '',
  actualStart: '',
  actualEnd: '',
  agencyIds: [],
})

const noteForm = reactive({ type: 'UPDATE', content: '' })
const noteSaving = ref(false)
const noteError = ref('')

const attachmentForm = reactive({ docTypeId: '', file: null })
const attachmentSaving = ref(false)
const attachmentError = ref('')

const isLocked = computed(
  () =>
    project.value?.status === PROJECT_STATUS.COMPLETED ||
    project.value?.status === PROJECT_STATUS.CANCELLED,
)

const blockers = computed(() => (project.value ? getStartBlockers(project.value) : []))

async function loadLookups() {
  try {
    const [villageList, infraTypeList, agencyList, fundingList, docTypeList] = await Promise.all([
      fetchVillageOptions(),
      fetchInfraTypeOptions(),
      fetchAgencyOptions(),
      fetchFundingSourceOptions(),
      fetchDocTypeOptions(),
    ])
    villages.value = villageList
    infraTypes.value = infraTypeList
    agencies.value = agencyList
    fundingSources.value = fundingList
    docTypes.value = docTypeList
  } catch (err) {
    error.value = err.message
  }
}

async function loadProject() {
  loading.value = true
  error.value = ''
  try {
    const data = await fetchProject(projectId.value)
    project.value = data

    coreForm.name = data.name ?? ''
    coreForm.villageId = data.villageId ? String(data.villageId) : ''
    coreForm.infraTypeId = data.infraTypeId ? String(data.infraTypeId) : ''
    // fallback: find by id not available; keep empty if not matched
    coreForm.objective = data.objective ?? ''
    coreForm.structureStatus = data.structureStatus ?? ''
    coreForm.planYear = data.planYear ?? currentBuddhistYear()

    locationForm.latitude = data.location?.latitude ?? ''
    locationForm.longitude = data.location?.longitude ?? ''
    locationForm.locationText = data.location?.text ?? ''
    locationForm.budgetAmount = data.budget ?? ''
    locationForm.fiscalYear = data.location?.fiscalYear ?? ''
    locationForm.fundingSourceId = data.location?.fundingSourceId ? String(data.location.fundingSourceId) : ''

    planForm.plannedStart = data.plan?.plannedStart ?? ''
    planForm.plannedEnd = data.plan?.plannedEnd ?? ''
    planForm.actualStart = data.plan?.actualStart ?? ''
    planForm.actualEnd = data.plan?.actualEnd ?? ''
    planForm.agencyIds = (data.agencies ?? []).map((a) => a.id)
  } catch (err) {
    error.value = err.message
    project.value = null
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await loadLookups()
  await loadProject()
})

onBeforeUnmount(() => {
  if (saveTimer) clearTimeout(saveTimer)
})

function showSaveMessage(message, isError = false) {
  if (isError) {
    saveError.value = message
    saveMessage.value = ''
  } else {
    saveMessage.value = message
    saveError.value = ''
  }
  if (saveTimer) clearTimeout(saveTimer)
  saveTimer = setTimeout(() => {
    saveMessage.value = ''
    saveError.value = ''
  }, 4000)
}

async function saveCore() {
  if (isLocked.value) return
  saving.value = true
  try {
    await updateProjectCore(projectId.value, {
      name: coreForm.name,
      infraTypeId: Number(coreForm.infraTypeId),
      objective: coreForm.objective,
      structureStatus: coreForm.structureStatus,
      planYear: Number(coreForm.planYear),
    })
    await loadProject()
    showSaveMessage('บันทึกข้อมูลโครงการเรียบร้อยแล้ว')
  } catch (err) {
    showSaveMessage(err.message, true)
  } finally {
    saving.value = false
  }
}

async function saveLocation() {
  if (isLocked.value) return
  saving.value = true
  try {
    await upsertProjectLocationBudget(projectId.value, {
      latitude: locationForm.latitude,
      longitude: locationForm.longitude,
      locationText: locationForm.locationText,
      budgetAmount: locationForm.budgetAmount,
      fiscalYear: locationForm.fiscalYear,
      fundingSourceId: locationForm.fundingSourceId,
    })
    await loadProject()
    showSaveMessage('บันทึกพื้นที่และงบประมาณเรียบร้อยแล้ว')
  } catch (err) {
    showSaveMessage(err.message, true)
  } finally {
    saving.value = false
  }
}

async function savePlan() {
  if (isLocked.value) return
  saving.value = true
  try {
    await upsertProjectPlan(projectId.value, {
      plannedStart: planForm.plannedStart,
      plannedEnd: planForm.plannedEnd,
      actualStart: planForm.actualStart,
      actualEnd: planForm.actualEnd,
    })
    await setProjectAgencies(projectId.value, planForm.agencyIds.map(Number))
    await loadProject()
    showSaveMessage('บันทึกแผนการดำเนินงานเรียบร้อยแล้ว')
  } catch (err) {
    showSaveMessage(err.message, true)
  } finally {
    saving.value = false
  }
}

function toggleAgency(id) {
  const idx = planForm.agencyIds.indexOf(id)
  if (idx === -1) planForm.agencyIds.push(id)
  else planForm.agencyIds.splice(idx, 1)
}

async function submitNote() {
  if (isLocked.value || !noteForm.content.trim()) return
  noteSaving.value = true
  noteError.value = ''
  try {
    await addProjectNote(projectId.value, noteForm.type, noteForm.content)
    noteForm.content = ''
    await loadProject()
  } catch (err) {
    noteError.value = err.message
  } finally {
    noteSaving.value = false
  }
}

async function submitAttachment() {
  if (isLocked.value || !attachmentForm.file || !attachmentForm.docTypeId) return
  attachmentSaving.value = true
  attachmentError.value = ''
  try {
    await uploadProjectAttachment(projectId.value, Number(attachmentForm.docTypeId), attachmentForm.file)
    attachmentForm.file = null
    attachmentForm.docTypeId = ''
    await loadProject()
  } catch (err) {
    attachmentError.value = err.message
  } finally {
    attachmentSaving.value = false
  }
}

function onFileChange(event) {
  const files = event.target?.files
  attachmentForm.file = files && files.length ? files[0] : null
}

function goBack() {
  router.push('/admin/projects')
}

const statusLabel = computed(() => project.value?.status ?? '')
</script>

<template>
  <section class="text-[#181C1B]">
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div class="flex items-center gap-3">
        <button
          type="button"
          class="flex h-9 w-9 items-center justify-center rounded-[8px] border border-[#BFC9C3] bg-white text-[#505F76] transition hover:bg-[#F1F4F2]"
          aria-label="กลับ"
          @click="goBack"
        >
          <AdminIcon name="chevron-left" class="h-4 w-4" />
        </button>
        <div>
          <h1 class="text-[20px] font-semibold leading-[28px]">
            {{ project?.name ?? 'เริ่มดำเนินการ / แก้ไขโครงการ' }}
          </h1>
          <p class="mt-[2px] text-[11px] leading-[17px] text-[#505F76]">
            {{ project?.code ?? '' }} · {{ project ? villageLabel(project.villageName) + ' หมู่ ' + project.mooNo : '' }}
          </p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <StatusBadge v-if="project" :status="project.status" />
      </div>
    </div>

    <p
      v-if="saveMessage"
      role="status"
      class="mt-3 rounded-[8px] border border-[#1D5C48]/30 bg-[#EAF2EE] px-4 py-2 text-[12px] text-[#1D5C48]"
    >
      {{ saveMessage }}
    </p>
    <p
      v-if="saveError"
      role="alert"
      class="mt-3 rounded-[8px] border border-red-200 bg-red-50 px-4 py-2 text-[12px] text-red-700"
    >
      {{ saveError }}
    </p>

    <p
      v-if="error"
      role="alert"
      class="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-[8px] border border-red-200 bg-red-50 px-4 py-2 text-[12px] text-red-700"
    >
      <span>{{ error }}</span>
      <button
        type="button"
        class="rounded-[6px] border border-red-300 px-2 py-1 text-[11px] hover:bg-red-100"
        @click="loadProject"
      >
        ลองอีกครั้ง
      </button>
    </p>

    <div v-if="loading" class="mt-4 space-y-3">
      <div v-for="i in 3" :key="i" class="h-[120px] animate-pulse rounded-[14px] border border-[#BFC9C3]/50 bg-white" />
    </div>

    <template v-else-if="project">
      <!-- Tabs -->
      <div class="mt-4 flex gap-1 border-b border-[#BFC9C3]/60">
        <button
          v-for="tab in tabItems"
          :key="tab.key"
          type="button"
          :class="[
            'px-4 py-2 text-[13px] font-medium transition border-b-2 -mb-px',
            activeTab === tab.key
              ? 'border-[#1D5C48] text-[#1D5C48]'
              : 'border-transparent text-[#505F76] hover:text-[#181C1B]',
          ]"
          @click="activeTab = tab.key"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Tab 1: Core -->
      <div v-if="activeTab === 'core'" class="mt-4 rounded-[14px] border border-[#BFC9C3]/70 bg-white p-5">
        <h2 class="text-[16px] font-semibold leading-[22px] text-[#181C1B]">ข้อมูลโครงการ</h2>
        <p class="mt-1 text-[11px] leading-[17px] text-[#505F76]">
          ข้อมูลหลักของโครงการ (แก้ไขได้เฉพาะเมื่อสถานะยังไม่เสร็จสิ้น/ยกเลิก)
        </p>

        <div class="mt-4 grid gap-4 sm:grid-cols-2">
          <div class="sm:col-span-2">
            <label class="block text-[13px] font-medium text-[#181C1B]">
              ชื่อโครงการ <span class="text-[#B91C1C]">*</span>
            </label>
            <input
              v-model="coreForm.name"
              type="text"
              maxlength="200"
              :disabled="isLocked"
              class="mt-1 h-11 w-full rounded-[8px] border border-[#BFC9C3] bg-white px-3 text-[13px] text-[#181C1B] outline-none focus:border-[#1D5C48] focus:ring-2 focus:ring-[#1D5C48]/10 disabled:bg-[#F8FAFC] disabled:text-[#9AA5A0]"
            />
          </div>

          <div>
            <label class="block text-[13px] font-medium text-[#181C1B]">หมู่บ้าน</label>
            <p class="mt-1 rounded-[8px] border border-[#E3E8E5] bg-[#F8FAFC] px-3 py-2.5 text-[13px] text-[#505F76]">
              {{ villageLabel(project.villageName) }} หมู่ {{ project.mooNo }}
            </p>
            <p class="mt-1 text-[10px] leading-[15px] text-[#707974]">หมู่บ้านย้ายไม่ได้หลังสร้าง (BR-04)</p>
          </div>

          <div>
            <label class="block text-[13px] font-medium text-[#181C1B]">
              ประเภทโครงสร้างพื้นฐาน <span class="text-[#B91C1C]">*</span>
            </label>
            <div class="relative mt-1">
              <select
                v-model="coreForm.infraTypeId"
                :disabled="isLocked"
                class="h-11 w-full appearance-none rounded-[8px] border border-[#BFC9C3] bg-white pl-3 pr-8 text-[13px] text-[#181C1B] outline-none focus:border-[#1D5C48] focus:ring-2 focus:ring-[#1D5C48]/10 disabled:bg-[#F8FAFC] disabled:text-[#9AA5A0]"
              >
                <option value="">เลือกประเภท</option>
                <option v-for="type in infraTypes" :key="type.infra_type_id" :value="type.infra_type_id">
                  {{ type.type_name }}
                </option>
              </select>
              <AdminIcon name="chevron-down" class="pointer-events-none absolute right-3 top-[13px] h-4 w-4 text-[#505F76]" />
            </div>
          </div>

          <div class="sm:col-span-2">
            <label class="block text-[13px] font-medium text-[#181C1B]">
              วัตถุประสงค์ <span class="text-[#B91C1C]">*</span>
            </label>
            <textarea
              v-model="coreForm.objective"
              rows="3"
              maxlength="1000"
              :disabled="isLocked"
              class="mt-1 w-full resize-none rounded-[8px] border border-[#BFC9C3] bg-white px-3 py-2 text-[13px] leading-[19px] text-[#181C1B] outline-none focus:border-[#1D5C48] focus:ring-2 focus:ring-[#1D5C48]/10 disabled:bg-[#F8FAFC] disabled:text-[#9AA5A0]"
            />
          </div>

          <div>
            <label class="block text-[13px] font-medium text-[#181C1B]">
              สถานะปัจจุบันของสิ่งก่อสร้าง <span class="text-[#B91C1C]">*</span>
            </label>
            <div class="relative mt-1">
              <select
                v-model="coreForm.structureStatus"
                :disabled="isLocked"
                class="h-11 w-full appearance-none rounded-[8px] border border-[#BFC9C3] bg-white pl-3 pr-8 text-[13px] text-[#181C1B] outline-none focus:border-[#1D5C48] focus:ring-2 focus:ring-[#1D5C48]/10 disabled:bg-[#F8FAFC] disabled:text-[#9AA5A0]"
              >
                <option value="">เลือกสถานะ</option>
                <option v-for="option in STRUCTURE_STATUS_OPTIONS" :key="option" :value="option">
                  {{ option }}
                </option>
              </select>
              <AdminIcon name="chevron-down" class="pointer-events-none absolute right-3 top-[13px] h-4 w-4 text-[#505F76]" />
            </div>
          </div>

          <div>
            <label class="block text-[13px] font-medium text-[#181C1B]">
              ปีแผน (พ.ศ.) <span class="text-[#B91C1C]">*</span>
            </label>
            <input
              v-model="coreForm.planYear"
              type="number"
              min="2400"
              max="2700"
              :disabled="isLocked"
              class="mt-1 h-11 w-full rounded-[8px] border border-[#BFC9C3] bg-white px-3 text-[13px] text-[#181C1B] outline-none focus:border-[#1D5C48] focus:ring-2 focus:ring-[#1D5C48]/10 disabled:bg-[#F8FAFC] disabled:text-[#9AA5A0]"
            />
          </div>
        </div>

        <div class="mt-4 flex justify-end">
          <button
            type="button"
            class="h-9 rounded-[8px] bg-[#1D5C48] px-5 text-[12px] font-medium text-white transition hover:bg-[#174C3B] disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="saving || isLocked"
            @click="saveCore"
          >
            {{ saving ? 'กำลังบันทึก…' : 'บันทึกแท็บ 1' }}
          </button>
        </div>
      </div>

      <!-- Tab 2: Location & Budget -->
      <div v-else-if="activeTab === 'location'" class="mt-4 rounded-[14px] border border-[#BFC9C3]/70 bg-white p-5">
        <h2 class="text-[16px] font-semibold leading-[22px] text-[#181C1B]">พื้นที่และงบประมาณ</h2>
        <p class="mt-1 text-[11px] leading-[17px] text-[#505F76]">
          ระบุพิกัด ที่ตั้ง วงเงิน ปีงบประมาณ และแหล่งเงิน (BR-08 ถึง BR-11)
        </p>

        <div class="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label class="block text-[13px] font-medium text-[#181C1B]">ละติจูด (Latitude)</label>
            <input
              v-model="locationForm.latitude"
              type="number"
              step="0.000001"
              min="-90"
              max="90"
              :disabled="isLocked"
              class="mt-1 h-11 w-full rounded-[8px] border border-[#BFC9C3] bg-white px-3 text-[13px] text-[#181C1B] outline-none focus:border-[#1D5C48] focus:ring-2 focus:ring-[#1D5C48]/10 disabled:bg-[#F8FAFC] disabled:text-[#9AA5A0]"
            />
          </div>
          <div>
            <label class="block text-[13px] font-medium text-[#181C1B]">ลองจิจูด (Longitude)</label>
            <input
              v-model="locationForm.longitude"
              type="number"
              step="0.000001"
              min="-180"
              max="180"
              :disabled="isLocked"
              class="mt-1 h-11 w-full rounded-[8px] border border-[#BFC9C3] bg-white px-3 text-[13px] text-[#181C1B] outline-none focus:border-[#1D5C48] focus:ring-2 focus:ring-[#1D5C48]/10 disabled:bg-[#F8FAFC] disabled:text-[#9AA5A0]"
            />
          </div>
          <div class="sm:col-span-2">
            <label class="block text-[13px] font-medium text-[#181C1B]">ที่ตั้งโครงการ (ข้อความ)</label>
            <input
              v-model="locationForm.locationText"
              type="text"
              maxlength="500"
              :disabled="isLocked"
              placeholder="เช่น ซอย 2 บ้านหลวง หมู่ 1"
              class="mt-1 h-11 w-full rounded-[8px] border border-[#BFC9C3] bg-white px-3 text-[13px] text-[#181C1B] outline-none placeholder:text-[#707974] focus:border-[#1D5C48] focus:ring-2 focus:ring-[#1D5C48]/10 disabled:bg-[#F8FAFC] disabled:text-[#9AA5A0]"
            />
          </div>
          <div>
            <label class="block text-[13px] font-medium text-[#181C1B]">
              วงเงินงบประมาณ (บาท) <span class="text-[#B91C1C]">*</span>
            </label>
            <input
              v-model="locationForm.budgetAmount"
              type="number"
              min="0"
              step="0.01"
              :disabled="isLocked"
              class="mt-1 h-11 w-full rounded-[8px] border border-[#BFC9C3] bg-white px-3 text-[13px] text-[#181C1B] outline-none focus:border-[#1D5C48] focus:ring-2 focus:ring-[#1D5C48]/10 disabled:bg-[#F8FAFC] disabled:text-[#9AA5A0]"
            />
          </div>
          <div>
            <label class="block text-[13px] font-medium text-[#181C1B]">
              ปีงบประมาณ <span class="text-[#B91C1C]">*</span>
            </label>
            <input
              v-model="locationForm.fiscalYear"
              type="number"
              min="2500"
              max="2700"
              :disabled="isLocked"
              class="mt-1 h-11 w-full rounded-[8px] border border-[#BFC9C3] bg-white px-3 text-[13px] text-[#181C1B] outline-none focus:border-[#1D5C48] focus:ring-2 focus:ring-[#1D5C48]/10 disabled:bg-[#F8FAFC] disabled:text-[#9AA5A0]"
            />
          </div>
          <div class="sm:col-span-2">
            <label class="block text-[13px] font-medium text-[#181C1B]">
              แหล่งเงิน <span class="text-[#B91C1C]">*</span>
            </label>
            <div class="relative mt-1">
              <select
                v-model="locationForm.fundingSourceId"
                :disabled="isLocked"
                class="h-11 w-full appearance-none rounded-[8px] border border-[#BFC9C3] bg-white pl-3 pr-8 text-[13px] text-[#181C1B] outline-none focus:border-[#1D5C48] focus:ring-2 focus:ring-[#1D5C48]/10 disabled:bg-[#F8FAFC] disabled:text-[#9AA5A0]"
              >
                <option value="">เลือกแหล่งเงิน</option>
                <option v-for="source in fundingSources" :key="source.funding_source_id" :value="source.funding_source_id">
                  {{ source.source_name }}
                </option>
              </select>
              <AdminIcon name="chevron-down" class="pointer-events-none absolute right-3 top-[13px] h-4 w-4 text-[#505F76]" />
            </div>
          </div>
        </div>

        <div class="mt-4 flex justify-end">
          <button
            type="button"
            class="h-9 rounded-[8px] bg-[#1D5C48] px-5 text-[12px] font-medium text-white transition hover:bg-[#174C3B] disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="saving || isLocked"
            @click="saveLocation"
          >
            {{ saving ? 'กำลังบันทึก…' : 'บันทึกแท็บ 2' }}
          </button>
        </div>
      </div>

      <!-- Tab 3: Plan, agencies, attachments, notes -->
      <div v-else class="mt-4 space-y-4">
        <!-- Plan -->
        <div class="rounded-[14px] border border-[#BFC9C3]/70 bg-white p-5">
          <h2 class="text-[16px] font-semibold leading-[22px] text-[#181C1B]">แผนการดำเนินงาน</h2>
          <p class="mt-1 text-[11px] leading-[17px] text-[#505F76]">
            วันที่คาดว่าจะเริ่ม/สิ้นสุด และวันที่เริ่ม/สิ้นสุดจริง
          </p>

          <div class="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label class="block text-[13px] font-medium text-[#181C1B]">
                วันที่คาดว่าจะเริ่ม <span class="text-[#B91C1C]">*</span>
              </label>
              <input
                v-model="planForm.plannedStart"
                type="date"
                :disabled="isLocked"
                class="mt-1 h-11 w-full rounded-[8px] border border-[#BFC9C3] bg-white px-3 text-[13px] text-[#181C1B] outline-none focus:border-[#1D5C48] focus:ring-2 focus:ring-[#1D5C48]/10 disabled:bg-[#F8FAFC] disabled:text-[#9AA5A0]"
              />
            </div>
            <div>
              <label class="block text-[13px] font-medium text-[#181C1B]">
                วันที่คาดว่าจะสิ้นสุด <span class="text-[#B91C1C]">*</span>
              </label>
              <input
                v-model="planForm.plannedEnd"
                type="date"
                :disabled="isLocked"
                class="mt-1 h-11 w-full rounded-[8px] border border-[#BFC9C3] bg-white px-3 text-[13px] text-[#181C1B] outline-none focus:border-[#1D5C48] focus:ring-2 focus:ring-[#1D5C48]/10 disabled:bg-[#F8FAFC] disabled:text-[#9AA5A0]"
              />
            </div>
            <div>
              <label class="block text-[13px] font-medium text-[#181C1B]">วันที่เริ่มจริง</label>
              <input
                v-model="planForm.actualStart"
                type="date"
                :disabled="isLocked"
                class="mt-1 h-11 w-full rounded-[8px] border border-[#BFC9C3] bg-white px-3 text-[13px] text-[#181C1B] outline-none focus:border-[#1D5C48] focus:ring-2 focus:ring-[#1D5C48]/10 disabled:bg-[#F8FAFC] disabled:text-[#9AA5A0]"
              />
            </div>
            <div>
              <label class="block text-[13px] font-medium text-[#181C1B]">วันที่สิ้นสุดจริง</label>
              <input
                v-model="planForm.actualEnd"
                type="date"
                :disabled="isLocked"
                class="mt-1 h-11 w-full rounded-[8px] border border-[#BFC9C3] bg-white px-3 text-[13px] text-[#181C1B] outline-none focus:border-[#1D5C48] focus:ring-2 focus:ring-[#1D5C48]/10 disabled:bg-[#F8FAFC] disabled:text-[#9AA5A0]"
              />
            </div>
          </div>

          <div class="mt-4">
            <label class="block text-[13px] font-medium text-[#181C1B]">
              หน่วยงานผู้รับผิดชอบ <span class="text-[#B91C1C]">*</span>
            </label>
            <div class="mt-2 grid gap-2 sm:grid-cols-2">
              <label
                v-for="agency in agencies"
                :key="agency.agency_id"
                class="flex cursor-pointer items-center gap-2 rounded-[8px] border border-[#BFC9C3]/70 bg-white px-3 py-2 text-[12px] text-[#181C1B] transition hover:bg-[#F1F4F2]"
                :class="isLocked ? 'cursor-not-allowed opacity-60' : ''"
              >
                <input
                  type="checkbox"
                  :checked="planForm.agencyIds.includes(agency.agency_id)"
                  :disabled="isLocked"
                  class="h-4 w-4 rounded border-[#BFC9C3] text-[#1D5C48] focus:ring-[#1D5C48]/20"
                  @change="toggleAgency(agency.agency_id)"
                />
                <span>{{ agency.agency_name }}</span>
              </label>
              <p v-if="!agencies.length" class="text-[11px] text-[#707974]">
                ยังไม่มีหน่วยงานในระบบ
              </p>
            </div>
          </div>

          <div class="mt-4 flex justify-end">
            <button
              type="button"
              class="h-9 rounded-[8px] bg-[#1D5C48] px-5 text-[12px] font-medium text-white transition hover:bg-[#174C3B] disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="saving || isLocked"
              @click="savePlan"
            >
              {{ saving ? 'กำลังบันทึก…' : 'บันทึกแท็บ 3 (แผน/หน่วยงาน)' }}
            </button>
          </div>
        </div>

        <!-- Attachments -->
        <div class="rounded-[14px] border border-[#BFC9C3]/70 bg-white p-5">
          <h2 class="text-[16px] font-semibold leading-[22px] text-[#181C1B]">เอกสารประกอบ</h2>
          <p class="mt-1 text-[11px] leading-[17px] text-[#505F76]">
            แนบไฟล์อย่างน้อย 1 ไฟล์ (BR-11) — ประเภทเอกสารเลือกจากรายการ
          </p>

          <ul v-if="project.attachments?.length" class="mt-3 space-y-2">
            <li
              v-for="attachment in project.attachments"
              :key="attachment.id"
              class="flex items-center justify-between gap-2 rounded-[8px] border border-[#E3E8E5] bg-[#F8FAFC] px-3 py-2 text-[12px] text-[#181C1B]"
            >
              <span class="truncate">{{ attachment.fileName }}</span>
              <span class="shrink-0 text-[10px] text-[#707974]">{{ attachment.docTypeName }}</span>
            </li>
          </ul>
          <EmptyState v-else title="ยังไม่มีเอกสารแนบ" description="อัปโหลดไฟล์อย่างน้อย 1 ไฟล์ก่อนเริ่มดำเนินการ" />

          <div v-if="!isLocked" class="mt-4 rounded-[10px] border-2 border-dashed border-[#BFC9C3] bg-[#F1F4F2]/40 p-4">
            <div class="grid gap-3 sm:grid-cols-2">
              <div>
                <label class="block text-[12px] font-medium text-[#181C1B]">ประเภทเอกสาร</label>
                <div class="relative mt-1">
                  <select
                    v-model="attachmentForm.docTypeId"
                    class="h-10 w-full appearance-none rounded-[8px] border border-[#BFC9C3] bg-white pl-3 pr-8 text-[12px] text-[#181C1B] outline-none focus:border-[#1D5C48] focus:ring-2 focus:ring-[#1D5C48]/10"
                  >
                    <option value="">เลือกประเภทเอกสาร</option>
                    <option v-for="doc in docTypes" :key="doc.doc_type_id" :value="doc.doc_type_id">
                      {{ doc.doc_type_name }}
                    </option>
                  </select>
                  <AdminIcon name="chevron-down" class="pointer-events-none absolute right-3 top-[10px] h-4 w-4 text-[#505F76]" />
                </div>
              </div>
              <div>
                <label class="block text-[12px] font-medium text-[#181C1B]">ไฟล์</label>
                <input
                  type="file"
                  class="mt-1 block w-full text-[12px] text-[#505F76] file:mr-2 file:rounded-[6px] file:border-0 file:bg-[#1D5C48] file:px-3 file:py-1.5 file:text-[12px] file:font-medium file:text-white hover:file:bg-[#174C3B]"
                  @change="onFileChange"
                />
              </div>
            </div>
            <p v-if="attachmentError" class="mt-2 text-[11px] text-red-700">{{ attachmentError }}</p>
            <div class="mt-3 flex justify-end">
              <button
                type="button"
                class="h-9 rounded-[8px] bg-[#1D5C48] px-4 text-[12px] font-medium text-white transition hover:bg-[#174C3B] disabled:cursor-not-allowed disabled:opacity-60"
                :disabled="attachmentSaving || !attachmentForm.file || !attachmentForm.docTypeId"
                @click="submitAttachment"
              >
                {{ attachmentSaving ? 'กำลังอัปโหลด…' : 'อัปโหลดเอกสาร' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Notes -->
        <div class="rounded-[14px] border border-[#BFC9C3]/70 bg-white p-5">
          <h2 class="text-[16px] font-semibold leading-[22px] text-[#181C1B]">หมายเหตุ (เพิ่มได้อย่างเดียว)</h2>
          <p class="mt-1 text-[11px] leading-[17px] text-[#505F76]">
            เพิ่มได้อย่างเดียว ไม่สามารถแก้ไขหรือลบ (BR-12)
          </p>

          <ul v-if="project.notes?.length" class="mt-3 space-y-2">
            <li
              v-for="note in project.notes"
              :key="note.id"
              class="rounded-[8px] border border-[#E3E8E5] bg-[#F8FAFC] px-3 py-2 text-[12px] text-[#181C1B]"
            >
              <div class="flex items-center gap-2 text-[10px] text-[#707974]">
                <span class="rounded-full bg-[#EAF2EE] px-2 py-[2px] text-[#1D5C48]">{{ note.type }}</span>
                <span>{{ formatThaiDate(note.createdAt) }}</span>
              </div>
              <p class="mt-1 whitespace-pre-wrap">{{ note.content }}</p>
            </li>
          </ul>
          <EmptyState v-else title="ยังไม่มีหมายเหตุ" description="เพิ่มหมายเหตุเพื่อติดตามความคืบหน้า" />

          <div v-if="!isLocked" class="mt-4 rounded-[10px] border border-[#BFC9C3]/70 bg-[#F8FAFC] p-4">
            <div class="grid gap-3 sm:grid-cols-3">
              <div>
                <label class="block text-[12px] font-medium text-[#181C1B]">ประเภท</label>
                <div class="relative mt-1">
                  <select
                    v-model="noteForm.type"
                    class="h-10 w-full appearance-none rounded-[8px] border border-[#BFC9C3] bg-white pl-3 pr-8 text-[12px] text-[#181C1B] outline-none focus:border-[#1D5C48] focus:ring-2 focus:ring-[#1D5C48]/10"
                  >
                    <option value="UPDATE">อัปเดต</option>
                    <option value="PROBLEM">ปัญหา</option>
                    <option value="SOLUTION">วิธีแก้</option>
                  </select>
                  <AdminIcon name="chevron-down" class="pointer-events-none absolute right-3 top-[10px] h-4 w-4 text-[#505F76]" />
                </div>
              </div>
              <div class="sm:col-span-2">
                <label class="block text-[12px] font-medium text-[#181C1B]">เนื้อหา</label>
                <textarea
                  v-model="noteForm.content"
                  rows="2"
                  maxlength="2000"
                  class="mt-1 w-full resize-none rounded-[8px] border border-[#BFC9C3] bg-white px-3 py-2 text-[12px] leading-[18px] text-[#181C1B] outline-none focus:border-[#1D5C48] focus:ring-2 focus:ring-[#1D5C48]/10"
                />
              </div>
            </div>
            <p v-if="noteError" class="mt-2 text-[11px] text-red-700">{{ noteError }}</p>
            <div class="mt-3 flex justify-end">
              <button
                type="button"
                class="h-9 rounded-[8px] bg-[#1D5C48] px-4 text-[12px] font-medium text-white transition hover:bg-[#174C3B] disabled:cursor-not-allowed disabled:opacity-60"
                :disabled="noteSaving || !noteForm.content.trim()"
                @click="submitNote"
              >
                {{ noteSaving ? 'กำลังบันทึก…' : 'เพิ่มหมายเหตุ' }}
              </button>
            </div>
          </div>

          <!-- Blockers summary -->
          <div v-if="blockers.length" class="rounded-[14px] border border-[#FDF6D8] bg-[#FDF6D8]/60 p-5">
            <h3 class="text-[13px] font-semibold text-[#8A6A00]">ข้อมูลที่ยังไม่ครบก่อนเริ่มดำเนินการ</h3>
            <ul class="mt-2 space-y-1 text-[12px] leading-[18px] text-[#8A6A00]">
              <li v-for="item in blockers" :key="item" class="flex gap-2">
                <span aria-hidden="true">•</span>
                <span>{{ item }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </template>

    <EmptyState v-else title="ไม่พบโครงการ" description="โครงการนี้อาจถูกลบหรือไม่มีอยู่" />
  </section>
</template>