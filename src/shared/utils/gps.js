// แปลงข้อความพิกัด (เช่น "18.7883, 98.9853" หรือ URL Google Maps) เป็น { latitude, longitude }
export function parseGpsInput(value) {
  const text = String(value ?? '').trim()
  if (!text) return { latitude: null, longitude: null }

  // ลองดึงตัวเลขจาก URL Google Maps ก่อน (q=lat,lng หรือ @lat,lng)
  const urlMatch = text.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/)
  if (urlMatch) {
    return { latitude: Number(urlMatch[1]), longitude: Number(urlMatch[2]) }
  }
  const qMatch = text.match(/[?&]q=(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/)
  if (qMatch) {
    return { latitude: Number(qMatch[1]), longitude: Number(qMatch[2]) }
  }

  // รูปแบบ "lat, lng" หรือ "lat lng"
  const parts = text.split(/[,\s]+/).filter(Boolean)
  if (parts.length >= 2) {
    const lat = Number(parts[0])
    const lng = Number(parts[1])
    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      return { latitude: lat, longitude: lng }
    }
  }

  return { latitude: null, longitude: null }
}