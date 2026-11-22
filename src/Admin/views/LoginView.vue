<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { login } from '@/Admin/store/auth'

const route = useRoute()
const router = useRouter()

const email = ref('')
const password = ref('')
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
  <section class="mx-auto max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
    <p class="text-xs font-medium tracking-wide text-slate-500 uppercase">F02 · หน้าเข้าสู่ระบบ</p>
    <h1 class="mt-1 text-xl font-semibold">เข้าสู่ระบบเจ้าหน้าที่</h1>
    <p class="mt-3 text-sm text-slate-600">
      เข้าสู่ระบบด้วยบัญชีผู้ดูแล (เฉพาะ role ADMIN เท่านั้นที่จัดการข้อมูลได้)
    </p>

    <form class="mt-6 space-y-4" @submit.prevent="handleSubmit">
      <label class="block text-sm">
        <span class="font-medium">อีเมล</span>
        <input
          v-model="email"
          type="email"
          required
          autocomplete="username"
          class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
        />
      </label>

      <label class="block text-sm">
        <span class="font-medium">รหัสผ่าน</span>
        <input
          v-model="password"
          type="password"
          required
          autocomplete="current-password"
          class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
        />
      </label>

      <p v-if="error" role="alert" class="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
        {{ error }}
      </p>

      <button
        type="submit"
        :disabled="loading"
        class="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {{ loading ? 'กำลังเข้าสู่ระบบ…' : 'เข้าสู่ระบบ' }}
      </button>
    </form>
  </section>
</template>
