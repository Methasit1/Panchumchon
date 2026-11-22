<script setup>
import PlaceholderPage from '@/shared/components/PlaceholderPage.vue'
</script>

<template>
  <PlaceholderPage
    title="จัดการข้อมูลหลัก (Dropdown)"
    feature="F10 · จัดการข้อมูลหลัก"
    description="จัดการตัวเลือกประเภทโครงสร้างพื้นฐาน แหล่งเงินงบประมาณ และหน่วยงานที่รับผิดชอบ"
    :notes="[
      'ตัวเลือกที่ถูกใช้แล้วห้ามลบ ให้ปิดการใช้งานแทน (BR-26, F09–F10 Acceptance Criteria)',
      'โครงการเก่ายังแสดงตัวเลือกเดิมได้ (F09–F10 Acceptance Criteria)',
      'รายการตัวเลือกทั้งหมดยังอยู่ระหว่างรอยืนยันในข้อ 18.3.2 — ยังไม่กำหนดค่าเอง',
    ]"
  />
</template>
