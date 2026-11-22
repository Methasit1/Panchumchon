<script setup>
import { RouterLink, RouterView } from 'vue-router'
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
      </div>
    </header>

    <main class="mx-auto max-w-6xl px-4 py-8">
      <RouterView />
    </main>
  </div>
</template>
