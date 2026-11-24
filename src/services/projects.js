import { PROJECT_STATUS } from '@/shared/constants/status'
import { supabase } from './supabase'

const MANAGE_SELECT = `
  project_id,
  project_code,
  project_name,
  objective,
  structure_status,
  progress_status,
  progress_percent,
  plan_year,
  cancel_reason,
  created_at,
  village:village_id ( village_id, village_name, moo_no ),
  infra_type:infra_type_id ( infra_type_id, type_name ),
  project_location_budget ( latitude, longitude, location_text, budget_amount, fiscal_year, funding_source_id ),
  project_plan ( planned_start, planned_end, actual_start, actual_end ),
  project_agency ( agency_id ),
  project_attachment ( attachment_id )
`

function firstOf(value) {
  return Array.isArray(value) ? (value[0] ?? null) : value
}

function normalizeProject(row) {
  const budget = firstOf(row.project_location_budget)
  const plan = firstOf(row.project_plan)

  return {
    id: row.project_id,
    code: row.project_code,
    name: row.project_name,
    objective: row.objective,
    structureStatus: row.structure_status,
    status: row.progress_status,
    progress: row.progress_percent ?? 0,
    planYear: row.plan_year,
    cancelReason: row.cancel_reason ?? '',
    createdAt: row.created_at,
    villageId: row.village?.village_id ?? null,
    villageName: row.village?.village_name ?? '',
    mooNo: row.village?.moo_no ?? null,
    typeName: row.infra_type?.type_name ?? '',
    budget: Number(budget?.budget_amount ?? 0),
    location: {
      latitude: budget?.latitude ?? null,
      longitude: budget?.longitude ?? null,
      text: budget?.location_text ?? '',
      fiscalYear: budget?.fiscal_year ?? null,
      fundingSourceId: budget?.funding_source_id ?? null,
    },
    plan: {
      plannedStart: plan?.planned_start ?? null,
      plannedEnd: plan?.planned_end ?? null,
      actualStart: plan?.actual_start ?? null,
      actualEnd: plan?.actual_end ?? null,
    },
    agencyIds: (row.project_agency ?? []).map((item) => item.agency_id),
    attachmentCount: (row.project_attachment ?? []).length,
  }
}

export async function fetchManageProjects(year) {
  const { data, error } = await supabase
    .from('project')
    .select(MANAGE_SELECT)
    .eq('plan_year', year)
    .eq('is_deleted', false) // BR-17
    .order('created_at', { ascending: true })

  if (error) throw error
  return (data ?? []).map(normalizeProject)
}

// BR-05: INF-69001 = INF + ปี พ.ศ. 2 หลักท้าย + ลำดับ 3 หลัก (ตัวนับรายปี)
async function nextProjectCode(planYear) {
  const { data, error } = await supabase
    .from('project_code_counter')
    .select('last_no')
    .eq('plan_year', planYear)
    .maybeSingle()

  if (error) throw error

  const nextNo = (data?.last_no ?? 0) + 1

  const { error: upsertError } = await supabase
    .from('project_code_counter')
    .upsert({ plan_year: planYear, last_no: nextNo }, { onConflict: 'plan_year' })

  if (upsertError) throw upsertError

  return `INF-${String(planYear).slice(-2)}${String(nextNo).padStart(3, '0')}`
}

// BR-06, BR-27: ชื่อ ประเภท วัตถุประสงค์ และปีแผนบังคับ; เริ่มที่สถานะรออนุมัติ
export async function createProject(payload) {
  const insert = async (projectCode) => {
    const { data, error } = await supabase
      .from('project')
      .insert({
        project_code: projectCode,
        project_name: payload.name.trim(),
        infra_type_id: payload.infraTypeId,
        village_id: payload.villageId,
        objective: payload.objective.trim(),
        structure_status: payload.structureStatus,
        plan_year: payload.planYear,
      })
      .select('project_id')
      .single()

    if (error) throw error
    return data
  }

  const code = await nextProjectCode(payload.planYear)

  try {
    return await insert(code)
  } catch (error) {
    // กรณีรหัสชนกัน (unique violation) ให้สร้างรหัสใหม่แล้วลองอีกครั้ง
    if (error?.code === '23505' || /duplicate key/i.test(error?.message ?? '')) {
      return await insert(await nextProjectCode(payload.planYear))
    }
    throw error
  }
}

