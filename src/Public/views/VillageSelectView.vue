<script setup>
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import logo from '@/assets/logo.png'
import { getCachedVillages, listVillages } from '@/services/public'

const cached = getCachedVillages()
const villages = ref(cached ?? [])
const loading = ref(!villages.value.length)
const errorMessage = ref('')

async function loadVillages({ force = false } = {}) {
  const hasData = villages.value.length > 0
  if (!hasData) loading.value = true
  errorMessage.value = ''

  try {
    villages.value = await listVillages({ force })
  } catch (error) {
    errorMessage.value = error?.message || 'ไม่สามารถโหลดรายชื่อหมู่บ้านได้'
    if (!hasData) villages.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => loadVillages())
</script>

<template>
  <div class="min-h-screen bg-[#F8FAFC] text-[#181C1B]">
    <header
      class="sticky top-0 z-20 border-b border-[#BFC9C3]/60 bg-white/90 backdrop-blur-[4px]"
    >
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

    <main class="mx-auto w-full max-w-6xl px-4 pb-10 pt-8 sm:px-6 sm:pt-10 lg:px-8">
      <section aria-labelledby="village-heading">
        <h2
          id="village-heading"
          class="mt-2 text-[28px] font-semibold leading-tight text-[#181C1B] sm:text-[34px]"
        >
          เลือกหมู่บ้าน
        </h2>
        <p class="mt-3 max-w-2xl text-[14px] leading-6 text-[#505F76] sm:text-[15px]">
          เลือกหมู่บ้านเพื่อดูรายการโครงการและความคืบหน้าการดำเนินงาน โดยไม่ต้องเข้าสู่ระบบ
        </p>

        <div class="mt-6 flex items-center justify-between gap-3 sm:mt-8">
          <p class="text-[13px] text-[#505F76]">
            <span v-if="loading">กำลังโหลดรายชื่อหมู่บ้าน...</span>
            <span v-else>พบ {{ villages.length }} หมู่บ้าน</span>
          </p>
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
            @click="loadVillages({ force: true })"
          >
            ลองใหม่
          </button>
        </div>

        <div
          v-else-if="loading"
          class="mt-4 grid gap-4 md:grid-cols-2"
          aria-hidden="true"
        >
          <div
            v-for="n in 4"
            :key="n"
            class="h-[92px] animate-pulse rounded-[12px] border border-[#BFC9C3]/70 bg-white"
          />
        </div>

        <p
          v-else-if="villages.length === 0"
          class="mt-4 rounded-[12px] border border-[#BFC9C3] bg-white px-4 py-6 text-[14px] text-[#505F76]"
        >
          ไม่พบข้อมูลหมู่บ้าน
        </p>

        <div v-else class="mt-4 grid gap-4 md:grid-cols-2">
          <RouterLink
            v-for="village in villages"
            :key="village.id"
            :to="{ name: 'public-projects', params: { villageId: village.id } }"
            class="group flex min-h-[89px] items-center justify-between gap-4 rounded-[12px] border border-[#BFC9C3] bg-white px-4 py-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition hover:border-[#1D5C48]/40 hover:shadow-[0_4px_12px_rgba(15,23,42,0.06)] focus:outline-none focus:ring-2 focus:ring-[#1D5C48]/20 sm:px-5"
          >
            <div class="min-w-0">
              <h2 class="truncate text-[18px] font-medium leading-7 text-[#181C1B]">
                {{ village.name }}
              </h2>
              <p class="mt-2 text-[14px] leading-5 text-[#505F76]">
                <template v-if="village.projectCount != null">
                  {{ village.projectCount }} โครงการ
                </template>
                <template v-else-if="village.description">
                  {{ village.description }}
                </template>
                <template v-else>
                  ดูรายละเอียดโครงการ
                </template>
              </p>
            </div>

            <span
              class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#707974] transition group-hover:bg-[#1D5C48]/8 group-hover:text-[#1D5C48]"
              aria-hidden="true"
            >
              <svg viewBox="0 0 24 24" class="h-6 w-6" fill="none">
                <path
                  d="M9 6l6 6-6 6"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
          </RouterLink>
        </div>
      </section>
    </main>
  </div>
</template>
