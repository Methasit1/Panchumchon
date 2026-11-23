-- =====================================================================
-- Seed ข้อมูลตัวอย่างสำหรับเดโม (ตามดีไซน์ Figma)
-- รันหลัง supabase_tables.sql และ supabase_policies.sql
-- รันซ้ำได้: ใช้ ON CONFLICT / NOT EXISTS ไม่สร้างข้อมูลซ้ำ
--
-- ข้อมูล: 3 หมู่บ้าน, 5 โครงการ (งบรวม 1,940,000 บาท, ปีงบ 2569)
--   INF-69001 ซ่อมถนนคอนกรีตสายหลัก        กำลังดำเนินการ 40%
--   INF-69002 ติดตั้งไฟส่องสว่างทางเข้า      รออนุมัติ 0%
--   INF-69003 ขุดลอกท่อระบายน้ำซอย 4        เสร็จสิ้น 100% (ล่าช้า)
--   INF-69004 สร้างสะพานข้ามลำห้วย           รออนุมัติ 0%
--   INF-69005 วางท่อประปาหมู่บ้านเพิ่มเติม    ยกเลิก (คงความคืบหน้า 35%)
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1) ข้อมูลหลัก
-- ---------------------------------------------------------------------
insert into village (village_name, moo_no) values
  ('สันป่าตึง', 3),
  ('ห้วยทราย', 5),
  ('ดงสุข', 7)
on conflict (village_name, moo_no) do nothing;

insert into infra_type (type_name) values
  ('งานถนน'),
  ('งานไฟฟ้าส่องสว่าง'),
  ('งานระบายน้ำ/สุขาภิบาล'),
  ('งานสะพานและทางข้าม'),
  ('งานประปาชนบท')
on conflict (type_name) do nothing;

insert into funding_source (source_name) values
  ('งบประมาณองค์การบริหารส่วนตำบล'),
  ('งบประมาณจังหวัด'),
  ('เงินอุดหนุนจากภาครัฐ')
on conflict (source_name) do nothing;

insert into agency (agency_name) values
  ('องค์การบริหารส่วนตำบลแม่แรม'),
  ('สำนักงานโยธาธิการและผังเมืองจังหวัด')
on conflict (agency_name) do nothing;

insert into doc_type (doc_type_name) values
  ('แบบแปลน'),
  ('รายงานการประชุม'),
  ('หนังสืออนุมัติ')
on conflict (doc_type_name) do nothing;

-- ---------------------------------------------------------------------
-- 2) โครงการ (แท็บ 1)
-- ---------------------------------------------------------------------
insert into project
  (project_code, project_name, infra_type_id, village_id, objective,
   structure_status, progress_status, progress_percent, plan_year, cancel_reason)
select
  'INF-69001', 'ซ่อมถนนคอนกรีตสายหลัก', it.infra_type_id, v.village_id,
  'ผิวจราจรชำรุดเป็นหลุมเป็นบ่อ ทำให้รถสัญจรและรถรับส่งนักเรียนได้รับความเดือดร้อน',
  'ชำรุด', 'IN_PROGRESS', 40, 2569, null
from village v cross join infra_type it
where v.village_name = 'สันป่าตึง' and v.moo_no = 3 and it.type_name = 'งานถนน'
  and not exists (select 1 from project p where p.project_code = 'INF-69001');

insert into project
  (project_code, project_name, infra_type_id, village_id, objective,
   structure_status, progress_status, progress_percent, plan_year, cancel_reason)
select
  'INF-69002', 'ติดตั้งไฟส่องสว่างทางเข้าหมู่บ้าน', it.infra_type_id, v.village_id,
  'ทางเข้าหมู่บ้านไม่มีไฟฟ้าส่องสว่าง เสี่ยงต่ออุบัติเหตุในช่วงกลางคืน',
  'ชำรุด', 'PENDING_APPROVAL', 0, 2569, null
from village v cross join infra_type it
where v.village_name = 'สันป่าตึง' and v.moo_no = 3 and it.type_name = 'งานไฟฟ้าส่องสว่าง'
  and not exists (select 1 from project p where p.project_code = 'INF-69002');

insert into project
  (project_code, project_name, infra_type_id, village_id, objective,
   structure_status, progress_status, progress_percent, plan_year, cancel_reason)
select
  'INF-69003', 'ขุดลอกท่อระบายน้ำซอย 4', it.infra_type_id, v.village_id,
  'ท่อระบายน้ำตื้นเขิน น้ำท่วมขังในช่วงฝนตกและส่งกลิ่นเหม็น',
  'ชำรุด', 'COMPLETED', 100, 2569, null
from village v cross join infra_type it
where v.village_name = 'สันป่าตึง' and v.moo_no = 3 and it.type_name = 'งานระบายน้ำ/สุขาภิบาล'
  and not exists (select 1 from project p where p.project_code = 'INF-69003');

insert into project
  (project_code, project_name, infra_type_id, village_id, objective,
   structure_status, progress_status, progress_percent, plan_year, cancel_reason)
select
  'INF-69004', 'สร้างสะพานข้ามลำห้วย', it.infra_type_id, v.village_id,
  'สะพานเดิมชำรุดและแคบ ไม่สามารถรองรับรถบรรทุกผลผลิตทางการเกษตรได้',
  'ชำรุด', 'PENDING_APPROVAL', 0, 2569, null
from village v cross join infra_type it
where v.village_name = 'ห้วยทราย' and v.moo_no = 5 and it.type_name = 'งานสะพานและทางข้าม'
  and not exists (select 1 from project p where p.project_code = 'INF-69004');

