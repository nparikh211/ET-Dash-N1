import { supabase } from '../supabase';
import { Database } from '../database.types';
import { CrmEntry } from './types';

// Fetch dashboard metrics
export async function fetchDashboardMetrics(period: string, startDate?: string, endDate?: string) {
  // Fetch all CRM entries
  const { data: crmEntries, error } = await supabase
    .from('crm_entries')
    .select('*');
  
  if (error) {
    console.error('Error fetching dashboard metrics:', error);
    throw error;
  }

  // Fetch all customers
  const { data: customers, error: customersError } = await supabase
    .from('customers')
    .select('*');
  
  if (customersError) {
    console.error('Error fetching customers for dashboard:', customersError);
    throw customersError;
  }

  // Process and return metrics
  return {
    crmEntries,
    customers,
    // The actual calculations will be done on the client side
    // based on the selected period and the utility functions
  };
}

// Fetch data for talent distribution chart
export async function fetchTalentDistribution() {
  const { data, error } = await supabase
    .from('crm_entries')
    .select('company_name, status')
    .in('status', ['Hired In-Seat', 'Contracted'])
    .order('company_name', { ascending: true });
  
  if (error) {
    console.error('Error fetching talent distribution:', error);
    throw error;
  }
  
  // Process data for chart
  const distribution = data.reduce((acc: Record<string, { hired: number, contracted: number }>, item) => {
    if (!acc[item.company_name]) {
      acc[item.company_name] = { hired: 0, contracted: 0 };
    }
    
    if (item.status === 'Hired In-Seat') {
      acc[item.company_name].hired += 1;
    } else if (item.status === 'Contracted') {
      acc[item.company_name].contracted += 1;
    }
    
    return acc;
  }, {});
  
  return distribution;
}

// Fetch upcoming contract end dates
export async function fetchUpcomingContractEndDates() {
  const today = new Date();
  const threeMonthsLater = new Date();
  threeMonthsLater.setMonth(today.getMonth() + 3);
  
  const { data, error } = await supabase
    .from('crm_entries')
    .select('*')
    .not('end_date', 'is', null)
    .gte('end_date', today.toISOString().split('T')[0])
    .lte('end_date', threeMonthsLater.toISOString().split('T')[0])
    .order('end_date', { ascending: true });
  
  if (error) {
    console.error('Error fetching upcoming contract end dates:', error);
    throw error;
  }
  
  return data as CrmEntry[];
}

// Fetch audit logs for dashboard activity
export async function fetchRecentActivityLogs(limit = 10) {
  const { data, error } = await supabase
    .from('audit_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);
  
  if (error) {
    console.error('Error fetching recent activity logs:', error);
    throw error;
  }
  
  return data;
}
