# แผนชุมชน

ระบบเว็บสำหรับจัดการแผนงานและโครงสร้างพื้นฐานรายหมู่บ้าน ตามเอกสาร Proposal ที่แนบมา

## โครงสร้าง

```
src/
├─ Admin/     หน้าเจ้าหน้าที่ (Login, ตารางโครงการ, สร้างการ์ด, ฟอร์มแท็บ 1–3,
│             จัดการหมู่บ้าน, ข้อมูลหลัก, ประวัติ) — F01–F06, F09, F10
├─ Public/    หน้าประชาชน (เลือกหมู่บ้าน, รายการโครงการ, รายละเอียด) — F08
├─ shared/    รหัส/ป้ายสถานะ สี และปี พ.ศ. ที่ใช้ร่วมกัน (BR-14, BR-15, BR-27–28)
├─ services/  Supabase client + auth (tables/RLS ไม่มี trigger ตามที่ตกลงกับเพื่อน)
├─ router/    เส้นทาง /public/* และ /admin/* พร้อม guard ตรวจสิทธิ์ ADMIN
└─ assets/    Tailwind CSS
```

## ตั้งค่า Supabase

1. สร้าง project ใน Supabase แล้วรัน SQL ตามลำดับ:
   `supabase_tables.sql` → `supabase_policies.sql`
2. สร้าง auth user สำหรับพี่เอ็มใน **Authentication → Users** (ใช้ email/password)
3. เพิ่มแถวใน `user_account` ด้วย `user_id` = id ของ auth user, `username`, `display_name`
   และ `role_id` ของแถว `ADMIN` ในตาราง `role` (ต้อง `is_active = true`)
   — ไม่มีไฟล์ seed ตามที่ตกลงกัน
4. คัดลอก `.env.example` เป็น `.env.local` แล้วใส่ URL และ anon key ของ project

```bash
cp .env.example .env.local
npm install
npm run dev
```

`.env.local` ถูก `.gitignore` อยู่แล้ว ห้าม commit

## คำสั่ง

```bash
npm run dev      # เซิร์ฟเวอร์พัฒนา
npm run build    # build ตรวจสอบโครงสร้าง
npm run preview
```

## สถานะปัจจุบัน

- ติดตั้งแล้ว: Vue 3 + Vite + Tailwind CSS + Vue Router + `@supabase/supabase-js`
- มี Supabase client, login/logout, ตรวจ role ADMIN และ router guard แล้ว
- หน้าจอที่เหลือยังเป็น placeholder (ยังไม่มีตรรกะ/ข้อมูลจริง)
- ฐานข้อมูลมีแค่ตาราง + RLS ตามที่ตกลงกัน **ไม่มี trigger/function** → กฎ BR ต่างๆ จะตรวจฝั่งหน้าเว็บตอน implement ฟีเจอร์
- RLS เดิมยังปิดข้อมูล งบ/หน่วยงาน/เอกสารแนบ/audit ไม่ให้ประชาชน รอคำยืนยันข้อ 5.1

## เรื่องที่รอยืนยัน (ข้อ 18)

- ยกเลิก/ลบ: การแสดงโครงการยกเลิกต่อประชาชน (BR-22 กับข้อ 18.1.2 ยังขัดกัน), การแก้ไขข้อมูลที่ลงผิด
- สถานะ: มีสถานะอื่นนอกจาก 3 สถานะหลักหรือไม่ (รวมสีของสถานะยกเลิก)
- ข้อมูล: รายการ Dropdown ทั้งหมด, ประเภทเอกสารบังคับ, รูปแบบรหัส INF-69001 (ไม่มี function รันรหัส), ตัวเลขงบที่เปิดเผย
- หน้าประชาชน: ฟิลด์ที่แสดงในหน้ารายละเอียด
- ระบบ: การสำรองข้อมูลและกู้รหัสผ่านผู้ดูแล
- หมู่บ้าน: จำนวนโครงการต่อหมู่บ้าน, ข้อมูลตำบล/อำเภอ/จังหวัด
- จุดที่เอกสารยังไม่ระบุ: F07 และ BR-16 (ข้ามไปในตาราง)