insert into project
  (project_code, project_name, infra_type_id, village_id, objective,
   structure_status, progress_status, progress_percent, plan_year, cancel_reason)
select
  'INF-69005', 'วางท่อประปาหมู่บ้านเพิ่มเติม', it.infra_type_id, v.village_id,
  'ขยายเขตบริการน้ำประปาให้ครัวเรือนที่อยู่ปลายสาย',
  'ก่อสร้างใหม่', 'CANCELLED', 35, 2569,
  'ซ้ำซ้อนกับโครงการพัฒนาแหล่งน้ำของสำนักงบประมาณจังหวัด'
from village v cross join infra_type it
where v.village_name = 'ห้วยทราย' and v.moo_no = 5 and it.type_name = 'งานประปาชนบท'
  and not exists (select 1 from project p where p.project_code = 'INF-69005');

-- ---------------------------------------------------------------------
-- 3) พื้นที่และงบประมาณ (แท็บ 2)
-- ---------------------------------------------------------------------
insert into project_location_budget
  (project_id, location_text, budget_amount, fiscal_year, funding_source_id)
select p.project_id, 'บ้านสันป่าตึง หมู่ 3', 450000.00, 2569, fs.funding_source_id
from project p cross join funding_source fs
where p.project_code = 'INF-69001'
  and fs.source_name = 'งบประมาณองค์การบริหารส่วนตำบล'
  and not exists (select 1 from project_location_budget b where b.project_id = p.project_id);

insert into project_location_budget
  (project_id, location_text, budget_amount, fiscal_year, funding_source_id)
select p.project_id, 'บ้านสันป่าตึง หมู่ 3', 180000.00, 2569, fs.funding_source_id
from project p cross join funding_source fs
where p.project_code = 'INF-69002'
  and fs.source_name = 'งบประมาณองค์การบริหารส่วนตำบล'
  and not exists (select 1 from project_location_budget b where b.project_id = p.project_id);

insert into project_location_budget
  (project_id, location_text, budget_amount, fiscal_year, funding_source_id)
select p.project_id, 'บ้านสันป่าตึง หมู่ 3', 85000.00, 2569, fs.funding_source_id
from project p cross join funding_source fs
where p.project_code = 'INF-69003'
  and fs.source_name = 'งบประมาณองค์การบริหารส่วนตำบล'
  and not exists (select 1 from project_location_budget b where b.project_id = p.project_id);

insert into project_location_budget
  (project_id, location_text, budget_amount, fiscal_year, funding_source_id)
select p.project_id, 'บ้านห้วยทราย หมู่ 5', 850000.00, 2569, fs.funding_source_id
from project p cross join funding_source fs
where p.project_code = 'INF-69004'
  and fs.source_name = 'งบประมาณจังหวัด'
  and not exists (select 1 from project_location_budget b where b.project_id = p.project_id);

insert into project_location_budget
  (project_id, location_text, budget_amount, fiscal_year, funding_source_id)
select p.project_id, 'บ้านห้วยทราย หมู่ 5', 375000.00, 2569, fs.funding_source_id
from project p cross join funding_source fs
where p.project_code = 'INF-69005'
  and fs.source_name = 'เงินอุดหนุนจากภาครัฐ'
  and not exists (select 1 from project_location_budget b where b.project_id = p.project_id);

-- ---------------------------------------------------------------------
-- 4) แผนการดำเนินงาน (แท็บ 3) — เฉพาะโครงการที่เริ่มแล้ว/เสร็จสิ้น
-- ---------------------------------------------------------------------
insert into project_plan (project_id, planned_start, planned_end, actual_start, actual_end)
select p.project_id, date '2026-01-15', date '2026-06-30', date '2026-01-20', null
from project p
where p.project_code = 'INF-69001'
  and not exists (select 1 from project_plan pl where pl.project_id = p.project_id);

insert into project_plan (project_id, planned_start, planned_end, actual_start, actual_end)
select p.project_id, date '2025-11-01', date '2026-02-28', date '2025-11-05', date '2026-03-10'
from project p
where p.project_code = 'INF-69003'
  and not exists (select 1 from project_plan pl where pl.project_id = p.project_id);

-- ---------------------------------------------------------------------
-- 5) หน่วยงานผู้รับผิดชอบ + เอกสารแนบ
-- ---------------------------------------------------------------------
insert into project_agency (project_id, agency_id)
select p.project_id, a.agency_id
from project p cross join agency a
where p.project_code in ('INF-69001', 'INF-69003')
  and a.agency_name = 'องค์การบริหารส่วนตำบลแม่แรม'
on conflict do nothing;

insert into project_attachment (project_id, doc_type_id, file_name, file_path)
select p.project_id, d.doc_type_id, 'แบบแปลนโครงการ.pdf', 'demo/' || lower(p.project_code) || '-plan.pdf'
from project p cross join doc_type d
where p.project_code in ('INF-69001', 'INF-69003')
  and d.doc_type_name = 'แบบแปลน'
  and not exists (
    select 1 from project_attachment a
    where a.project_id = p.project_id and a.file_name = 'แบบแปลนโครงการ.pdf'
  );

-- ---------------------------------------------------------------------
-- 6) ตัวนับรหัสโครงการรายปี (ถัดไปคือ INF-69006)
-- ---------------------------------------------------------------------
insert into project_code_counter (plan_year, last_no) values (2569, 5)
on conflict (plan_year) do update
  set last_no = greatest(project_code_counter.last_no, excluded.last_no);
