import { supabase } from './supabase'

export async function getSession() {
  const { data, error } = await supabase.auth.getSession()
  if (error) throw error
  return data.session
}

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export function onAuthStateChange(callback) {
  return supabase.auth.onAuthStateChange(callback)
}

// F02 / BR-01: เฉพาะ user_account ที่ role = ADMIN, is_active = true และ role ยังใช้งานอยู่เท่านั้น
export async function fetchAdminProfile(user) {
  if (!user) return null

  const { data, error } = await supabase
    .from('user_account')
    .select('user_id, username, display_name, is_active, role:role_id ( role_name, is_active )')
    .eq('user_id', user.id)
    .maybeSingle()

  if (error) throw error
  return data
}

export function hasAdminRole(profile) {
  return Boolean(
    profile?.is_active === true &&
      profile.role?.is_active === true &&
      profile.role?.role_name === 'ADMIN',
  )
}
