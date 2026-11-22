<script setup>
import StatusBar from './StatusBar.vue'

// F08: การ์ดสรุปแสดง ชื่อโครงการ + วัตถุประสงค์ + แถบสถานะปัจจุบัน
defineProps({
  project: { type: Object, required: true },
})
</script>

<template>
  <article class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
    <h2 class="font-semibold">{{ project.project_name }}</h2>
    <p v-if="project.objective" class="mt-2 text-sm text-slate-600">
      {{ project.objective }}
    </p>
    <StatusBar v-if="project.progress_status" :status="project.progress_status" class="mt-4" />
  </article>
</template>
