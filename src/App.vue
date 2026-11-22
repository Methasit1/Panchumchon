<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { displayName, isAdmin, logout } from '@/Admin/store/auth'

const router = useRouter()

async function handleLogout() {
  await logout()
  router.push('/public/villages')
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 text-slate-800">
    <header class="border-b border-slate-200 bg-white">
      <div class="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-4 py-3">
        <RouterLink to="/public/villages" class="text-lg font-semibold">
          แผนชุมชน
        </RouterLink>

        <nav class="flex flex-wrap gap-4 text-sm">
          <RouterLink
            to="/public/villages"
            class="rounded px-2 py-1 hover:bg-slate-100"
            active-class="bg-slate-900 text-white hover:bg-slate-900"
          >
            ฝั่งประชาชน
          </RouterLink>
          <RouterLink
            to="/admin/projects"
            class="rounded px-2 py-1 hover:bg-slate-100"
            active-class="bg-slate-900 text-white hover:bg-slate-900"
          >
            ฝั่งเจ้าหน้าที่
          </RouterLink>
        </nav>

        <div v-if="isAdmin" class="ml-auto flex items-center gap-3 text-sm">
          <span class="text-slate-600">{{ displayName }}</span>
          <button
            type="button"
            class="rounded border border-slate-300 px-2 py-1 hover:bg-slate-100"
            @click="handleLogout"
          >
            ออกจากระบบ
          </button>
        </div>
      </div>
    </header>

    <main class="mx-auto max-w-6xl px-4 py-8">
      <RouterView />
    </main>
  </div>
</template>
