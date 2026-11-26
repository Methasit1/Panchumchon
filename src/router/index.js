import { createRouter, createWebHistory } from 'vue-router'
import { refreshAuth } from '@/store/auth'
import RoutePlaceholder from '@/shared/views/RoutePlaceholder.vue'
import LoginView from '@/Admin/views/LoginView.vue'
import AdminLayout from '@/Admin/layouts/AdminLayout.vue'
import DashboardView from '@/Admin/views/DashboardView.vue'
import ManageProjectsView from '@/Admin/views/ManageProjectsView.vue'
import ManageVillagesView from '@/Admin/views/ManageVillagesView.vue'
import MasterDataView from '@/Admin/views/MasterDataView.vue'
import ProjectFormView from '@/Admin/views/ProjectFormView.vue'

// เส้นทางจัดตามหน้าจอในข้อ 12 ของ Proposal
// ฝั่ง admin ใช้ AdminLayout เป็นแม่ เพื่อให้ sidebar/header ใช้ร่วมทุกหน้า
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
    component: LoginView,
    meta: {
      area: 'admin',
      title: 'เข้าสู่ระบบเจ้าหน้าที่',
      feature: 'F02 · หน้าเข้าสู่ระบบ',
      description: 'หน้า Login จะถูกสร้างตอนเริ่มทำเว็บฝั่ง Admin',
      notes: ['ระบบรองรับบัญชีผู้ดูแลเพียงบัญชีเดียว (ข้อ 14)'],
      bareLayout: true,
    },
  },

  // ทุกหน้าใต้ /admin ใช้ layout ร่วม (sidebar + header)
  {
    path: '/admin',
    component: AdminLayout,
    meta: { area: 'admin' },
    children: [
      { path: '', redirect: '/admin/dashboard' },
      {
        path: 'dashboard',
        name: 'admin-dashboard',
        component: DashboardView,
        meta: {
          title: 'แดชบอร์ดภาพรวม',
          feature: 'ภาพรวมโครงการและงบประมาณรายหมู่บ้าน',
          description: 'สรุปจำนวนโครงการ งบประมาณ และความคืบหน้าของปีงบประมาณที่เลือก',
        },
      },
      {
        path: 'projects',
        name: 'admin-projects',
        component: ManageProjectsView,
        meta: {
          title: 'จัดการโครงการ',
          feature: 'F06 · หน้าจัดการโครงการ',
          description: 'บริหารจัดการสถานะ ความคืบหน้า และควบคุมโครงการโครงสร้างพื้นฐานทุกหมู่บ้าน',
        },
      },
      {
        path: 'projects/create',
        name: 'admin-project-create',
        redirect: (to) => ({ name: 'admin-projects', query: { ...to.query, create: '1' } }),
      },
      {
        path: 'projects/:projectId',
        name: 'admin-project-form',
        component: ProjectFormView,
        meta: {
          title: 'เริ่มดำเนินการ / แก้ไขโครงการ (แท็บ 1–3)',
          feature: 'F04 · F05 · พื้นที่ งบประมาณ และแผนการดำเนินงาน',
          description: 'กรอกพื้นที่และงบประมาณ พร้อมแผนการดำเนินงานและเอกสารประกอบ',
          notes: ['ต้องตรวจ BR-08 ถึง BR-11 ก่อนเปลี่ยนสถานะ', 'หมายเหตุเพิ่มได้อย่างเดียว (BR-12)'],
        },
      },
      {
        path: 'villages',
        name: 'admin-villages',
        component: ManageVillagesView,
        meta: {
          title: 'หมู่บ้าน',
          feature: 'F01 · จัดการหมู่บ้าน',
          description: 'จัดการรายชื่อหมู่บ้านและสถานะการดำเนินงานโครงการ',
        },
      },
      {
        path: 'villages/create',
        name: 'admin-village-create',
        redirect: (to) => ({ name: 'admin-villages', query: { ...to.query, create: '1' } }),
      },
      {
        path: 'master-data',
        name: 'admin-master-data',
        redirect: '/admin/master-data/infra-types',
      },
      {
        path: 'master-data/infra-types',
        name: 'admin-master-infra-types',
        component: MasterDataView,
        meta: {
          masterKind: 'infra',
          title: 'ประเภทโครงสร้างพื้นฐาน',
          feature: 'F10 · ข้อมูลพื้นฐาน',
          description: 'ตัวเลือกประเภทงานที่ใช้ตอนกรอกโครงการ',
        },
      },
      {
        path: 'master-data/agencies',
        name: 'admin-master-agencies',
        component: MasterDataView,
        meta: {
          masterKind: 'agency',
          title: 'หน่วยงานผู้รับผิดชอบ',
          feature: 'F10 · ข้อมูลพื้นฐาน',
          description: 'ตัวเลือกหน่วยงานที่ใช้ตอนกรอกโครงการ',
        },
      },
      {
        path: 'master-data/funding-sources',
        name: 'admin-master-funding-sources',
        component: MasterDataView,
        meta: {
          masterKind: 'funding',
          title: 'แหล่งเงิน',
          feature: 'F10 · ข้อมูลพื้นฐาน',
          description: 'ตัวเลือกแหล่งเงินที่ใช้ตอนกรอกโครงการ',
        },
      },
      {
        path: 'master-data/create',
        name: 'admin-master-create',
        redirect: '/admin/master-data/infra-types?create=1',
      },
      {
        path: 'history',
        name: 'admin-history',
        component: RoutePlaceholder,
        meta: {
          title: 'ประวัติการเปลี่ยนแปลง',
          feature: 'F09 · ประวัติการเปลี่ยนแปลง',
          description: 'ดูประวัติการเปลี่ยนข้อมูลสำคัญ (ค่าเดิม ค่าใหม่ ผู้ทำ เวลา)',
          notes: ['แก้ไขหรือลบประวัติไม่ได้ (BR-25)'],
        },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// F02: ผู้ที่ไม่ได้ Login หรือไม่มีสิทธิ์ ADMIN เข้าถึงหน้าจัดการข้อมูลไม่ได้
router.beforeEach(async (to) => {
  const isAdminArea = to.matched.some((record) => record.meta.area === 'admin')
  if (!isAdminArea || to.name === 'admin-login') return true

  const allowed = await refreshAuth()
  if (!allowed) {
    return { name: 'admin-login', query: { redirect: to.fullPath } }
  }
  return true
})

export default router
