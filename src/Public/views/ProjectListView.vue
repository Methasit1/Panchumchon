<script setup>
import PlaceholderPage from '@/shared/components/PlaceholderPage.vue'
</script>

<template>
  <PlaceholderPage
    title="รายการโครงการ"
    feature="F08 · หน้ารายการโครงการ"
    description="แสดงโครงการเป็นการ์ดสรุป (ชื่อโครงการ + วัตถุประสงค์ + แถบสถานะปัจจุบัน)"
    :notes="[
      'สีแถบสถานะต้องตรงกับสถานะจริง (F08, BR-15)',
      'ช่องที่ยังไม่กรอกต้องไม่แสดง (F08)',
      'แสดงเฉพาะปีที่มีข้อมูล และเลือกดูปีก่อนหน้าได้ (BR-28)',
    ]"
  />
</template>
