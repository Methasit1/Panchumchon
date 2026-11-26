import { supabase } from './supabase'

// ตาราง + คอลัมน์ของข้อมูลพื้นฐานแต่ละชนิด (F10)
const TABLES = {
  infra: { table: 'infra_type', id: 'infra_type_id', name: 'type_name' },
  agency: { table: 'agency', id: 'agency_id', name: 'agency_name' },
  funding: { table: 'funding_source', id: 'funding_source_id', name: 'source_name' },
}

function configOf(kind) {
  const config = TABLES[kind]
  if (!config) throw new Error('ไม่รู้จักชนิดข้อมูลพื้นฐาน')
  return config
}

function friendlyError(error) {
  if (error?.code === '23505' || /duplicate key/i.test(error?.message ?? '')) {
    return new Error('ชื่อนี้มีอยู่แล้ว กรุณาใช้ชื่ออื่น')
  }
  return error
}

function cleanName(name) {
  const value = String(name ?? '').trim()
  if (!value) throw new Error('กรุณากรอกชื่อตัวเลือก')
  return value
}

// จำนวนโครงการ (ไม่นับที่ถูกลบ) แยกตามตัวเลือกของข้อมูลพื้นฐานแต่ละชนิด
async function fetchActiveProjectIds() {
  const { data, error } = await supabase
    .from('project')
    .select('project_id')
    .eq('is_deleted', false)

  if (error) throw error
  return new Set((data ?? []).map((row) => row.project_id))
}

async function fetchProjectCountMap(kind) {
  if (kind === 'infra') {
    const { data, error } = await supabase
      .from('project')
      .select('infra_type_id')
      .eq('is_deleted', false)

    if (error) throw error

    const map = new Map()
    for (const row of data ?? []) {
      map.set(row.infra_type_id, (map.get(row.infra_type_id) ?? 0) + 1)
    }
    return map
  }

  // agency / funding: นับผ่านตารางเชื่อม แล้วคัดเฉพาะโครงการที่ยังไม่ถูกลบ
  const projectIds = await fetchActiveProjectIds()
  const table = kind === 'agency' ? 'project_agency' : 'project_location_budget'
  const column = kind === 'agency' ? 'agency_id' : 'funding_source_id'

  const { data, error } = await supabase.from(table).select(`project_id, ${column}`)
  if (error) throw error

  const map = new Map()
  for (const row of data ?? []) {
    if (!projectIds.has(row.project_id)) continue
    const key = row[column]
    map.set(key, (map.get(key) ?? 0) + 1)
  }
  return map
}

// รายการตัวเลือก + จำนวนโครงการที่อ้างถึง
export async function fetchMasterOptions(kind) {
  const config = configOf(kind)

  const [optionResult, countMap] = await Promise.all([
    supabase
      .from(config.table)
      .select(`${config.id}, ${config.name}, is_active`)
      .order(config.name, { ascending: true }),
    fetchProjectCountMap(kind),
  ])

  if (optionResult.error) throw optionResult.error

  return (optionResult.data ?? [])
    .map((row) => ({
      id: row[config.id],
      name: row[config.name],
      isActive: row.is_active,
      projectCount: countMap.get(row[config.id]) ?? 0,
    }))
    .sort((a, b) => Number(b.isActive) - Number(a.isActive) || a.name.localeCompare(b.name, 'th'))
}

// ตัวเลขบนการ์ดสรุปทั้ง 3 ชนิด (นับจำนวนตัวเลือกทั้งหมด)
export async function fetchMasterCounts() {
  const entries = await Promise.all(
    Object.entries(TABLES).map(async ([kind, config]) => {
      const { count, error } = await supabase
        .from(config.table)
        .select(config.id, { count: 'exact', head: true })

      if (error) throw error
      return [kind, count ?? 0]
    }),
  )

  return Object.fromEntries(entries)
}

export async function createMasterOption(kind, name) {
  const config = configOf(kind)
  const { data, error } = await supabase
    .from(config.table)
    .insert({ [config.name]: cleanName(name) })
    .select(config.id)
    .single()

  if (error) throw friendlyError(error)
  return data
}

// BR-26: ใช้การปิดใช้งานแทนการลบ (เพราะโครงการอ้างอิงอยู่)
export async function updateMasterOption(kind, id, { name, isActive }) {
  const config = configOf(kind)
  const { error } = await supabase
    .from(config.table)
    .update({ [config.name]: cleanName(name), is_active: isActive })
    .eq(config.id, id)

  if (error) throw friendlyError(error)
}
