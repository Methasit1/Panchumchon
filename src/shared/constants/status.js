// ค่าเก็บใน DB (progress_status) ตาม supabase_tables.sql
// อ้างอิง BR-13, BR-14, BR-19, BR-22
export const PROJECT_STATUS = Object.freeze({
  PENDING_APPROVAL: 'PENDING_APPROVAL',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
})

// ป้ายภาษาไทยสำหรับแสดงผล
export const STATUS_LABEL = Object.freeze({
  [PROJECT_STATUS.PENDING_APPROVAL]: 'รออนุมัติแผนงาน',
  [PROJECT_STATUS.IN_PROGRESS]: 'กำลังดำเนินการ',
  [PROJECT_STATUS.COMPLETED]: 'เสร็จสิ้นโครงการ',
  [PROJECT_STATUS.CANCELLED]: 'ยกเลิก',
})

// BR-14: % ความคืบหน้าตามสถานะ และต้องไม่ลดลง
export const PROGRESS_RANGE = Object.freeze({
  [PROJECT_STATUS.PENDING_APPROVAL]: Object.freeze({ min: 0, max: 0 }),
  [PROJECT_STATUS.IN_PROGRESS]: Object.freeze({ min: 1, max: 99 }),
  [PROJECT_STATUS.COMPLETED]: Object.freeze({ min: 100, max: 100 }),
})

// BR-13: ลำดับสถานะ เดินหน้าได้เท่านั้น
export const STATUS_ORDER = Object.freeze([
  PROJECT_STATUS.PENDING_APPROVAL,
  PROJECT_STATUS.IN_PROGRESS,
  PROJECT_STATUS.COMPLETED,
])

// BR-22: โครงการยกเลิกคง % ไว้ที่ค่าสุดท้ายก่อนยกเลิก (ไม่บังคับ 0% หรือ 100%)
