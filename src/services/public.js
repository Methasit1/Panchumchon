import { supabase } from './supabase'

const CACHE_TTL_MS = 60_000
const STORAGE_KEY = 'pc:public:villages:v1'
const PROJECTS_STORAGE_PREFIX = 'pc:public:village-projects:v1:'

let cachedVillages = null
let cachedAt = 0
let inflight = null

const projectCache = new Map()
const projectInflight = new Map()

function canUseStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

function readStoredJson(key) {
  if (!canUseStorage()) return null
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function writeStoredJson(key, value) {
  if (!canUseStorage()) return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Ignore storage quota/privacy errors; in-memory cache still works.
  }
}

function readStoredVillages() {
  const parsed = readStoredJson(STORAGE_KEY)
  if (!Array.isArray(parsed?.data)) return null
  return {
    data: parsed.data.filter((village) => village && village.id && village.name),
    at: Number(parsed.at) || 0,
  }
}

function writeStoredVillages(data) {
  writeStoredJson(STORAGE_KEY, { at: Date.now(), data })
}

function normalizeVillage(row, projectCountMap) {
  const id = String(row.village_id ?? '')
  const mooNo = row.moo_no
  const villageName = String(row.village_name ?? '').trim()
  const mooLabel = mooNo == null ? '' : `หมู่ที่ ${mooNo}`
  const projectCount = projectCountMap?.get(id)

  return {
    id,
    name: [mooLabel, villageName].filter(Boolean).join(' ').trim() || `หมู่บ้าน ${id}`,
    description: '',
    projectCount: Number.isFinite(projectCount) ? projectCount : null,
  }
}

export function getCachedVillages() {
  if (cachedVillages) return cachedVillages
  const stored = readStoredVillages()
  if (!stored) return null
  cachedVillages = stored.data
  cachedAt = stored.at
  return cachedVillages
}

async function fetchProjectCountMap() {
  const { data, error } = await supabase
    .from('project')
    .select('village_id')
    .eq('is_deleted', false)

  if (error) throw error

  const map = new Map()
  for (const row of data ?? []) {
    const id = String(row.village_id ?? '')
    if (!id) continue
    map.set(id, (map.get(id) ?? 0) + 1)
  }
  return map
}

export async function listVillages({ force = false } = {}) {
  const fresh = cachedVillages && Date.now() - cachedAt < CACHE_TTL_MS
  if (!force && fresh) return cachedVillages
  if (!force && inflight) return inflight

  inflight = (async () => {
    const [villagesResult, countsResult] = await Promise.allSettled([
      supabase
        .from('village')
        .select('village_id, village_name, moo_no')
        .eq('is_active', true)
        .order('moo_no', { ascending: true })
        .order('village_name', { ascending: true }),
      fetchProjectCountMap(),
    ])

    if (villagesResult.status !== 'fulfilled') throw villagesResult.reason
    const { data, error } = villagesResult.value
    if (error) throw error

    const projectCountMap = countsResult.status === 'fulfilled' ? countsResult.value : null

    cachedVillages = (data ?? [])
      .map((row) => normalizeVillage(row, projectCountMap))
      .filter((village) => village.id)
    cachedAt = Date.now()
    writeStoredVillages(cachedVillages)
    return cachedVillages
  })()

  try {
    return await inflight
  } finally {
    inflight = null
  }
}

export function prefetchVillages() {
  return listVillages().catch(() => {})
}

function normalizeProject(row) {
  const id = String(row.project_id ?? '')
  const percent = Number(row.progress_percent)
  return {
    id,
    name: String(row.project_name ?? '').trim(),
    objective: String(row.objective ?? '').trim(),
    status: String(row.progress_status ?? '').trim(),
    progressPercent: Number.isFinite(percent) ? Math.min(100, Math.max(0, percent)) : 0,
    planYear: row.plan_year == null ? null : Number(row.plan_year),
  }
}

export function getCachedVillage(villageId) {
  const id = String(villageId ?? '')
  if (!id) return null
  return getCachedVillages()?.find((village) => village.id === id) ?? null
}

export async function getVillage(villageId, { force = false } = {}) {
  const id = String(villageId ?? '')
  if (!id) return null

  const cached = !force ? getCachedVillage(id) : null
  if (cached) return cached

  const { data, error } = await supabase
    .from('village')
    .select('village_id, village_name, moo_no')
    .eq('village_id', id)
    .eq('is_active', true)
    .maybeSingle()

  if (error) throw error
  if (!data) return null
  return normalizeVillage(data, null)
}

function readStoredProjects(villageId) {
  const parsed = readStoredJson(`${PROJECTS_STORAGE_PREFIX}${villageId}`)
  if (!Array.isArray(parsed?.data)) return null
  return {
    data: parsed.data.filter((project) => project && project.id && project.name),
    at: Number(parsed.at) || 0,
  }
}

function writeStoredProjects(villageId, data) {
  writeStoredJson(`${PROJECTS_STORAGE_PREFIX}${villageId}`, { at: Date.now(), data })
}

export function getCachedProjects(villageId) {
  const id = String(villageId ?? '')
  if (!id) return null
  const cached = projectCache.get(id)
  if (cached) return cached.data

  const stored = readStoredProjects(id)
  if (!stored) return null
  projectCache.set(id, stored)
  return stored.data
}

export async function listProjectsByVillage(villageId, { force = false } = {}) {
  const id = String(villageId ?? '')
  if (!id) return []

  const cached = projectCache.get(id)
  const fresh = cached && Date.now() - cached.at < CACHE_TTL_MS
  if (!force && fresh) return cached.data
  if (!force && projectInflight.has(id)) return projectInflight.get(id)

  const request = (async () => {
    const { data, error } = await supabase
      .from('project')
      .select('project_id, project_name, objective, progress_status, progress_percent, plan_year')
      .eq('village_id', id)
      .eq('is_deleted', false)
      .order('created_at', { ascending: false })

    if (error) throw error

    const projects = (data ?? []).map(normalizeProject).filter((project) => project.id && project.name)
    projectCache.set(id, { data: projects, at: Date.now() })
    writeStoredProjects(id, projects)
    return projects
  })()

  projectInflight.set(id, request)
  try {
    return await request
  } finally {
    projectInflight.delete(id)
  }
}
