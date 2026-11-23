import { PROJECT_STATUS } from '@/shared/constants/status'
import { supabase } from './supabase'

// ข้อมูลที่แดชบอร์ดต้องใช้: โครงการ + หมู่บ้าน + งบประมาณ + แผนงาน
// หมายเหตุ: RLS เปิดให้เฉพาะแอดมินอ่านตารางงบประมาณ (ท้าย supabase_policies.sql)
const PROJECT_SELECT = `
  project_id,
  project_code,
  project_name,
  objective,
  progress_status,
  progress_percent,
  plan_year,
  created_at,
  village:village_id ( village_id, village_name, moo_no ),
  infra_type:infra_type_id ( infra_type_id, type_name ),
  project_location_budget ( budget_amount, fiscal_year, funding_source:funding_source_id ( source_name ) ),
  project_plan ( planned_start, planned_end )
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
    status: row.progress_status,
    progress: row.progress_percent ?? 0,
    villageId: row.village?.village_id ?? null,
    villageName: row.village?.village_name ?? '',
    mooNo: row.village?.moo_no ?? null,
    infraType: row.infra_type?.type_name ?? '',
    budget: Number(budget?.budget_amount ?? 0),
    fundingSource: budget?.funding_source?.source_name ?? '',
    plannedStart: plan?.planned_start ?? null,
    plannedEnd: plan?.planned_end ?? null,
    createdAt: row.created_at,
  }
}

// BR-28: แสดงเฉพาะปีที่มีข้อมูล
export async function fetchPlanYears() {
  const { data, error } = await supabase
    .from('project')
    .select('plan_year')
    .eq('is_deleted', false)

  if (error) throw error

  return [...new Set((data ?? []).map((row) => row.plan_year))].sort((a, b) => b - a)
}

export async function fetchDashboardData(year) {
  const [projectResult, villageResult] = await Promise.all([
    supabase
      .from('project')
      .select(PROJECT_SELECT)
      .eq('plan_year', year)
      .eq('is_deleted', false) // BR-17: โครงการที่ถูกลบไม่แสดง
      .order('created_at', { ascending: true }),
    supabase
      .from('village')
      .select('village_id, village_name, moo_no')
      .eq('is_active', true)
      .order('moo_no', { ascending: true }),
  ])

  if (projectResult.error) throw projectResult.error
  if (villageResult.error) throw villageResult.error

  return {
    projects: (projectResult.data ?? []).map(normalizeProject),
    villages: villageResult.data ?? [],
  }
}

// รวมยอดสำหรับ KPI และการ์ดรายหมู่บ้าน (คำนวณฝั่ง client เพราะยังไม่มี view/function ใน DB)
export function summarize(projects, villages) {
  const counts = {
    [PROJECT_STATUS.PENDING_APPROVAL]: 0,
    [PROJECT_STATUS.IN_PROGRESS]: 0,
    [PROJECT_STATUS.COMPLETED]: 0,
    [PROJECT_STATUS.CANCELLED]: 0,
  }

  // งบประมาณรวมนับทุกสถานะ (รวมโครงการที่ยกเลิก) ตามที่ตกลงกัน
  let totalBudget = 0
  for (const project of projects) {
    if (counts[project.status] !== undefined) counts[project.status] += 1
    totalBudget += project.budget
  }

  const byVillage = villages.map((village) => {
    const list = projects.filter((project) => project.villageId === village.village_id)
    const statusCounts = {
      [PROJECT_STATUS.PENDING_APPROVAL]: 0,
      [PROJECT_STATUS.IN_PROGRESS]: 0,
      [PROJECT_STATUS.COMPLETED]: 0,
      [PROJECT_STATUS.CANCELLED]: 0,
    }

    let budget = 0
    let progressSum = 0
    for (const project of list) {
      if (statusCounts[project.status] !== undefined) statusCounts[project.status] += 1
      budget += project.budget
      progressSum += Number(project.progress) || 0
    }

    return {
      id: village.village_id,
      name: village.village_name,
      mooNo: village.moo_no,
      projectCount: list.length,
      budget,
      statusCounts,
      // ความคืบหน้าเฉลี่ย = ผลรวม % ของทุกโครงการในหมู่บ้าน ÷ จำนวนโครงการ
      avgProgress: list.length ? progressSum / list.length : 0,
    }
  })

  return {
    totalProjects: projects.length,
    counts,
    totalBudget,
    byVillage,
  }
}
