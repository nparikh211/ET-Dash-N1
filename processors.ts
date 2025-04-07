import { CrmEntry } from './types';
import { 
  calculateActiveNetRevenue, 
  calculateMonthlyProfit, 
  calculateYearlyProfit, 
  calculateMarginPercentage,
  filterDataByPeriod
} from '../utils';

// Process CRM data for dashboard metrics
export function processCrmData(crmEntries: CrmEntry[], period: string, startDate?: string, endDate?: string) {
  // Filter data based on period
  const filteredData = filterDataByPeriod(crmEntries, period, startDate, endDate);
  
  // Count by status
  const hiredInSeatCount = filteredData.filter(entry => entry.status === 'Hired In-Seat').length;
  const contractedCount = filteredData.filter(entry => entry.status === 'Contracted').length;
  const terminatedCount = filteredData.filter(entry => entry.status === 'Terminated').length;
  
  // Calculate revenue metrics
  let totalGrossRevenue = 0;
  let totalNetRevenue = 0;
  let totalFutureContractedGrossRevenue = 0;
  let totalFutureContractedNetRevenue = 0;
  let activeNetRevenue = 0;
  
  // Process hired in-seat entries
  const hiredEntries = filteredData.filter(entry => entry.status === 'Hired In-Seat');
  hiredEntries.forEach(entry => {
    const hourlyProfit = entry.exordiom_rate - entry.cost;
    totalGrossRevenue += calculateMonthlyProfit(entry.exordiom_rate);
    totalNetRevenue += calculateMonthlyProfit(hourlyProfit);
    activeNetRevenue += calculateActiveNetRevenue(
      entry.start_date, 
      null, 
      entry.exordiom_rate, 
      entry.cost
    );
  });
  
  // Process contracted entries
  const contractedEntries = filteredData.filter(entry => entry.status === 'Contracted');
  contractedEntries.forEach(entry => {
    const hourlyProfit = entry.exordiom_rate - entry.cost;
    totalFutureContractedGrossRevenue += calculateMonthlyProfit(entry.exordiom_rate);
    totalFutureContractedNetRevenue += calculateMonthlyProfit(hourlyProfit);
  });
  
  // Process terminated entries
  const terminatedEntries = filteredData.filter(entry => entry.status === 'Terminated');
  terminatedEntries.forEach(entry => {
    if (entry.end_date) {
      const hourlyProfit = entry.exordiom_rate - entry.cost;
      totalGrossRevenue += calculateMonthlyProfit(entry.exordiom_rate);
      totalNetRevenue += calculateMonthlyProfit(hourlyProfit);
      activeNetRevenue += calculateActiveNetRevenue(
        entry.start_date, 
        entry.end_date, 
        entry.exordiom_rate, 
        entry.cost
      );
    }
  });
  
  // Calculate average profit margin
  let averageProfitMargin = 0;
  if (hiredEntries.length > 0) {
    const totalMargin = hiredEntries.reduce((sum, entry) => {
      return sum + calculateMarginPercentage(entry.exordiom_rate, entry.cost);
    }, 0);
    averageProfitMargin = totalMargin / hiredEntries.length;
  }
  
  return {
    hiredInSeatCount,
    contractedCount,
    terminatedCount,
    totalGrossRevenue,
    totalNetRevenue,
    totalFutureContractedGrossRevenue,
    totalFutureContractedNetRevenue,
    activeNetRevenue,
    averageProfitMargin
  };
}

// Process customer data
export function processCustomerData(customers: any[], crmEntries: CrmEntry[]) {
  const totalCustomers = customers.filter(customer => !customer.is_churned).length;
  const churnedCustomers = customers.filter(customer => customer.is_churned).length;
  
  // Process customer details
  const customerDetails = customers.map(customer => {
    const customerEntries = crmEntries.filter(entry => 
      entry.company_name.toLowerCase() === customer.company_name.toLowerCase()
    );
    
    const hiredInSeatCount = customerEntries.filter(entry => entry.status === 'Hired In-Seat').length;
    const contractedCount = customerEntries.filter(entry => entry.status === 'Contracted').length;
    const terminatedCount = customerEntries.filter(entry => entry.status === 'Terminated').length;
    
    // Calculate revenue metrics
    let totalRevenue = 0;
    let totalNetRevenue = 0;
    let ytdRevenue = 0;
    let ytdNetRevenue = 0;
    
    // Get latest hiring manager as contact
    let contact = '';
    if (customerEntries.length > 0) {
      const latestEntry = customerEntries.sort((a, b) => 
        new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
      )[0];
      contact = latestEntry.hiring_manager;
    }
    
    // Calculate revenue metrics
    customerEntries.forEach(entry => {
      if (entry.status === 'Hired In-Seat' || entry.status === 'Terminated') {
        const hourlyProfit = entry.exordiom_rate - entry.cost;
        totalRevenue += calculateMonthlyProfit(entry.exordiom_rate);
        totalNetRevenue += calculateMonthlyProfit(hourlyProfit);
        
        // Check if entry is from current year for YTD calculations
        const currentYear = new Date().getFullYear();
        const entryYear = new Date(entry.start_date).getFullYear();
        if (entryYear === currentYear) {
          ytdRevenue += calculateMonthlyProfit(entry.exordiom_rate);
          ytdNetRevenue += calculateMonthlyProfit(hourlyProfit);
        }
      }
    });
    
    // Calculate margin percentage
    let marginPercentage = 0;
    const hiredEntries = customerEntries.filter(entry => entry.status === 'Hired In-Seat');
    if (hiredEntries.length > 0) {
      const totalMargin = hiredEntries.reduce((sum, entry) => {
        return sum + calculateMarginPercentage(entry.exordiom_rate, entry.cost);
      }, 0);
      marginPercentage = totalMargin / hiredEntries.length;
    }
    
    return {
      ...customer,
      contact,
      hiredInSeatCount,
      contractedCount,
      terminatedCount,
      totalRevenue,
      totalNetRevenue,
      ytdRevenue,
      ytdNetRevenue,
      marginPercentage
    };
  });
  
  return {
    totalCustomers,
    churnedCustomers,
    customerDetails
  };
}
