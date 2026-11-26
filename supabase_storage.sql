-- สร้าง Storage bucket สำหรับเอกสารแนบโครงการ
-- รันใน Supabase SQL Editor หลัง supabase_tables.sql / supabase_policies.sql

-- 1) สร้าง bucket (public = false → ต้องผ่าน signed URL หรือ RLS)
insert into storage.buckets (id, name, public)
values ('project-docs', 'project-docs', false)
on conflict (id) do nothing;

-- 2) RLS policy: แอดมินอ่าน/เขียนได้ทั้งหมด
create policy "admin_storage_all"
  on storage.objects for all to authenticated
  using (bucket_id = 'project-docs' and public.is_admin())
  with check (bucket_id = 'project-docs' and public.is_admin());