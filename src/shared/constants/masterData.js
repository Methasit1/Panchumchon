// ข้อมูลหลัก (Dropdown) ที่ใช้ในฟอร์มโครงการ — F10
export const MASTER_KINDS = Object.freeze({
  infra: {
    key: 'infra',
    path: '/admin/master-data/infra-types',
    pageTitle: 'ประเภทโครงสร้างพื้นฐาน',
    summaryLabel: 'ประเภทโครงสร้างพื้นฐาน',
    fieldLabel: 'ชื่อประเภทโครงสร้างพื้นฐาน',
    placeholder: 'เช่น ถนน, ระบบน้ำ, ไฟฟ้าส่องสว่าง',
    emptyLabel: 'ยังไม่มีประเภทโครงสร้างพื้นฐาน',
  },
  agency: {
    key: 'agency',
    path: '/admin/master-data/agencies',
    pageTitle: 'หน่วยงานผู้รับผิดชอบ',
    summaryLabel: 'หน่วยงานผู้รับผิดชอบ',
    fieldLabel: 'ชื่อหน่วยงานผู้รับผิดชอบ',
    placeholder: 'เช่น กองช่าง อบต.แม่แรม',
    emptyLabel: 'ยังไม่มีหน่วยงานผู้รับผิดชอบ',
  },
  funding: {
    key: 'funding',
    path: '/admin/master-data/funding-sources',
    pageTitle: 'แหล่งเงิน',
    summaryLabel: 'แหล่งเงิน',
    fieldLabel: 'ชื่อแหล่งเงิน',
    placeholder: 'เช่น งบประมาณองค์การบริหารส่วนตำบล',
    emptyLabel: 'ยังไม่มีแหล่งเงิน',
  },
})

// ลำดับการแสดงผลบนหน้า (ตรงกับเมนู sidebar)
export const MASTER_ORDER = Object.freeze(['infra', 'agency', 'funding'])

export const MASTER_SUBTITLE =
  'ตัวเลือกที่ใช้ในรายการเลือกตอนกรอกโครงการ สำหรับเจ้าหน้าที่ท้องถิ่นและผู้นำชุมชน'
