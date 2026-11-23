// ชื่อหมู่บ้านใน DB อาจมีหรือไม่มีคำว่า "บ้าน" นำหน้า — แสดงผลให้เหมือนกันทุกหน้า
export function villageLabel(name) {
  const value = String(name ?? '').trim()
  if (!value) return '—'
  return value.startsWith('บ้าน') ? value : `บ้าน${value}`
}
