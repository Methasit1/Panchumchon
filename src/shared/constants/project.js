import { PROJECT_STATUS } from './status'

// ค่าที่อนุญาตใน DB: project.structure_status (check constraint)
export const STRUCTURE_STATUS_OPTIONS = Object.freeze([
  'ใช้งานได้ปกติ',
  'ชำรุด',
  'อยู่ระหว่างซ่อม',
  'เลิกใช้งาน',
  'ก่อสร้างใหม่',
])

// ข้อความประกอบใต้ชื่อโครงการ แสดงตามสถานะ (ค่าคงที่ ไม่ผูกกับ project_note)
export const PROJECT_STATUS_GUIDE = Object.freeze({
  [PROJECT_STATUS.PENDING_APPROVAL]:
    'โครงการผ่านการประชาคมหมู่บ้านแล้ว รอคำสั่งอนุมัติเริ่มดำเนินการ',
  [PROJECT_STATUS.IN_PROGRESS]: 'อยู่ระหว่างดำเนินการตามแผนงานที่ได้รับอนุมัติ',
  [PROJECT_STATUS.COMPLETED]:
    'ตรวจรับงานโดยคณะกรรมการตรวจการจ้างประจำตำบลเรียบร้อยแล้ว',
  [PROJECT_STATUS.CANCELLED]: '',
})

// ลำดับการ์ดบนหน้าจัดการโครงการ (ตรงกับลำดับในดีไซน์)
export const STATUS_SORT_ORDER = Object.freeze({
  [PROJECT_STATUS.PENDING_APPROVAL]: 0,
  [PROJECT_STATUS.IN_PROGRESS]: 1,
  [PROJECT_STATUS.COMPLETED]: 2,
  [PROJECT_STATUS.CANCELLED]: 3,
})

export const MANAGE_PAGE_SIZE = 5
