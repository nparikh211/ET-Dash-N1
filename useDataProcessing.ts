"use client"

import { useState, useEffect } from 'react';
import { usePeriodFilter } from '@/lib/hooks/usePeriodFilter';

interface CrmEntry {
  id: number;
  status: string;
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

interface Customer {
  company_name: string;
  contact: string;
  hired_in_seat: number;
  contracted: number;
  total_revenue_all_time: number;
  total_net_revenue_all_time: number;
  total_revenue_ytd: number;
  total_net_revenue_ytd: number;
  margin_percentage: number;
  churned: number;
  is_churned: boolean;
  latest_entry_date: Date;
  entries: CrmEntry[];
}

export function useProcessCrmData(crmEntries: CrmEntry[]) {
  const [metrics, setMetrics] = useState({
    hiredInSeatCount: 0,
    contractedCount: 0,
    terminatedCount: 0,
    totalGrossRevenue: 0,
    totalNetRevenue: 0,
    totalFutureContractedGrossRevenue: 0,
    totalFutureContractedNetRevenue: 0,
    averageProfitMargin: 0,
    activeNetRevenue: 0
  });
  
  useEffect(() => {
    // Count personnel by status
    const hiredInSeatCount = crmEntries.filter(entry => entry.status === 'Hired In-Seat').length;
    const contractedCount = crmEntries.filter(entry => entry.status === 'Contracted').length;
    const terminatedCount = crmEntries.filter(entry => entry.status === 'Terminated').length;
    
    // Calculate revenue metrics
    const hiredEntries = crmEntries.filter(entry => entry.status === 'Hired In-Seat');
    const contractedEntries = crmEntries.filter(entry => entry.status === 'Contracted');
    
    // Calculate total gross revenue (Exordiom Rate * 160 hours * months)
    const totalGrossRevenue = hiredEntries.reduce((sum, entry) => {
      const monthsActive = 12; // Simplified for mock data
      return sum + (entry.exordiom_rate * 160 * monthsActive);
    }, 0);
    
    // Calculate total net revenue (Profit * 160 hours * months)
    const totalNetRevenue = hiredEntries.reduce((sum, entry) => {
      const monthsActive = 12; // Simplified for mock data
      const profit = entry.exordiom_rate - entry.cost;
      return sum + (profit * 160 * monthsActive);
    }, 0);
    
    // Calculate future contracted revenue
    const totalFutureContractedGrossRevenue = contractedEntries.reduce((sum, entry) => {
      const monthsContracted = 12; // Simplified for mock data
      return sum + (entry.exordiom_rate * 160 * monthsContracted);
    }, 0);
    
    const totalFutureContractedNetRevenue = contractedEntries.reduce((sum, entry) => {
      const monthsContracted = 12; // Simplified for mock data
      const profit = entry.exordiom_rate - entry.cost;
      return sum + (profit * 160 * monthsContracted);
    }, 0);
    
    // Calculate average profit margin
    const totalMargin = crmEntries.reduce((sum, entry) => {
      if (entry.cost === 0) return sum;
      const margin = ((entry.exordiom_rate - entry.cost) / entry.exordiom_rate) * 100;
      return sum + margin;
    }, 0);
    
    const averageProfitMargin = crmEntries.length > 0 ? totalMargin / crmEntries.length : 0;
    
    // Calculate active net revenue
    const activeNetRevenue = crmEntries.reduce((sum, entry) => {
      if (entry.status !== 'Hired In-Seat' && entry.status !== 'Terminated') return sum;
      
      const start = new Date(entry.start_date);
      const end = entry.end_date ? new Date(entry.end_date) : new Date();
      
      // Calculate working days (excluding weekends)
      const totalDays = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      let workingDays = 0;
      
      for (let i = 0; i < totalDays; i++) {
        const currentDate = new Date(start);
        currentDate.setDate(start.getDate() + i);
        const dayOfWeek = currentDate.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) { // 0 = Sunday, 6 = Saturday
          workingDays++;
        }
      }
      
      // Calculate net revenue: working days * 8 hours * (exordiom rate - cost)
      const hourlyProfit = entry.exordiom_rate - entry.cost;
      return sum + (workingDays * 8 * hourlyProfit);
    }, 0);
    
    setMetrics({
      hiredInSeatCount,
      contractedCount,
      terminatedCount,
      totalGrossRevenue,
      totalNetRevenue,
      totalFutureContractedGrossRevenue,
      totalFutureContractedNetRevenue,
      averageProfitMargin,
      activeNetRevenue
    });
  }, [crmEntries]);
  
