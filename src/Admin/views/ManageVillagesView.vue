<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { villageLabel } from '@/shared/utils/village'
import {
  createVillage,
  fetchVillagesWithCounts,
  updateVillage,
} from '@/services/villages'
import AdminIcon from '@/Admin/components/icons/AdminIcon.vue'
import EmptyState from '@/Admin/components/EmptyState.vue'
import VillageFormModal from '@/Admin/components/VillageFormModal.vue'

const route = useRoute()
const router = useRouter()

const villages = ref([])
const loading = ref(true)
const error = ref('')

const formOpen = ref(false)
const editing = ref(null) // null = สร้างใหม่
const saving = ref(false)
const formError = ref('')

const notice = ref('')
let noticeTimer = null

function showNotice(message) {
  notice.value = message
  if (noticeTimer) clearTimeout(noticeTimer)
  noticeTimer = setTimeout(() => {
    notice.value = ''
  }, 4000)
}

async function loadVillages() {
  error.value = ''
  try {
    villages.value = await fetchVillagesWithCounts()
  } catch (err) {
    error.value = err.message
    villages.value = []
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  if (route.query.create === '1') openCreate()
  await loadVillages()
})

onBeforeUnmount(() => {
  if (noticeTimer) clearTimeout(noticeTimer)
})

watch(
  () => route.query.create,
  (value) => {
    if (value === '1') openCreate()
  },
  { immediate: true },
)

function openCreate() {
  editing.value = null
  formError.value = ''
  formOpen.value = true
}

function openEdit(village) {
  editing.value = village
  formError.value = ''
  formOpen.value = true
}

function closeForm() {
  if (saving.value) return
  formOpen.value = false
  editing.value = null
  formError.value = ''

  if (route.query.create) {
    const query = { ...route.query }
    delete query.create
    router.replace({ query })
  }
}

async function handleSubmit(payload) {
  saving.value = true
  formError.value = ''
  try {
    if (editing.value) {
      await updateVillage(editing.value.id, payload)
      showNotice(`บันทึกการแก้ไข "${villageLabel(payload.name)} หมู่ ${payload.mooNo}" แล้ว`)
    } else {
      await createVillage(payload)
      showNotice(`เพิ่ม "${villageLabel(payload.name)} หมู่ ${payload.mooNo}" เรียบร้อยแล้ว`)
    }
    formOpen.value = false
    editing.value = null

    if (route.query.create) {
      const query = { ...route.query }
      delete query.create
      router.replace({ query })
    }

    await loadVillages()
  } catch (err) {
    formError.value = err.message
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <section class="text-[#181C1B]">
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 class="text-[20px] font-semibold leading-[28px]">หมู่บ้าน</h1>
        <p class="mt-[2px] text-[11px] leading-[17px] text-[#505F76]">
          จัดการรายชื่อหมู่บ้านและสถานะการดำเนินงานโครงการ
        </p>
      </div>

      <button
        type="button"
        class="flex h-9 items-center gap-2 rounded-[8px] bg-[#1D5C48] px-4 text-[13px] font-medium text-white transition hover:bg-[#174C3B] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1D5C48]/30"
        @click="openCreate"
      >
        <AdminIcon name="plus" class="h-4 w-4" />
        เพิ่มหมู่บ้าน
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
      v-if="error"
      role="alert"
      class="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-[8px] border border-red-200 bg-red-50 px-4 py-2 text-[12px] text-red-700"
    >
      <span>{{ error }}</span>
      <button
        type="button"
        class="rounded-[6px] border border-red-300 px-2 py-1 text-[11px] hover:bg-red-100"
        @click="loadVillages"
      >
        ลองอีกครั้ง
      </button>
    </p>

    <div class="mt-3 space-y-3">
      <template v-if="loading">
        <div
          v-for="index in 3"
          :key="index"
          class="h-[112px] animate-pulse rounded-[14px] border border-[#BFC9C3]/50 bg-white"
        />
      </template>

      <template v-else-if="villages.length">
        <article
          v-for="village in villages"
          :key="village.id"
          :class="[
            'flex flex-wrap items-center justify-between gap-3 rounded-[14px] border px-5 py-[18px] transition',
            village.isActive
              ? 'border-[#BFC9C3]/70 bg-white'
              : 'border-[#E3E8E5] bg-[#F8FAFC]',
          ]"
        >
          <div class="min-w-0">
            <div class="flex flex-wrap items-center gap-2">
              <h2
                :class="[
                  'text-[17px] font-semibold leading-[24px]',
                  village.isActive ? 'text-[#181C1B]' : 'text-[#9AA5A0]',
                ]"
              >
                {{ villageLabel(village.name) }} หมู่ {{ village.mooNo }}
              </h2>
              <span
                v-if="!village.isActive"
                class="inline-flex items-center gap-[5px] rounded-full border border-[#BFC9C3]/70 bg-white px-2 py-[3px] text-[10px] leading-none text-[#707974]"
              >
                <span class="h-[5px] w-[5px] rounded-full bg-[#9AA5A0]" />
                ปิดใช้งาน
              </span>
            </div>

            <p
              :class="[
                'mt-[3px] text-[13px] leading-[19px]',
                village.isActive ? 'text-[#505F76]' : 'text-[#9AA5A0]',
              ]"
            >
              {{ village.projectCount }} โครงการ
            </p>
          </div>

          <button
            type="button"
            class="h-9 shrink-0 rounded-[8px] border border-[#BFC9C3] bg-white px-4 text-[12px] text-[#181C1B] transition hover:bg-[#F1F4F2]"
            @click="openEdit(village)"
          >
            การจัดการ
          </button>
        </article>
      </template>

      <EmptyState
        v-else
        title="ยังไม่มีหมู่บ้านในระบบ"
        description="เพิ่มหมู่บ้านก่อน เพื่อให้สร้างโครงการและกำหนดพื้นที่ดำเนินงานได้"
      >
        <button
          type="button"
          class="flex h-9 items-center gap-2 rounded-[8px] bg-[#1D5C48] px-4 text-[12px] font-medium text-white transition hover:bg-[#174C3B]"
          @click="openCreate"
        >
          <AdminIcon name="plus" class="h-4 w-4" />
          เพิ่มหมู่บ้าน
        </button>
      </EmptyState>
    </div>

    <VillageFormModal
      v-if="formOpen"
      :village="editing"
      :submitting="saving"
      :error="formError"
      @close="closeForm"
      @submit="handleSubmit"
    />
  </section>
</template>
