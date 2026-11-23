import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { refreshAuth, startAuthListener } from '@/store/auth'
import './assets/main.css'

startAuthListener()
refreshAuth()

const app = createApp(App).use(router)

// รอให้ router แก้ guard (ตรวจสิทธิ์) เสร็จก่อน mount
// ไม่งั้นจะเห็น header ฝั่งประชาชนแวบหนึ่งก่อนเข้า /admin
router.isReady().then(() => app.mount('#app'))