  return metrics;
}

export function useProcessCustomerData(customers: Customer[], crmEntries: CrmEntry[]) {
  const [customerData, setCustomerData] = useState({
    totalCustomers: 0,
    churnedCustomers: 0,
    customerDetails: [] as any[]
  });
  
  useEffect(() => {
    // Process customer data
    const customerMap = new Map<string, any>();
    
    // Group CRM entries by company
    crmEntries.forEach(entry => {
      const companyName = entry.company_name;
      
      if (!customerMap.has(companyName)) {
        const customer = customers.find(c => c.company_name === companyName) || {
          company_name: companyName,
          contact: entry.hiring_manager,
          is_churned: false
        };
        
        customerMap.set(companyName, {
          company_name: companyName,
          contact: customer.contact || entry.hiring_manager,
          is_churned: customer.is_churned || false,
          entries: []
        });
      }
      
      customerMap.get(companyName).entries.push(entry);
    });
    
    // Calculate metrics for each customer
    const customerDetails = Array.from(customerMap.values()).map(customer => {
      const entries = customer.entries;
      const hiredInSeatEntries = entries.filter((e: CrmEntry) => e.status === 'Hired In-Seat');
      const contractedEntries = entries.filter((e: CrmEntry) => e.status === 'Contracted');
      const terminatedEntries = entries.filter((e: CrmEntry) => e.status === 'Terminated');
      
      // Calculate revenue metrics
      const totalRevenue = hiredInSeatEntries.reduce((sum: number, entry: CrmEntry) => {
        const monthsActive = 12; // Simplified for mock data
        return sum + (entry.exordiom_rate * 160 * monthsActive);
      }, 0);
      
      const totalNetRevenue = hiredInSeatEntries.reduce((sum: number, entry: CrmEntry) => {
        const monthsActive = 12; // Simplified for mock data
        const profit = entry.exordiom_rate - entry.cost;
        return sum + (profit * 160 * monthsActive);
      }, 0);
      
      // Calculate YTD revenue (simplified for mock data)
      const currentYear = new Date().getFullYear();
      const ytdEntries = hiredInSeatEntries.filter((e: CrmEntry) => {
        const entryYear = new Date(e.start_date).getFullYear();
        return entryYear === currentYear;
      });
      
      const ytdRevenue = ytdEntries.reduce((sum: number, entry: CrmEntry) => {
        const monthsActive = 6; // Simplified for mock data
        return sum + (entry.exordiom_rate * 160 * monthsActive);
      }, 0);
      
      const ytdNetRevenue = ytdEntries.reduce((sum: number, entry: CrmEntry) => {
        const monthsActive = 6; // Simplified for mock data
        const profit = entry.exordiom_rate - entry.cost;
        return sum + (profit * 160 * monthsActive);
      }, 0);
      
      // Calculate margin percentage
      const totalMargin = hiredInSeatEntries.reduce((sum: number, entry: CrmEntry) => {
        if (entry.cost === 0) return sum;
        const margin = ((entry.exordiom_rate - entry.cost) / entry.exordiom_rate) * 100;
        return sum + margin;
      }, 0);
      
      const marginPercentage = hiredInSeatEntries.length > 0 ? totalMargin / hiredInSeatEntries.length : 0;
      
      return {
        ...customer,
        hiredInSeatCount: hiredInSeatEntries.length,
        contractedCount: contractedEntries.length,
        terminatedCount: terminatedEntries.length,
        totalRevenue,
        totalNetRevenue,
        ytdRevenue,
        ytdNetRevenue,
        marginPercentage
      };
    });
    
    // Calculate total and churned customers
    const totalCustomers = customerDetails.length;
    const churnedCustomers = customerDetails.filter(c => c.is_churned).length;
    
    setCustomerData({
      totalCustomers,
      churnedCustomers,
      customerDetails
    });
  }, [customers, crmEntries]);
  
  return customerData;
}
