import { computed, ref } from 'vue'
import {
  fetchAdminProfile,
  getSession,
  hasAdminRole,
  onAuthStateChange,
  signIn as apiSignIn,
  signOut as apiSignOut,
} from '@/services/auth'

const session = ref(null)
const profile = ref(null)
const isAdmin = ref(false)
const authReady = ref(false)
const authError = ref('')

const user = computed(() => session.value?.user ?? null)
const displayName = computed(() => profile.value?.display_name ?? '')

async function refreshAuth() {
  authError.value = ''
  try {
    session.value = await getSession()
    profile.value = session.value?.user ? await fetchAdminProfile(session.value.user) : null
    isAdmin.value = hasAdminRole(profile.value)
  } catch (error) {
    authError.value = error.message
    session.value = null
    profile.value = null
    isAdmin.value = false
  } finally {
    authReady.value = true
  }
  return isAdmin.value
}

async function login(email, password) {
  authError.value = ''
  try {
    await apiSignIn(email, password)
    const allowed = await refreshAuth()
    if (!allowed) {
      await apiSignOut()
      session.value = null
      profile.value = null
      isAdmin.value = false
      throw new Error('บัญชีนี้ไม่มีสิทธิ์ผู้ดูแลระบบ')
    }
  } catch (error) {
    authError.value = error.message
    throw error
  }
}

async function logout() {
  await apiSignOut()
  session.value = null
  profile.value = null
  isAdmin.value = false
}

// ใช้ใน main.js เพื่อให้ session ยังตรงกับ Supabase เมื่อ token เปลี่ยน/หมดอายุ
function startAuthListener() {
  const { data } = onAuthStateChange((_event, newSession) => {
    session.value = newSession
    if (!newSession?.user) {
      profile.value = null
      isAdmin.value = false
    } else {
      fetchAdminProfile(newSession.user)
        .then((result) => {
          profile.value = result
          isAdmin.value = hasAdminRole(result)
        })
        .catch((error) => {
          authError.value = error.message
        })
    }
    authReady.value = true
  })

  return () => data.subscription.unsubscribe()
}

export {
  session,
  profile,
  user,
  displayName,
  isAdmin,
  authReady,
  authError,
  refreshAuth,
  login,
  logout,
  startAuthListener,
}
