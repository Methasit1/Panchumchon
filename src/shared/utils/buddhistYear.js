// BR-27: ทุกโครงการต้องระบุปีแผน (พ.ศ.) ค่าเริ่มต้นคือปีปัจจุบัน
export function currentBuddhistYear() {
  return new Date().getFullYear() + 543
}
