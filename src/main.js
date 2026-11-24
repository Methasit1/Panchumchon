import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { refreshAuth, startAuthListener } from '@/store/auth'
import { prefetchVillages } from '@/services/public'
import './assets/main.css'

startAuthListener()
refreshAuth()
prefetchVillages()

createApp(App).use(router).mount('#app')
