<script setup>
import PlaceholderPage from '@/shared/components/PlaceholderPage.vue'
</script>

<template>
  <PlaceholderPage
    title="เข้าสู่ระบบเจ้าหน้าที่"
    feature="F02 · หน้าเข้าสู่ระบบ"
    description="Login ด้วยบัญชีผู้ดูแลเพื่อเข้าถึงการจัดการข้อมูล"
    :notes="[
      'ระบบรองรับบัญชีผู้ดูแลเพียงบัญชีเดียว (พี่เอ็ม) ตามข้อ 14',
      'ผู้ที่ไม่ได้เข้าสู่ระบบต้องไม่สามารถเข้าถึงหน้าจัดการข้อมูลได้ (F02)',
    ]"
  />
</template>
