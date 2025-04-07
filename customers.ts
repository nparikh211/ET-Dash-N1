import { supabase } from '../supabase';
import { Database } from '../database.types';

type Customer = Database['public']['Tables']['customers']['Row'];
type InsertCustomer = Database['public']['Tables']['customers']['Insert'];
type UpdateCustomer = Database['public']['Tables']['customers']['Update'];

// Fetch all customers
export async function fetchCustomers() {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .order('company_name', { ascending: true });
  
  if (error) {
    console.error('Error fetching customers:', error);
    throw error;
  }
  
  return data as Customer[];
}

// Fetch active customers (not churned)
export async function fetchActiveCustomers() {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .eq('is_churned', false)
    .order('company_name', { ascending: true });
  
  if (error) {
    console.error('Error fetching active customers:', error);
    throw error;
  }
  
  return data as Customer[];
}

// Fetch churned customers
export async function fetchChurnedCustomers() {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .eq('is_churned', true)
    .order('company_name', { ascending: true });
  
  if (error) {
    console.error('Error fetching churned customers:', error);
    throw error;
  }
  
  return data as Customer[];
}

// Insert a new customer
export async function insertCustomer(customer: InsertCustomer) {
  const { data, error } = await supabase
    .from('customers')
    .insert(customer)
    .select()
    .single();
  
  if (error) {
    console.error('Error inserting customer:', error);
    throw error;
  }
  
  return data as Customer;
}

// Update a customer
export async function updateCustomer(id: number, updates: UpdateCustomer) {
  const { data, error } = await supabase
    .from('customers')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating customer:', error);
    throw error;
  }
  
  return data as Customer;
}

// Mark a customer as churned
export async function markCustomerAsChurned(id: number, isChurned: boolean = true) {
  return updateCustomer(id, { is_churned: isChurned });
}

// Delete a customer
export async function deleteCustomer(id: number) {
  const { error } = await supabase
    .from('customers')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting customer:', error);
    throw error;
  }
  
  return true;
}

// Fetch audit logs for a specific customer
export async function fetchCustomerAuditLogs(id: number) {
  const { data, error } = await supabase
    .from('audit_logs')
    .select('*')
    .eq('table_name', 'customers')
    .eq('record_id', id)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching customer audit logs:', error);
    throw error;
  }
  
  return data;
}
