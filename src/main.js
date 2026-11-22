import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { refreshAuth, startAuthListener } from '@/Admin/store/auth'
import './assets/main.css'

startAuthListener()
refreshAuth()

createApp(App).use(router).mount('#app')
