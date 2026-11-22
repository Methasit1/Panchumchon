import { PROJECT_STATUS } from './status'

// BR-15: สีได้จากสถานะความคืบหน้าโดยตรง ไม่ใช่ข้อมูลที่กรอกเอง
export const STATUS_COLOR = Object.freeze({
  [PROJECT_STATUS.PENDING_APPROVAL]: 'bg-status-pending',
  [PROJECT_STATUS.IN_PROGRESS]: 'bg-status-progress',
  [PROJECT_STATUS.COMPLETED]: 'bg-status-done',
})

// หมายเหตุ: เอกสารยังไม่ระบุสีของสถานะ "ยกเลิก" (ข้อ 18.2) — รอคำยืนยันก่อนกำหนด
