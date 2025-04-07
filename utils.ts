import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, differenceInDays, isWeekend, parseISO } from 'date-fns';

// Utility function to merge Tailwind CSS classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format date to display format
export function formatDate(dateString: string): string {
  if (!dateString) return '';
  return format(new Date(dateString), 'MMM d, yyyy');
}

// Calculate margin percentage
export function calculateMarginPercentage(exordiomRate: number, cost: number): number {
  if (cost === 0) return 0;
  return ((exordiomRate - cost) / exordiomRate) * 100;
}

// Calculate yearly profit
export function calculateYearlyProfit(exordiomRate: number, cost: number): number {
  const hourlyProfit = exordiomRate - cost;
  const monthlyProfit = hourlyProfit * 160; // 8 hours * 20 working days
  return monthlyProfit * 12;
}

// Calculate monthly profit
export function calculateMonthlyProfit(exordiomRate: number, cost: number): number {
  const hourlyProfit = exordiomRate - cost;
  return hourlyProfit * 160; // 8 hours * 20 working days
}

// Calculate Active Net Revenue
export function calculateActiveNetRevenue(startDate: string, endDate: string | null, exordiomRate: number, cost: number): number {
  if (!startDate) return 0;
  
  const start = parseISO(startDate);
  const end = endDate ? parseISO(endDate) : new Date();
  
  // Calculate the difference in days (inclusive of both start and end dates)
  const totalDays = differenceInDays(end, start) + 1;
  
  // Count working days (excluding weekends)
  let workingDays = 0;
  let currentDate = new Date(start);
  
  for (let i = 0; i < totalDays; i++) {
    if (!isWeekend(currentDate)) {
      workingDays++;
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  // Calculate net revenue: working days * 8 hours * (exordiom rate - cost)
  const hourlyProfit = exordiomRate - cost;
  return workingDays * 8 * hourlyProfit;
}

// Get period date range
export function getPeriodDateRange(period: string, customStartDate: string | null, customEndDate: string | null): { startDate: Date | null, endDate: Date | null } {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  
  switch (period) {
    case 'all':
      return { startDate: null, endDate: null };
      
    case 'current_year':
      return {
        startDate: new Date(currentYear, 0, 1),
        endDate: new Date(currentYear, 11, 31)
      };
      
    case 'current_quarter':
      const currentQuarter = Math.floor(currentMonth / 3);
      return {
        startDate: new Date(currentYear, currentQuarter * 3, 1),
        endDate: new Date(currentYear, (currentQuarter + 1) * 3, 0)
      };
      
    case 'last_quarter':
      const lastQuarter = (Math.floor(currentMonth / 3) - 1 + 4) % 4; // Add 4 and mod 4 to handle negative values
      const lastQuarterYear = lastQuarter > Math.floor(currentMonth / 3) ? currentYear - 1 : currentYear;
      return {
        startDate: new Date(lastQuarterYear, lastQuarter * 3, 1),
        endDate: new Date(lastQuarterYear, (lastQuarter + 1) * 3, 0)
      };
      
    case 'last_2_quarters':
      const twoQuartersAgo = (Math.floor(currentMonth / 3) - 2 + 4) % 4; // Add 4 and mod 4 to handle negative values
      const twoQuartersAgoYear = twoQuartersAgo > Math.floor(currentMonth / 3) ? currentYear - 1 : currentYear;
      return {
        startDate: new Date(twoQuartersAgoYear, twoQuartersAgo * 3, 1),
        endDate: new Date(currentYear, (Math.floor(currentMonth / 3) + 1) * 3, 0)
      };
      
    case 'last_calendar_year':
      return {
        startDate: new Date(currentYear - 1, 0, 1),
        endDate: new Date(currentYear - 1, 11, 31)
      };
      
    case 'custom':
      if (customStartDate && customEndDate) {
        return {
          startDate: new Date(customStartDate),
          endDate: new Date(customEndDate)
        };
      }
      return { startDate: null, endDate: null };
      
    default:
      return { startDate: null, endDate: null };
  }
}
