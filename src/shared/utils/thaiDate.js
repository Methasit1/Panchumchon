// แสดงวันที่แบบไทย + พ.ศ. เช่น "18 พฤษภาคม 2567"
const THAI_MONTHS = [
  'มกราคม',
  'กุมภาพันธ์',
  'มีนาคม',
  'เมษายน',
  'พฤษภาคม',
  'มิถุนายน',
  'กรกฎาคม',
  'สิงหาคม',
  'กันยายน',
  'ตุลาคม',
  'พฤศจิกายน',
  'ธันวาคม',
]

// รับค่า date (YYYY-MM-DD) หรือ timestamptz แล้วไม่ให้ timezone เลื่อนวัน
export function formatThaiDate(value) {
  if (!value) return ''

  const datePart = String(value).split('T')[0]
  const [year, month, day] = datePart.split('-').map(Number)
  if (!year || !month || !day || !THAI_MONTHS[month - 1]) return ''

  return `${day} ${THAI_MONTHS[month - 1]} ${year + 543}`
}
