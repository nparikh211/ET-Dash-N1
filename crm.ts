import { supabase } from '../supabase';
import { Database } from '../database.types';

type CrmEntry = Database['public']['Tables']['crm_entries']['Row'];
type InsertCrmEntry = Database['public']['Tables']['crm_entries']['Insert'];
type UpdateCrmEntry = Database['public']['Tables']['crm_entries']['Update'];

// Fetch all CRM entries
export async function fetchCrmEntries() {
  const { data, error } = await supabase
    .from('crm_entries')
    .select('*')
    .order('id', { ascending: true });
  
  if (error) {
    console.error('Error fetching CRM entries:', error);
    throw error;
  }
  
  return data as CrmEntry[];
}

// Fetch CRM entries by status
export async function fetchCrmEntriesByStatus(status: 'Contracted' | 'Hired In-Seat' | 'Terminated') {
  const { data, error } = await supabase
    .from('crm_entries')
    .select('*')
    .eq('status', status)
    .order('id', { ascending: true });
  
  if (error) {
    console.error(`Error fetching ${status} CRM entries:`, error);
    throw error;
  }
  
  return data as CrmEntry[];
}

// Insert a new CRM entry
export async function insertCrmEntry(entry: InsertCrmEntry) {
  const { data, error } = await supabase
    .from('crm_entries')
    .insert(entry)
    .select()
    .single();
  
  if (error) {
    console.error('Error inserting CRM entry:', error);
    throw error;
  }
  
  return data as CrmEntry;
}

// Update a CRM entry
export async function updateCrmEntry(id: number, updates: UpdateCrmEntry) {
  const { data, error } = await supabase
    .from('crm_entries')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating CRM entry:', error);
    throw error;
  }
  
  return data as CrmEntry;
}

// Delete a CRM entry
export async function deleteCrmEntry(id: number) {
  const { error } = await supabase
    .from('crm_entries')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting CRM entry:', error);
    throw error;
  }
  
  return true;
}

// Fetch audit logs for a specific CRM entry
export async function fetchCrmEntryAuditLogs(id: number) {
  const { data, error } = await supabase
    .from('audit_logs')
    .select('*')
    .eq('table_name', 'crm_entries')
    .eq('record_id', id)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching audit logs:', error);
    throw error;
  }
  
  return data;
}

// Fetch the last state of a CRM entry before the current state
export async function fetchPreviousCrmEntryState(id: number) {
  const { data, error } = await supabase
    .from('audit_logs')
    .select('*')
    .eq('table_name', 'crm_entries')
    .eq('record_id', id)
    .eq('action', 'UPDATE')
    .order('created_at', { ascending: false })
    .limit(1);
  
  if (error) {
    console.error('Error fetching previous state:', error);
    throw error;
  }
  
  return data.length > 0 ? data[0].old_data : null;
}