function todayIso() {
  const now = new Date()
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
  return local.toISOString().slice(0, 10)
}

// BR-13/BR-14: รออนุมัติ → กำลังดำเนินการ เริ่มที่ 1%
export async function startProject(projectId) {
  const { error } = await supabase
    .from('project')
    .update({ progress_status: PROJECT_STATUS.IN_PROGRESS, progress_percent: 1 })
    .eq('project_id', projectId)

  if (error) throw error

  const { error: planError } = await supabase
    .from('project_plan')
    .upsert({ project_id: projectId, actual_start: todayIso() }, { onConflict: 'project_id' })

  if (planError) throw planError
}

// BR-14: เสร็จสิ้น = 100%
export async function completeProject(projectId) {
  const { error } = await supabase
    .from('project')
    .update({ progress_status: PROJECT_STATUS.COMPLETED, progress_percent: 100 })
    .eq('project_id', projectId)

  if (error) throw error

  const { error: planError } = await supabase
    .from('project_plan')
    .upsert({ project_id: projectId, actual_end: todayIso() }, { onConflict: 'project_id' })

  if (planError) throw planError
}

// BR-20/BR-22: ต้องมีเหตุผล และคง % เดิมไว้
export async function cancelProject(projectId, reason) {
  const { error } = await supabase
    .from('project')
    .update({ progress_status: PROJECT_STATUS.CANCELLED, cancel_reason: reason.trim() })
    .eq('project_id', projectId)

  if (error) throw error
}

// BR-18: soft delete เฉพาะโครงการที่ยังรออนุมัติ
export async function softDeleteProject(projectId) {
  const { error } = await supabase
    .from('project')
    .update({ is_deleted: true })
    .eq('project_id', projectId)

  if (error) throw error
}

// BR-08 ถึง BR-11: เงื่อนไขก่อนเปลี่ยนเป็น "กำลังดำเนินการ"
export function getStartBlockers(project) {
  const blockers = []
  const { location, plan, agencyIds, attachmentCount, budget } = project

  if (!location?.latitude && !location?.longitude && !location?.text) {
    blockers.push('ต้องระบุพิกัด GPS หรือที่ตั้งโครงการ')
  }
  if (!(budget > 0)) {
    blockers.push('ต้องระบุวงเงินงบประมาณมากกว่า 0')
  }
  if (!location?.fiscalYear) {
    blockers.push('ต้องระบุปีงบประมาณ')
  }
  if (!location?.fundingSourceId) {
    blockers.push('ต้องระบุแหล่งเงินงบประมาณ')
  }
  if (!plan?.plannedStart) {
    blockers.push('ต้องระบุวันที่คาดว่าจะเริ่ม')
  }
  if (!plan?.plannedEnd) {
    blockers.push('ต้องระบุวันที่คาดว่าจะสิ้นสุด')
  }
  if (
    plan?.plannedStart &&
    plan?.plannedEnd &&
    plan.plannedEnd < plan.plannedStart
  ) {
    blockers.push('วันที่คาดว่าจะสิ้นสุดต้องไม่น้อยกว่าวันที่เริ่ม')
  }
  if (!agencyIds?.length) {
    blockers.push('ต้องมีหน่วยงานผู้รับผิดชอบอย่างน้อย 1 หน่วยงาน')
  }
  if (!attachmentCount) {
    blockers.push('ต้องแนบเอกสารประกอบอย่างน้อย 1 ไฟล์')
  }

  return blockers
}
