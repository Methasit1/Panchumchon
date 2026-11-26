import { supabase } from './supabase'

// ตัวเลือกในฟอร์มสร้างการ์ดโครงการ (BR-02, F03)
export async function fetchVillageOptions() {
  const { data, error } = await supabase
    .from('village')
    .select('village_id, village_name, moo_no')
    .eq('is_active', true)
    .order('moo_no', { ascending: true })

  if (error) throw error
  return data ?? []
}

export async function fetchInfraTypeOptions() {
  const { data, error } = await supabase
    .from('infra_type')
    .select('infra_type_id, type_name')
    .eq('is_active', true)
    .order('type_name', { ascending: true })

  if (error) throw error
  return data ?? []
}

export async function fetchAgencyOptions() {
  const { data, error } = await supabase
    .from('agency')
    .select('agency_id, agency_name')
    .eq('is_active', true)
    .order('agency_name', { ascending: true })

  if (error) throw error
  return data ?? []
}

export async function fetchFundingSourceOptions() {
  const { data, error } = await supabase
    .from('funding_source')
    .select('funding_source_id, source_name')
    .eq('is_active', true)
    .order('source_name', { ascending: true })

  if (error) throw error
  return data ?? []
}

export async function fetchDocTypeOptions() {
  const { data, error } = await supabase
    .from('doc_type')
    .select('doc_type_id, doc_type_name')
    .eq('is_active', true)
    .order('doc_type_name', { ascending: true })

  if (error) throw error
  return data ?? []
}
