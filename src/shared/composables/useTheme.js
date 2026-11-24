import { ref } from 'vue'

const STORAGE_KEY = 'panchumchon-theme'

const theme = ref('light')

function applyTheme(value) {
  if (typeof document === 'undefined') return
  document.documentElement.classList.toggle('dark', value === 'dark')
}

export function initTheme() {
  let initial = 'light'
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'light' || saved === 'dark') {
      initial = saved
    }
  } catch {
    // localStorage อาจถูกบล็อก — ใช้ค่าเริ่มต้น
  }
  theme.value = initial
  applyTheme(initial)
}

export function useTheme() {
  function toggle() {
    const next = theme.value === 'dark' ? 'light' : 'dark'
    theme.value = next
    applyTheme(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // เก็บไม่ได้ก็ไม่เป็นไร
    }
  }

  function set(value) {
    if (value !== 'light' && value !== 'dark') return
    theme.value = value
    applyTheme(value)
    try {
      localStorage.setItem(STORAGE_KEY, value)
    } catch {
      // ignore
    }
  }

  return { theme, toggle, set }
}
