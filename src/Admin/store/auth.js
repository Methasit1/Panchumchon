import { ref } from 'vue'

// F02 / BR-01: บัญชีผู้ดูแลเพียงบัญชีเดียว ต้อง Login ก่อนเข้าถึงหน้าจัดการข้อมูล
// ยังไม่เพิ่มตรรกะ Login และ navigation guard จนกว่าจะยืนยันรายละเอียดบัญชี (ข้อ 14)
export const isAuthenticated = ref(false)
