export interface CrmEntry {
  id: number;
  status: 'Contracted' | 'Hired In-Seat' | 'Terminated';
  company_name: string;
  personnel_name: string;
  position: string;
  start_date: string;
  end_date: string | null;
  hiring_manager: string;
  cost: number;
  exordiom_rate: number;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: number;
  company_name: string;
  is_churned: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuditLog {
  id: number;
  table_name: string;
  record_id: number;
  action: 'INSERT' | 'UPDATE' | 'DELETE';
  old_data: any | null;
  new_data: any | null;
  created_at: string;
  user_id: string | null;
}

export interface DashboardMetrics {
  hiredInSeatCount: number;
  contractedCount: number;
  terminatedCount: number;
  totalGrossRevenue: number;
  totalNetRevenue: number;
  totalFutureContractedGrossRevenue: number;
  totalFutureContractedNetRevenue: number;
  activeNetRevenue: number;
  averageProfitMargin: number;
  totalCustomers: number;
  churnedCustomers: number;
}

export interface CustomerDetail extends Customer {
  contact: string;
  hiredInSeatCount: number;
  contractedCount: number;
  terminatedCount: number;
  totalRevenue: number;
  totalNetRevenue: number;
  ytdRevenue: number;
  ytdNetRevenue: number;
  marginPercentage: number;
}

export interface TalentDistribution {
  [company: string]: {
    hired: number;
    contracted: number;
  };
}
