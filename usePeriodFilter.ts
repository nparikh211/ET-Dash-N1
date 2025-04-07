"use client"

import { useState, useEffect } from 'react';
import { useAppContext } from '@/lib/context';
import { getPeriodDateRange } from '@/lib/utils';

export function usePeriodFilter<T extends { start_date: string; end_date: string | null }>(
  data: T[],
  dependencies: any[] = []
): T[] {
  const { period, customStartDate, customEndDate } = useAppContext();
  const [filteredData, setFilteredData] = useState<T[]>(data);
  
  useEffect(() => {
    if (period === 'all') {
      setFilteredData(data);
      return;
    }
    
    const { startDate, endDate } = getPeriodDateRange(period, customStartDate, customEndDate);
    
    if (!startDate) {
      setFilteredData(data);
      return;
    }
    
    const filtered = data.filter(item => {
      const itemStartDate = new Date(item.start_date);
      
      // If item has no end date, it's still active
      if (!item.end_date) {
        // Include if item started before or during the period
        return itemStartDate <= (endDate || new Date());
      }
      
      const itemEndDate = new Date(item.end_date);
      
      // Include if item was active during the period
      // (started before period end AND ended after period start)
      return itemStartDate <= (endDate || new Date()) && itemEndDate >= startDate;
    });
    
    setFilteredData(filtered);
  }, [data, period, customStartDate, customEndDate, ...dependencies]);
  
  return filteredData;
}
