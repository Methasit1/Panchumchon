-- =====================================================================
-- Reset ข้อมูลทั้งหมด (ยกเว้น role และ user_account ของ staff/admin)
-- ใช้เมื่อต้องการล้างข้อมูลทดสอบ/เดโม แล้วเริ่มใส่ข้อมูลจริง
-- รันใน Supabase SQL Editor (postgres role) เท่านั้น
-- ห้ามรันผ่าน API/หน้าเว็บ (สิทธิ์ DELETE ถูก revoke บนตารางข้อมูลหลัก)
-- =====================================================================

begin;

-- 1) ลบข้อมูลลูกก่อน (FK) — restart identity รีเซ็ต sequence ไปด้วย
truncate table public.project_agency        restart identity cascade;
truncate table public.project_attachment   restart identity cascade;
truncate table public.project_note         restart identity cascade;
truncate table public.project_plan         restart identity cascade;
truncate table public.project_location_budget restart identity cascade;
truncate table public.audit_log            restart identity cascade;

-- 2) ลบโครงการ และตัวนับรหัส
truncate table public.project              restart identity cascade;
truncate table public.project_code_counter restart identity cascade;

-- 3) ลบ master data + หมู่บ้าน (role และ user_account ไม่ถูกแตะ)
truncate table public.village              restart identity cascade;
truncate table public.infra_type           restart identity cascade;
truncate table public.funding_source       restart identity cascade;
truncate table public.agency               restart identity cascade;
truncate table public.doc_type             restart identity cascade;

commit;

-- ตรวจสอบผล
select 'village' as table_name, count(*) from public.village
union all select 'infra_type', count(*) from public.infra_type
union all select 'funding_source', count(*) from public.funding_source
union all select 'agency', count(*) from public.agency
union all select 'doc_type', count(*) from public.doc_type
union all select 'project', count(*) from public.project
union all select 'user_account', count(*) from public.user_account
union all select 'role', count(*) from public.role;
