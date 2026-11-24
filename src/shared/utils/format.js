// การแสดงตัวเลข/เปอร์เซ็นต์ที่ใช้ร่วมกันในหน้า admin
const numberFormatter = new Intl.NumberFormat('th-TH', { maximumFractionDigits: 0 })

export function formatNumber(value) {
  return numberFormatter.format(Number(value) || 0)
}

// BR-14: ความคืบหน้าเป็นจำนวนเต็มใน DB แต่ค่าเฉลี่ยรายหมู่บ้านแสดงทศนิยม 1 ตำแหน่ง
export function formatPercent(value) {
  return `${(Number(value) || 0).toFixed(1)}%`
}
