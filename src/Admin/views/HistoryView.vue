<script setup>
import PlaceholderPage from '@/shared/components/PlaceholderPage.vue'
</script>

<template>
  <PlaceholderPage
    title="ประวัติการเปลี่ยนแปลง"
    feature="F09 · ประวัติการเปลี่ยนแปลง"
    description="ดูประวัติการเปลี่ยนข้อมูลสำคัญ (ค่าเดิม ค่าใหม่ ผู้ทำ เวลา)"
    :notes="[
      'ข้อมูลที่ต้องเก็บประวัติ: ชื่อ สถานะ ความคืบหน้า งบประมาณ ผู้รับผิดชอบ และวันที่ (BR-25)',
      'ประวัติที่บันทึกแล้วแก้ไขหรือลบไม่ได้ (F09–F10 Acceptance Criteria)',
    ]"
  />
</template>
