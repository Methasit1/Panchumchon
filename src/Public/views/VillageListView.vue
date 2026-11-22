<script setup>
import PlaceholderPage from '@/shared/components/PlaceholderPage.vue'
</script>

<template>
  <PlaceholderPage
    title="เลือกหมู่บ้าน"
    feature="F08 · หน้าเลือกหมู่บ้าน"
    description="แสดงรายการหมู่บ้านให้ประชาชนเลือก โดยไม่ต้อง Login"
    :notes="[
      'เข้าดูได้โดยไม่ต้อง Login และต้องไม่เห็นปุ่มหรือฟอร์มสำหรับแก้ไขข้อมูล (F08)',
      'โครงการที่ถูกลบไม่แสดงต่อประชาชน (BR-17)',
    ]"
  />
</template>
