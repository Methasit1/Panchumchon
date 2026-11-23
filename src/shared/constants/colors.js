import { PROJECT_STATUS } from './status'

// BR-15: สีได้จากสถานะความคืบหน้าโดยตรง ไม่ใช่ข้อมูลที่กรอกเอง
export const STATUS_COLOR = Object.freeze({
  [PROJECT_STATUS.PENDING_APPROVAL]: 'bg-status-pending',
  [PROJECT_STATUS.IN_PROGRESS]: 'bg-status-progress',
  [PROJECT_STATUS.COMPLETED]: 'bg-status-done',
})

// สีป้ายสถานะ (pill) บนแดชบอร์ด — อ้างอิงจากดีไซน์ Figma
// หมายเหตุ: เอกสารยังไม่ระบุสีของสถานะ "ยกเลิก" (ข้อ 18.2) — ดีไซน์ใช้สีเทา
export const STATUS_BADGE = Object.freeze({
  [PROJECT_STATUS.PENDING_APPROVAL]: {
    pill: 'bg-[#F1F4F2] text-[#505F76]',
    dot: 'bg-[#9AA5A0]',
  },
  [PROJECT_STATUS.IN_PROGRESS]: {
    pill: 'bg-[#FDF6D8] text-[#8A6A00]',
    dot: 'bg-[#F0B429]',
  },
  [PROJECT_STATUS.COMPLETED]: {
    pill: 'bg-[#E7F6EC] text-[#157A45]',
    dot: 'bg-[#22C55E]',
  },
  [PROJECT_STATUS.CANCELLED]: {
    pill: 'bg-[#F1F4F2] text-[#6B7280]',
    dot: 'bg-[#9AA5A0]',
  },
})

// สีจุดบนการ์ด KPI ตามสถานะ
export const STATUS_DOT = Object.freeze({
  [PROJECT_STATUS.PENDING_APPROVAL]: 'bg-[#9AA5A0]',
  [PROJECT_STATUS.IN_PROGRESS]: 'bg-[#F0B429]',
  [PROJECT_STATUS.COMPLETED]: 'bg-[#22C55E]',
  [PROJECT_STATUS.CANCELLED]: 'bg-[#9AA5A0]',
})
