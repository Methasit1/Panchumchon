import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !anonKey) {
  throw new Error(
    'ยังไม่ได้ตั้งค่า Supabase: ให้สร้างไฟล์ .env.local แล้วใส่ VITE_SUPABASE_URL และ VITE_SUPABASE_ANON_KEY',
  )
}

export const supabase = createClient(url, anonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})
