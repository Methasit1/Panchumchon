# แผนชุมชน

ระบบเว็บสำหรับจัดการแผนงานและโครงสร้างพื้นฐานรายหมู่บ้าน ตามเอกสาร Proposal ที่แนบมา

## โครงสร้าง

```
src/
├─ Admin/     โฟลเดอร์เปล่า (views/, components/) — รอสร้างหน้าเว็บฝั่งเจ้าหน้าที่
├─ Public/    โฟลเดอร์เปล่า (views/, components/) — รอสร้างหน้าเว็บฝั่งประชาชน
├─ shared/    รหัส/ป้ายสถานะ สี ปี พ.ศ. + หน้า placeholder ร่วม
├─ store/     auth store (ย้ายออกจาก Admin/)
├─ services/  Supabase client + auth (tables/RLS ไม่มี trigger ตามที่ตกลงกับเพื่อน)
├─ router/    เส้นทาง /public/* และ /admin/* พร้อม guard ตรวจสิทธิ์ ADMIN
└─ assets/    Tailwind CSS
```

## สาขาที่ใช้ working

- `main` — **ฐานสะอาด** (สายนี้) สำหรับให้เพื่อน `git checkout -b <branch> origin/main` ไปทำต่อ
  → ไม่เพิ่มไฟล์หน้าเว็บที่นี่
- `title` — สายงานของผู้รับผิดชอบฝั่ง Admin (มีหน้า Login แล้ว)

```bash
git fetch origin
git checkout title
git pull origin main   # อัปเดตฐานจาก main ก่อนเริ่มงานทุกครั้ง
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

## สถานะปัจจุบัน (branch `main`)

- ติดตั้งแล้ว: Vue 3 + Vite + Tailwind CSS + Vue Router + `@supabase/supabase-js`
- `.env.local` ตั้งค่าแล้ว และทดสอบเชื่อมต่อ Supabase ผ่าน anon key สำเร็จ
  (ตาราง `village`, `infra_type`, `project`, `project_plan`, `project_note` อ่านได้ + `is_admin()` ตอบกลับ)
- สร้างบัญชีแอดมินแล้ว: `admin123@gmail.com` → มีแถวใน `user_account` ผูกกับ `ADMIN / is_active = true`
- มี Supabase client, ตรวจ role ADMIN และ router guard แล้ว
- **ทุกเส้นทางใช้หน้า placeholder ร่วมกัน** — ไม่มีไฟล์หน้าเว็บใน `src/Admin` และ `src/Public`
  (หน้า Login อยู่บน branch `title` หรือดึงกลับได้จาก commit `01771a1`)
- ฐานข้อมูลมีแค่ตาราง + RLS ตามที่ตกลงกัน **ไม่มี trigger/function** → กฎ BR ต่างๆ จะตรวจฝั่งหน้าเว็บตอน implement ฟีเจอร์
- RLS เดิมยังปิดข้อมูล งบ/หน่วยงาน/เอกสารแนบ/audit ไม่ให้ประชาชน รอคำยืนยันข้อ 5.1

## ทดสอบ Login

บน `main` ยังไม่มีหน้า Login ให้ทดสอบ (ทุกเส้นทางเป็น placeholder) ให้ใช้ branch `title`:

```bash
git checkout title
npm run dev
```

เปิด `http://localhost:5173/admin/login` → ใส่ `admin123@gmail.com` และรหัสผ่านที่ตั้งไว้

- ถ้าขึ้น *"บัญชีนี้ไม่มีสิทธิ์ผู้ดูแลระบบ"* → ตรวจแถว `user_account` ว่า `is_active = true` และ role เป็น `ADMIN`
- ถ้า login ไม่ผ่านเลย → ตรวจสถานะ user ใน **Authentication → Users** ว่าเป็น *confirmed* แล้ว
- login สำเร็จจะไป `/admin/projects` (ยังเป็นหน้า placeholder)

## เรื่องที่รอยืนยัน (ข้อ 18)

- ยกเลิก/ลบ: การแสดงโครงการยกเลิกต่อประชาชน (BR-22 กับข้อ 18.1.2 ยังขัดกัน), การแก้ไขข้อมูลที่ลงผิด
- สถานะ: มีสถานะอื่นนอกจาก 3 สถานะหลักหรือไม่ (รวมสีของสถานะยกเลิก)
- ข้อมูล: รายการ Dropdown ทั้งหมด, ประเภทเอกสารบังคับ, รูปแบบรหัส INF-69001 (ไม่มี function รันรหัส), ตัวเลขงบที่เปิดเผย
- หน้าประชาชน: ฟิลด์ที่แสดงในหน้ารายละเอียด
- ระบบ: การสำรองข้อมูลและกู้รหัสผ่านผู้ดูแล
- หมู่บ้าน: จำนวนโครงการต่อหมู่บ้าน, ข้อมูลตำบล/อำเภอ/จังหวัด
- จุดที่เอกสารยังไม่ระบุ: F07 และ BR-16 (ข้ามไปในตาราง)
