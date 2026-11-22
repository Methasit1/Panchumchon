<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { login } from '@/store/auth'

const route = useRoute()
const router = useRouter()

const email = ref('')
const password = ref('')
const remember = ref(false)
const error = ref('')
const loading = ref(false)

async function handleSubmit() {
  error.value = ''
  loading.value = true
  try {
    await login(email.value, password.value)
    router.push(route.query.redirect?.toString() || '/admin/projects')
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="min-h-screen bg-[#F8FAFC]">
    <header
      class="flex h-[58px] items-center border-b border-[#BFC9C3] bg-white/70 px-6 backdrop-blur-md"
    >
      <div class="flex items-center gap-2.5">
        <svg viewBox="0 0 64 64" class="h-7 w-7" aria-hidden="true">
          <rect width="64" height="64" rx="18" fill="#1D5C48" />
          <path
            d="M16 33 32 20l16 13"
            stroke="white"
            stroke-width="4"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M21 31v16h22V31"
            stroke="white"
            stroke-width="4"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path d="M29 47V37h6v10h-6Z" fill="white" />
          <circle cx="47" cy="18" r="4" fill="#A7D3B8" />
        </svg>
        <span class="text-[15px] font-semibold tracking-tight text-[#1D5C48]">แผนชุมชน</span>
      </div>
    </header>

    <div class="flex min-h-[calc(100vh-58px)] items-center justify-center px-4 py-10">
      <div
        class="w-full max-w-[440px] rounded-[20px] border border-[#BFC9C3] bg-white px-[33px] py-10 shadow-[0_12px_40px_rgba(15,23,42,0.08)]"
      >
        <div class="flex flex-col items-center">
          <svg viewBox="0 0 64 64" class="h-[59px] w-[59px]" aria-hidden="true">
            <rect width="64" height="64" rx="18" fill="#1D5C48" />
            <path
              d="M16 33 32 20l16 13"
              stroke="white"
              stroke-width="4"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M21 31v16h22V31"
              stroke="white"
              stroke-width="4"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path d="M29 47V37h6v10h-6Z" fill="white" />
            <circle cx="47" cy="18" r="4" fill="#A7D3B8" />
          </svg>
          <h1 class="mt-4 text-[22px] font-semibold text-slate-900">เข้าสู่ระบบเจ้าหน้าที่</h1>
          <p class="mt-1.5 text-center text-[13px] text-slate-500">
            จัดการข้อมูลแผนและโครงการของชุมชน
          </p>
        </div>

        <form class="mt-8 space-y-4" @submit.prevent="handleSubmit">
          <label for="email" class="sr-only">อีเมล</label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            autocomplete="username"
            placeholder="อีเมล"
            class="h-10 w-full rounded-[12px] border border-[#BFC9C3] bg-white px-4 text-[14px] text-slate-800 outline-none placeholder:text-slate-400 focus:border-[#1D5C48] focus:ring-2 focus:ring-[#1D5C48]/15"
          />

          <label for="password" class="sr-only">รหัสผ่าน</label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            autocomplete="current-password"
            placeholder="รหัสผ่าน"
            class="h-10 w-full rounded-[12px] border border-[#BFC9C3] bg-white px-4 text-[14px] text-slate-800 outline-none placeholder:text-slate-400 focus:border-[#1D5C48] focus:ring-2 focus:ring-[#1D5C48]/15"
          />

          <label class="flex items-center gap-2 text-[13px] text-slate-600">
            <input
              v-model="remember"
              type="checkbox"
              class="h-[15px] w-[15px] rounded-[4px] border-[#BFC9C3] accent-[#1D5C48] focus:ring-2 focus:ring-[#1D5C48]/20"
            />
            จดจำฉัน
          </label>

          <p
            v-if="error"
            role="alert"
            class="rounded-[10px] bg-red-50 px-3 py-2 text-[13px] text-red-700"
          >
            {{ error }}
          </p>

          <button
            type="submit"
            :disabled="loading"
            class="flex h-10 w-full items-center justify-center gap-2 rounded-[12px] bg-[#1D5C48] text-[14px] font-medium text-white shadow-sm transition hover:bg-[#174C3B] focus:outline-none focus:ring-2 focus:ring-[#1D5C48]/30 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span>{{ loading ? 'กำลังเข้าสู่ระบบ…' : 'เข้าสู่ระบบ' }}</span>
            <svg viewBox="0 0 20 20" class="h-4 w-4" fill="none" aria-hidden="true">
              <path
                d="M4 10h11m-4-4 4 4-4 4"
                stroke="currentColor"
                stroke-width="1.6"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </form>
      </div>
    </div>
  </section>
</template>
