<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  MASTER_KINDS,
  MASTER_ORDER,
  MASTER_SUBTITLE,
} from '@/shared/constants/masterData'
import {
  createMasterOption,
  fetchMasterCounts,
  fetchMasterOptions,
  updateMasterOption,
} from '@/services/masterData'
import AdminIcon from '@/Admin/components/icons/AdminIcon.vue'
import EmptyState from '@/Admin/components/EmptyState.vue'
import MasterOptionModal from '@/Admin/components/MasterOptionModal.vue'

const route = useRoute()
const router = useRouter()

const kind = computed(() => MASTER_KINDS[route.meta.masterKind] ?? MASTER_KINDS.infra)
const summaryItems = computed(() => MASTER_ORDER.map((key) => MASTER_KINDS[key]))

const options = ref([])
const counts = ref({ infra: 0, agency: 0, funding: 0 })
const loading = ref(true)
const error = ref('')

const formOpen = ref(false)
const editing = ref(null)
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

async function load() {
  loading.value = true
  error.value = ''
  try {
    const [list, countMap] = await Promise.all([
      fetchMasterOptions(kind.value.key),
      fetchMasterCounts(),
    ])
    options.value = list
    counts.value = countMap
  } catch (err) {
    error.value = err.message
    options.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (route.query.create === '1') openCreate()
  load()
})

onBeforeUnmount(() => {
  if (noticeTimer) clearTimeout(noticeTimer)
})

// สลับแท็บ (เส้นทาง) แต่ใช้ component เดิม → ต้องโหลดข้อมูลใหม่เอง
watch(
  () => route.meta.masterKind,
  () => {
    formOpen.value = false
    editing.value = null
    formError.value = ''
    if (route.query.create === '1') openCreate()
    load()
  },
)

function openCreate() {
  editing.value = null
  formError.value = ''
  formOpen.value = true
}

function openEdit(option) {
  editing.value = option
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
      await updateMasterOption(kind.value.key, editing.value.id, payload)
      showNotice(`บันทึกการแก้ไข "${payload.name}" แล้ว`)
    } else {
      await createMasterOption(kind.value.key, payload.name)
      showNotice(`เพิ่ม "${payload.name}" เรียบร้อยแล้ว`)
    }

    formOpen.value = false
    editing.value = null

    if (route.query.create) {
      const query = { ...route.query }
      delete query.create
      router.replace({ query })
    }

    await load()
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
        <h1 class="text-[20px] font-semibold leading-[28px]">{{ kind.pageTitle }}</h1>
        <p class="mt-[2px] max-w-[640px] text-[11px] leading-[17px] text-[#505F76]">
          {{ MASTER_SUBTITLE }}
        </p>
      </div>

      <button
        type="button"
        class="flex h-9 items-center gap-2 rounded-[8px] bg-[#1D5C48] px-4 text-[13px] font-medium text-white transition hover:bg-[#174C3B] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1D5C48]/30"
        @click="openCreate"
      >
        <AdminIcon name="plus" class="h-4 w-4" />
        เพิ่มตัวเลือก
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
        @click="load"
      >
        ลองอีกครั้ง
      </button>
    </p>

    <!-- สรุปจำนวนตัวเลือกของทั้ง 3 ชนิด + ใช้เป็นแท็บสลับหน้า -->
    <div class="mt-3 grid gap-3 sm:grid-cols-3">
      <RouterLink
        v-for="item in summaryItems"
        :key="item.key"
        :to="item.path"
        :aria-current="item.key === kind.key ? 'page' : undefined"
        :class="[
          'flex items-center justify-between gap-3 rounded-[10px] border bg-white px-5 py-[14px] text-[14px] leading-none transition',
          item.key === kind.key
            ? 'border-[#1D5C48] font-medium text-[#181C1B] shadow-[0_0_0_1px_rgba(29,92,72,0.15)]'
            : 'border-[#BFC9C3]/70 text-[#181C1B] hover:border-[#9AA5A0]',
        ]"
      >
        <span>{{ item.summaryLabel }}</span>
        <span class="text-[16px] font-semibold">{{ counts[item.key] ?? 0 }}</span>
      </RouterLink>
    </div>

    <div class="mt-3 space-y-3">
      <template v-if="loading">
        <div
          v-for="index in 3"
          :key="index"
          class="h-[112px] animate-pulse rounded-[14px] border border-[#BFC9C3]/50 bg-white"
        />
      </template>

      <template v-else-if="options.length">
        <article
          v-for="option in options"
          :key="option.id"
          :class="[
            'flex flex-wrap items-center justify-between gap-3 rounded-[14px] border px-5 py-[18px] transition',
            option.isActive ? 'border-[#BFC9C3]/70 bg-white' : 'border-[#E3E8E5] bg-[#F8FAFC]',
          ]"
        >
          <div class="min-w-0">
            <div class="flex flex-wrap items-center gap-2">
              <h2
                :class="[
                  'text-[17px] font-semibold leading-[24px]',
                  option.isActive ? 'text-[#181C1B]' : 'text-[#9AA5A0]',
                ]"
              >
                {{ option.name }}
              </h2>
              <span
                v-if="!option.isActive"
                class="inline-flex items-center gap-[5px] rounded-full border border-[#BFC9C3]/70 bg-white px-2 py-[3px] text-[10px] leading-none text-[#707974]"
              >
                <span class="h-[5px] w-[5px] rounded-full bg-[#9AA5A0]" />
                ปิดใช้งาน
              </span>
            </div>

            <p
              :class="[
                'mt-[3px] text-[13px] leading-[19px]',
                option.isActive ? 'text-[#505F76]' : 'text-[#9AA5A0]',
              ]"
            >
              {{ option.projectCount }} โครงการ
            </p>
          </div>

          <button
            type="button"
            class="h-9 shrink-0 rounded-[8px] border border-[#BFC9C3] bg-white px-4 text-[12px] text-[#181C1B] transition hover:bg-[#F1F4F2]"
            @click="openEdit(option)"
          >
            การจัดการ
          </button>
        </article>
      </template>

      <EmptyState
        v-else
        :title="kind.emptyLabel"
        description="เพิ่มตัวเลือกแรก เพื่อให้เจ้าหน้าที่กรอกโครงการได้ครบถ้วน"
      >
        <button
          type="button"
          class="flex h-9 items-center gap-2 rounded-[8px] bg-[#1D5C48] px-4 text-[12px] font-medium text-white transition hover:bg-[#174C3B]"
          @click="openCreate"
        >
          <AdminIcon name="plus" class="h-4 w-4" />
          เพิ่มตัวเลือก
        </button>
      </EmptyState>
    </div>

    <MasterOptionModal
      v-if="formOpen"
      :kind="kind"
      :option="editing"
      :submitting="saving"
      :error="formError"
      @close="closeForm"
      @submit="handleSubmit"
    />
  </section>
</template>
