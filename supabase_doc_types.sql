-- Seed ประเภทเอกสาร (doc_type) สำหรับฟอร์มโครงการ
-- รันใน Supabase SQL Editor หลัง supabase_tables.sql
insert into doc_type (doc_type_name) values
  ('ปร.4'),
  ('ปร.5'),
  ('เอกสารอื่นๆ'),
  ('ภาพถ่ายก่อนทำ'),
  ('ภาพถ่ายหลังทำ')
on conflict (doc_type_name) do nothing;