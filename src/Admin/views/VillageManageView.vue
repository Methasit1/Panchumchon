<script setup>
import PlaceholderPage from '@/shared/components/PlaceholderPage.vue'
</script>

<template>
  <PlaceholderPage
    title="จัดการหมู่บ้าน"
    feature="F01 · จัดการหมู่บ้าน"
    description="เพิ่ม แก้ไข และดูรายชื่อหมู่บ้าน (ชื่อบ้าน หมู่ที่)"
    :notes="[
      'ชื่อบ้านและหมู่ที่ต้องไม่ซ้ำกัน (BR-02)',
      'หมู่บ้านที่มีโครงการอยู่แล้วให้ปิดการใช้งานแทนการลบ (F01 Acceptance Criteria)',
    ]"
  />
</template>
