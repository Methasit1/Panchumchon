<script setup>
import { ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { login } from '@/store/auth'
import logo from '@/assets/logo.png'

const route = useRoute()
const router = useRouter()

const email = ref('')
const password = ref('')
const remember = ref(false)
const showPassword = ref(false)
const error = ref('')
const loading = ref(false)

async function handleSubmit() {
  error.value = ''
  loading.value = true
  try {
    await login(email.value, password.value)
    router.push(route.query.redirect?.toString() || '/admin/dashboard')
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="min-h-screen bg-[#F8FAFC] text-[#181C1B]">
    <header
      class="flex h-[58px] items-center border-b border-[#BFC9C3]/60 bg-white/80 px-4 backdrop-blur-[4px]"
    >
      <img :src="logo" alt="" class="h-[29px] w-[29px]" />
      <span class="ml-[7px] text-[14px] font-normal leading-none text-[#181C1B]">
        ระบบติดตามโครงการ
      </span>
    </header>

    <main class="mx-auto w-full max-w-[1440px] px-4 pb-10">
      <div class="mx-auto mt-[163px] w-full max-w-[440px]">
        <div
          class="rounded-[20px] border border-[#BFC9C3] bg-white px-[32px] pb-[32px] pt-[40px] shadow-[0_4px_10px_rgba(15,23,42,0.06)]"
        >
          <div class="flex flex-col items-center">
            <img :src="logo" alt="" class="h-[59px] w-[59px]" />
            <h1 class="mt-[8px] text-center text-[23px] font-medium leading-[31px]">
              เข้าสู่ระบบเจ้าหน้าที่
            </h1>
            <p class="mt-[9px] text-center text-[12px] leading-[16px] text-[#505F76]">
              กรุณาระบุชื่อผู้ใช้และรหัสผ่านเพื่อเข้าจัดการกระดานโครงการ
            </p>
          </div>

          <form class="mt-[25px]" @submit.prevent="handleSubmit">
            <div>
              <label for="email" class="block translate-y-[1px] text-[13px] font-medium leading-[16px]">
                ชื่อผู้ใช้
              </label>
              <input
                id="email"
                v-model="email"
                type="email"
                required
                autocomplete="username"
                placeholder="เช่น somsak.m หรือ รหัสประจำตัวเจ้าหน้าที่"
                class="mt-[6px] h-10 w-full rounded-[8px] border border-[#BFC9C3] bg-white pl-[37px] pt-[4px] pr-3 text-[12px] text-[#181C1B] shadow-[0_1px_1px_rgba(15,23,42,0.05)] outline-none placeholder:text-[#707974] focus:border-[#1D5C48] focus:ring-2 focus:ring-[#1D5C48]/10"
              />
            </div>

            <div class="mt-[18px] flex items-start justify-between gap-3">
              <label for="password" class="block translate-y-[1px] text-[13px] font-medium leading-[16px]">
                รหัสผ่าน
              </label>
              <a href="#" @click.prevent class="translate-y-[1px] text-[11px] font-normal leading-[16px] text-[#505F76] hover:underline">
                ลืมรหัสผ่าน?
              </a>
            </div>
            <div class="relative mt-[6px]">
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                required
                autocomplete="current-password"
                placeholder="••••••••"
                class="h-10 w-full rounded-[8px] border border-[#BFC9C3] bg-white pl-[37px] pt-[4px] pr-10 text-[12px] text-[#181C1B] shadow-[0_1px_1px_rgba(15,23,42,0.05)] outline-none placeholder:text-[#707974] focus:border-[#1D5C48] focus:ring-2 focus:ring-[#1D5C48]/10"
              />
              <button
                type="button"
                :aria-label="showPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'"
                class="absolute right-[11px] top-[13px] flex h-[18px] w-[18px] items-center justify-center text-[#505F76]"
                @click="showPassword = !showPassword"
              >
                <svg viewBox="0 0 24 24" class="h-[18px] w-[18px]" fill="none" aria-hidden="true">
                  <path
                    d="M12 5c5 0 9 3.5 10 7-1 3.5-5 7-10 7S3 15.5 2 12c1-3.5 5-7 10-7Z"
                    stroke="currentColor"
                    stroke-width="1.7"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.7" />
                </svg>
              </button>
            </div>

            <label class="mt-[23px] flex cursor-pointer items-center gap-[9px] text-[12px] leading-[16px] text-[#505F76]">
              <input v-model="remember" type="checkbox" class="peer sr-only" />
              <span
                class="flex h-[15px] w-[15px] items-center justify-center rounded-[3.5px] border border-[#BFC9C3] bg-white text-white peer-checked:border-[#1D5C48] peer-checked:bg-[#1D5C48] peer-focus-visible:ring-2 peer-focus-visible:ring-[#1D5C48]/20"
              >
                <svg v-if="remember" viewBox="0 0 12 12" class="h-2.5 w-2.5" fill="none" aria-hidden="true">
                  <path d="m2 6 2.5 2.5L10 3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </span>
              <span>จดจำการเข้าสู่ระบบ</span>
            </label>

            <p
              v-if="error"
              role="alert"
              class="mt-[10px] rounded-[8px] bg-red-50 px-3 py-2 text-[12px] text-red-700"
            >
              {{ error }}
            </p>

            <button
              type="submit"
              :disabled="loading"
              class="mt-[25px] flex h-10 w-full items-center justify-center gap-[9px] rounded-[8px] bg-[#1D5C48] text-[14px] font-medium leading-none text-white shadow-[0_1px_1px_rgba(15,23,42,0.05)] transition hover:bg-[#174C3B] focus:outline-none focus:ring-2 focus:ring-[#1D5C48]/30 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span>{{ loading ? 'กำลังเข้าสู่ระบบ…' : 'เข้าสู่ระบบ' }}</span>
              <svg viewBox="744.45 628.5 15.05 15" class="h-[15px] w-[15px]" fill="currentColor" aria-hidden="true">
                <path
                  d="M751.95 643.5V641.833H757.783V641.833V641.833V630.167V630.167V630.167H751.95V628.5H757.783C758.242 628.5 758.634 628.663 758.96 628.99C759.287 629.316 759.45 629.708 759.45 630.167V641.833C759.45 642.292 759.287 642.684 758.96 643.01C758.634 643.337 758.242 643.5 757.783 643.5H751.95V643.5M750.283 640.167L749.137 638.958L751.262 636.833H744.45V635.167H751.262L749.137 633.042L750.283 631.833L754.45 636L750.283 640.167V640.167"
                />
              </svg>
            </button>
          </form>
        </div>

        <RouterLink
          to="/public/villages"
          class="mt-[27px] flex -translate-x-[2px] items-center justify-center gap-[7px] text-[12px] font-normal leading-[14px] text-[#505F76] hover:underline"
        >
          <svg viewBox="662 717 12 12" class="h-3 w-3" fill="currentColor" aria-hidden="true">
            <path
              d="M664.869 723.75L669.069 727.95L668 729L662 723L668 717L669.069 718.05L664.869 722.25H674V723.75H664.869V723.75"
            />
          </svg>
          <span>กลับไปหน้าประชาชน</span>
        </RouterLink>

        <p class="mt-[29px] translate-x-[7px] text-center text-[11px] font-medium leading-[14px] text-[#505F76]/90">
          การเข้าสู่ระบบผ่านการเข้ารหัสความปลอดภัยตามมาตรฐานความปลอดภัยข้อมูลภาครัฐ
        </p>
      </div>
    </main>
  </section>
</template>
