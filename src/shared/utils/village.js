// ชื่อหมู่บ้านใน DB อาจมีหรือไม่มีคำว่า "บ้าน" นำหน้า — แสดงผลให้เหมือนกันทุกหน้า
export function villageLabel(name) {
  const value = String(name ?? '').trim()
  if (!value) return '—'
  return value.startsWith('บ้าน') ? value : `บ้าน${value}`
}

// BR-02: เก็บชื่อแบบไม่มีคำว่า "บ้าน" นำหน้า เพื่อให้ unique (ชื่อ + หมู่ที่) ตรวจได้จริง
// (กันเคส "หลวง" กับ "บ้านหลวง" ถูกมองเป็นคนละหมู่บ้าน)
export function normalizeVillageName(name) {
  return String(name ?? '')
    .trim()
    .replace(/^บ้าน\s*/, '')
    .trim()
}
