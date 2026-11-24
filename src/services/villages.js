import { supabase } from './supabase'

// BR-02: ชื่อหมู่บ้าน + หมู่ที่ ต้องไม่ซ้ำกัน (unique constraint ใน DB)
function friendlyError(error) {
  if (error?.code === '23505' || /duplicate key/i.test(error?.message ?? '')) {
    return new Error('ชื่อหมู่บ้านและหมู่ที่นี้มีอยู่แล้ว กรุณาตรวจสอบอีกครั้ง (BR-02)')
  }
  return error
}

// รายชื่อหมู่บ้านทั้งหมด (รวมที่ปิดใช้งาน) + จำนวนโครงการ
// ถ้าไม่ระบุปี จะนับทุกปีแผน (ค่าเริ่มต้นของหน้านี้)
export async function fetchVillagesWithCounts(year = null) {
  let projectQuery = supabase
    .from('project')
    .select('village_id')
    .eq('is_deleted', false) // BR-17

  if (year) projectQuery = projectQuery.eq('plan_year', year)

  const [villageResult, projectResult] = await Promise.all([
    supabase
      .from('village')
      .select('village_id, village_name, moo_no, is_active')
      .order('moo_no', { ascending: true }),
    projectQuery,
  ])

  if (villageResult.error) throw villageResult.error
  if (projectResult.error) throw projectResult.error

  const counts = new Map()
  for (const row of projectResult.data ?? []) {
    counts.set(row.village_id, (counts.get(row.village_id) ?? 0) + 1)
  }

  return (villageResult.data ?? [])
    .map((village) => ({
      id: village.village_id,
      name: village.village_name,
      mooNo: village.moo_no,
      isActive: village.is_active,
      projectCount: counts.get(village.village_id) ?? 0,
    }))
    // หมู่บ้านที่เปิดใช้งานอยู่ขึ้นก่อน แล้วเรียงตามหมู่ที่
    .sort((a, b) => Number(b.isActive) - Number(a.isActive) || a.mooNo - b.mooNo)
}

export async function createVillage({ name, mooNo }) {
  const { data, error } = await supabase
    .from('village')
    .insert({ village_name: name.trim(), moo_no: mooNo })
    .select('village_id')
    .single()

  if (error) throw friendlyError(error)
  return data
}

// BR-26: ใช้การปิดใช้งานแทนการลบ (ลบไม่ได้เพราะโครงการอ้างอิงอยู่)
export async function updateVillage(villageId, { name, mooNo, isActive }) {
  const { error } = await supabase
    .from('village')
    .update({ village_name: name.trim(), moo_no: mooNo, is_active: isActive })
    .eq('village_id', villageId)

  if (error) throw friendlyError(error)
}
