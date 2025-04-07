"use client"

import { useState } from 'react';
import { FiCalendar, FiChevronDown } from 'react-icons/fi';
import { useAppContext } from '@/lib/context';
import { format } from 'date-fns';

export default function PeriodSelector({ onPeriodChange }: { onPeriodChange: (period: string) => void }) {
  const { period, setPeriod, customStartDate, setCustomStartDate, customEndDate, setCustomEndDate } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const [showCustomDates, setShowCustomDates] = useState(false);
  
  const handlePeriodChange = (newPeriod: string) => {
    setPeriod(newPeriod);
    setIsOpen(false);
    setShowCustomDates(newPeriod === 'custom');
    
    if (newPeriod !== 'custom') {
      setCustomStartDate(null);
      setCustomEndDate(null);
    }
    
    onPeriodChange(newPeriod);
  };
  
  const handleCustomDateChange = () => {
    if (customStartDate && customEndDate) {
      onPeriodChange('custom');
    }
  };
  
  const getPeriodLabel = () => {
    switch (period) {
      case 'all':
        return 'All Time';
      case 'current_year':
        return 'Current Year';
      case 'current_quarter':
        return 'Current Quarter';
      case 'last_quarter':
        return 'Last Quarter';
      case 'last_2_quarters':
        return 'Last 2 Quarters';
      case 'last_calendar_year':
        return 'Last Calendar Year';
      case 'custom':
        if (customStartDate && customEndDate) {
          return `${format(new Date(customStartDate), 'MMM d, yyyy')} - ${format(new Date(customEndDate), 'MMM d, yyyy')}`;
        }
        return 'Custom Range';
      default:
        return 'All Time';
    }
  };
  
  return (
    <div className="relative">
      <button
        type="button"
        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FiCalendar className="mr-2 -ml-1 h-5 w-5 text-gray-500" />
        Period: {getPeriodLabel()}
        <FiChevronDown className="ml-2 -mr-1 h-5 w-5 text-gray-500" />
      </button>
      
      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            <button
              onClick={() => handlePeriodChange('all')}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              role="menuitem"
            >
              All Time
            </button>
            <button
              onClick={() => handlePeriodChange('current_year')}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              role="menuitem"
            >
              Current Year
            </button>
            <button
              onClick={() => handlePeriodChange('current_quarter')}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              role="menuitem"
            >
              Current Quarter
            </button>
            <button
              onClick={() => handlePeriodChange('last_quarter')}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              role="menuitem"
            >
              Last Quarter
            </button>
            <button
              onClick={() => handlePeriodChange('last_2_quarters')}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              role="menuitem"
            >
              Last 2 Quarters
            </button>
            <button
              onClick={() => handlePeriodChange('last_calendar_year')}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              role="menuitem"
            >
              Last Calendar Year
            </button>
            <button
              onClick={() => handlePeriodChange('custom')}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              role="menuitem"
            >
              Custom Range
            </button>
          </div>
        </div>
      )}
      
      {showCustomDates && (
        <div className="mt-3 p-3 bg-white border border-gray-300 rounded-md shadow-sm">
          <div className="space-y-3">
            <div>
              <label htmlFor="start-date" className="block text-sm font-medium text-gray-700">
                Start Date
              </label>
              <input
                type="date"
                id="start-date"
                value={customStartDate || ''}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="end-date" className="block text-sm font-medium text-gray-700">
                End Date
              </label>
              <input
                type="date"
                id="end-date"
                value={customEndDate || ''}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>
            <button
              type="button"
              onClick={handleCustomDateChange}
              className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
