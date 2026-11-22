import { createRouter, createWebHistory } from 'vue-router'
import { refreshAuth } from '@/store/auth'
import RoutePlaceholder from '@/shared/views/RoutePlaceholder.vue'

// เส้นทางจัดตามหน้าจอในข้อ 12 ของ Proposal
// ตอนนี้ทุกเส้นทางใช้หน้า placeholder ร่วมกัน — ไฟล์หน้าเว็บจริงจะสร้างใน src/Admin และ src/Public
const routes = [
  { path: '/', redirect: '/public/villages' },

  // ฝั่งประชาชน (ข้อ 3, BR-01): ดูอย่างเดียว ไม่ต้อง Login
  {
    path: '/public/villages',
    name: 'public-villages',
    component: RoutePlaceholder,
    meta: {
      area: 'public',
      title: 'เลือกหมู่บ้าน',
      feature: 'F08 · หน้าเลือกหมู่บ้าน',
      description: 'แสดงรายการหมู่บ้านให้ประชาชนเลือก โดยไม่ต้อง Login',
      notes: ['โครงการที่ถูกลบไม่แสดงต่อประชาชน (BR-17)'],
    },
  },
  {
    path: '/public/villages/:villageId/projects',
    name: 'public-projects',
    component: RoutePlaceholder,
    meta: {
      area: 'public',
      title: 'รายการโครงการ',
      feature: 'F08 · หน้ารายการโครงการ',
      description: 'การ์ดสรุป: ชื่อโครงการ + วัตถุประสงค์ + แถบสถานะปัจจุบัน',
      notes: ['สีแถบสถานะต้องตรงกับสถานะจริง (BR-15)', 'ช่องที่ยังไม่กรอกต้องไม่แสดง (F08)'],
    },
  },
  {
    path: '/public/projects/:projectId',
    name: 'public-project-detail',
    component: RoutePlaceholder,
    meta: {
      area: 'public',
      title: 'รายละเอียดโครงการ',
      feature: 'F08 · หน้ารายละเอียดโครงการ',
      description: 'แสดงรายละเอียดและความคืบหน้าของโครงการที่เลือก',
      notes: [
        'ประชาชนเห็นเฉพาะข้อมูลที่เปิดเผย (BR-17)',
        'ต้องไม่เห็นปุ่มหรือฟอร์มสำหรับแก้ไขข้อมูล (F08)',
        'ฟิลด์ที่เปิดเผยยังรอยืนยันในข้อ 5.1 / 18.1.2',
      ],
    },
  },

  // ฝั่งเจ้าหน้าที่ (ข้อ 3, F02): ต้อง Login และต้องมี role ADMIN
  {
    path: '/admin/login',
    name: 'admin-login',
    component: RoutePlaceholder,
    meta: {
      area: 'admin',
      title: 'เข้าสู่ระบบเจ้าหน้าที่',
      feature: 'F02 · หน้าเข้าสู่ระบบ',
      description: 'หน้า Login จะถูกสร้างตอนเริ่มทำเว็บฝั่ง Admin',
      notes: ['ระบบรองรับบัญชีผู้ดูแลเพียงบัญชีเดียว (ข้อ 14)'],
    },
  },
  { path: '/admin', redirect: '/admin/projects' },
  {
    path: '/admin/projects',
    name: 'admin-projects',
    component: RoutePlaceholder,
    meta: {
      area: 'admin',
      title: 'จัดการโครงการ (ตารางสรุป)',
      feature: 'F06 · หน้าจัดการโครงการ',
      description: 'ดูโครงการทั้งหมด และกดปุ่มตามสถานะ (เริ่ม / อัปเดต / เสร็จสิ้น / ยกเลิก / ลบ)',
    },
  },
  {
    path: '/admin/projects/create',
    name: 'admin-project-create',
    component: RoutePlaceholder,
    meta: {
      area: 'admin',
      title: 'สร้างการ์ดโครงการ',
      feature: 'F03 · แท็บ 1 ข้อมูลทั่วไป',
      description: 'เลือกหมู่บ้าน กรอกชื่อ ประเภท วัตถุประสงค์ และปีแผน',
      notes: ['รหัสโครงการสร้างอัตโนมัติ (BR-05)', 'ปีแผนค่าเริ่มต้นเป็นปีปัจจุบัน (BR-27)'],
    },
  },
  {
    path: '/admin/projects/:projectId',
    name: 'admin-project-form',
    component: RoutePlaceholder,
    meta: {
      area: 'admin',
      title: 'เริ่มดำเนินการ / แก้ไขโครงการ (แท็บ 1–3)',
      feature: 'F04 · F05 · พื้นที่ งบประมาณ และแผนการดำเนินงาน',
      description: 'กรอกพื้นที่และงบประมาณ พร้อมแผนการดำเนินงานและเอกสารประกอบ',
      notes: ['ต้องตรวจ BR-08 ถึง BR-11 ก่อนเปลี่ยนสถานะ', 'หมายเหตุเพิ่มได้อย่างเดียว (BR-12)'],
    },
  },
  {
    path: '/admin/villages',
    name: 'admin-villages',
    component: RoutePlaceholder,
    meta: {
      area: 'admin',
      title: 'จัดการหมู่บ้าน',
      feature: 'F01 · จัดการหมู่บ้าน',
      description: 'เพิ่ม แก้ไข และดูรายชื่อหมู่บ้าน (ชื่อบ้าน หมู่ที่)',
      notes: ['ชื่อบ้านและหมู่ที่ต้องไม่ซ้ำกัน (BR-02)'],
    },
  },
  {
    path: '/admin/master-data',
    name: 'admin-master-data',
    component: RoutePlaceholder,
    meta: {
      area: 'admin',
      title: 'จัดการข้อมูลหลัก (Dropdown)',
      feature: 'F10 · จัดการข้อมูลหลัก',
      description: 'ประเภทโครงสร้างพื้นฐาน แหล่งเงินงบประมาณ และหน่วยงานที่รับผิดชอบ',
      notes: ['ปิดการใช้งานแทนการลบ (BR-26)'],
    },
  },
  {
    path: '/admin/history',
    name: 'admin-history',
    component: RoutePlaceholder,
    meta: {
      area: 'admin',
      title: 'ประวัติการเปลี่ยนแปลง',
      feature: 'F09 · ประวัติการเปลี่ยนแปลง',
      description: 'ดูประวัติการเปลี่ยนข้อมูลสำคัญ (ค่าเดิม ค่าใหม่ ผู้ทำ เวลา)',
      notes: ['แก้ไขหรือลบประวัติไม่ได้ (BR-25)'],
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// F02: ผู้ที่ไม่ได้ Login หรือไม่มีสิทธิ์ ADMIN เข้าถึงหน้าจัดการข้อมูลไม่ได้
router.beforeEach(async (to) => {
  if (to.meta.area !== 'admin' || to.name === 'admin-login') return true

  const allowed = await refreshAuth()
  if (!allowed) {
    return { name: 'admin-login', query: { redirect: to.fullPath } }
  }
  return true
})

export default router
