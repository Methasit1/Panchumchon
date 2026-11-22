<script setup>
import { useRoute } from 'vue-router'
import PlaceholderPage from '@/shared/components/PlaceholderPage.vue'

const route = useRoute()
</script>

<template>
  <PlaceholderPage
    :title="String(route.meta.title ?? 'ยังไม่ได้สร้างหน้านี้')"
    :feature="String(route.meta.feature ?? '')"
    :description="
      String(route.meta.description ?? 'หน้านี้จะสร้างตอนเริ่มทำเว็บฝั่งที่เกี่ยวข้อง')
    "
    :notes="route.meta.notes ?? []"
  />
</template>
