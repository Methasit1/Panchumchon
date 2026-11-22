<script setup>
defineProps({
  title: { type: String, required: true },
  feature: { type: String, default: '' },
  description: { type: String, default: '' },
  notes: { type: Array, default: () => [] },
})
</script>

<template>
  <section class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
    <p v-if="feature" class="text-xs font-medium tracking-wide text-slate-500 uppercase">
      {{ feature }}
    </p>
    <h1 class="mt-1 text-xl font-semibold">{{ title }}</h1>
    <p v-if="description" class="mt-3 text-sm text-slate-600">{{ description }}</p>

    <ul v-if="notes.length" class="mt-5 space-y-2 border-t border-slate-100 pt-4">
      <li
        v-for="note in notes"
        :key="note"
        class="flex gap-2 text-sm text-slate-600 before:text-amber-500 before:content-['•']"
      >
        {{ note }}
      </li>
    </ul>

    <p class="mt-6 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500">
      โครงหน้าเว็บ (scaffold) — ยังไม่เพิ่มตรรกะและข้อมูลจริง
    </p>
  </section>
</template>
