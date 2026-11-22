import { createRouter, createWebHistory } from 'vue-router'

// เส้นทางจัดตามหน้าจอในข้อ 12 ของ Proposal
const routes = [
  { path: '/', redirect: '/public/villages' },

  // ฝั่งประชาชน (ข้อ 3, BR-01): ดูอย่างเดียว ไม่ต้อง Login
  {
    path: '/public/villages',
    name: 'public-villages',
    component: () => import('@/Public/views/VillageListView.vue'),
    meta: { area: 'public' },
  },
  {
    path: '/public/villages/:villageId/projects',
    name: 'public-projects',
    component: () => import('@/Public/views/ProjectListView.vue'),
    meta: { area: 'public' },
  },
  {
    path: '/public/projects/:projectId',
    name: 'public-project-detail',
    component: () => import('@/Public/views/ProjectDetailView.vue'),
    meta: { area: 'public' },
  },

  // ฝั่งเจ้าหน้าที่ (ข้อ 3, F02): ต้อง Login — จะเพิ่ม navigation guard หลังยืนยันโครง Login
  {
    path: '/admin/login',
    name: 'admin-login',
    component: () => import('@/Admin/views/LoginView.vue'),
    meta: { area: 'admin' },
  },
  { path: '/admin', redirect: '/admin/projects' },
  {
    path: '/admin/projects',
    name: 'admin-projects',
    component: () => import('@/Admin/views/ProjectTableView.vue'),
    meta: { area: 'admin' },
  },
  {
    path: '/admin/projects/create',
    name: 'admin-project-create',
    component: () => import('@/Admin/views/ProjectCreateView.vue'),
    meta: { area: 'admin' },
  },
  {
    path: '/admin/projects/:projectId',
    name: 'admin-project-form',
    component: () => import('@/Admin/views/ProjectFormTabsView.vue'),
    meta: { area: 'admin' },
  },
  {
    path: '/admin/villages',
    name: 'admin-villages',
    component: () => import('@/Admin/views/VillageManageView.vue'),
    meta: { area: 'admin' },
  },
  {
    path: '/admin/master-data',
    name: 'admin-master-data',
    component: () => import('@/Admin/views/MasterDataManageView.vue'),
    meta: { area: 'admin' },
  },
  {
    path: '/admin/history',
    name: 'admin-history',
    component: () => import('@/Admin/views/HistoryView.vue'),
    meta: { area: 'admin' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
