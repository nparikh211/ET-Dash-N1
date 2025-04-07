"use client"

import { useState, useEffect } from 'react';
import { FiFilter } from 'react-icons/fi';
import { useAppContext } from '@/lib/context';
import { formatDate, calculateMarginPercentage } from '@/lib/utils';
import { usePeriodFilter } from '@/lib/hooks/usePeriodFilter';
import { useProcessCustomerData } from '@/lib/hooks/useDataProcessing';

// Mock data for initial development
const mockCrmData = [
  {
    id: 1,
    status: 'Hired In-Seat',
    company_name: 'Acme Corp',
    personnel_name: 'John Doe',
    position: 'Software Engineer',
    start_date: '2025-01-15',
    end_date: null,
    hiring_manager: 'Jane Smith',
    cost: 75,
    exordiom_rate: 125,
    created_at: '2025-01-10T00:00:00Z',
    updated_at: '2025-01-10T00:00:00Z'
  },
  {
    id: 2,
    status: 'Contracted',
    company_name: 'TechGiant',
    personnel_name: 'Alice Johnson',
    position: 'Product Manager',
    start_date: '2025-02-01',
    end_date: null,
    hiring_manager: 'Bob Williams',
    cost: 90,
    exordiom_rate: 150,
    created_at: '2025-01-20T00:00:00Z',
    updated_at: '2025-01-20T00:00:00Z'
  },
  {
    id: 3,
    status: 'Terminated',
    company_name: 'Acme Corp',
    personnel_name: 'Michael Brown',
    position: 'Data Analyst',
    start_date: '2024-11-01',
    end_date: '2025-02-28',
    hiring_manager: 'Jane Smith',
    cost: 65,
    exordiom_rate: 110,
    created_at: '2024-10-25T00:00:00Z',
    updated_at: '2025-03-01T00:00:00Z'
  },
  {
    id: 4,
    status: 'Hired In-Seat',
    company_name: 'Pepsi',
    personnel_name: 'Sarah Wilson',
    position: 'Marketing Manager',
    start_date: '2025-01-05',
    end_date: null,
    hiring_manager: 'David Johnson',
    cost: 85,
    exordiom_rate: 140,
    created_at: '2024-12-20T00:00:00Z',
    updated_at: '2024-12-20T00:00:00Z'
  },
  {
    id: 5,
    status: 'Hired In-Seat',
    company_name: 'Pepsi',
    personnel_name: 'Robert Garcia',
    position: 'Sales Director',
    start_date: '2025-02-10',
    end_date: null,
    hiring_manager: 'David Johnson',
    cost: 95,
    exordiom_rate: 160,
    created_at: '2025-01-25T00:00:00Z',
    updated_at: '2025-01-25T00:00:00Z'
  },
  {
    id: 6,
    status: 'Contracted',
    company_name: 'Pepsi',
    personnel_name: 'Emily Chen',
    position: 'Data Scientist',
    start_date: '2025-03-01',
    end_date: null,
    hiring_manager: 'David Johnson',
    cost: 80,
    exordiom_rate: 135,
    created_at: '2025-02-15T00:00:00Z',
    updated_at: '2025-02-15T00:00:00Z'
  },
  {
    id: 7,
    status: 'Terminated',
    company_name: 'Pepsi',
    personnel_name: 'James Taylor',
    position: 'Brand Manager',
    start_date: '2024-10-15',
    end_date: '2025-01-15',
    hiring_manager: 'David Johnson',
    cost: 75,
    exordiom_rate: 130,
    created_at: '2024-10-01T00:00:00Z',
    updated_at: '2025-01-16T00:00:00Z'
  }
];

// Process CRM data to get customer information
const processCustomerData = (crmData) => {
  const customerMap = new Map();
  
  crmData.forEach(entry => {
    const companyName = entry.company_name;
    
    if (!customerMap.has(companyName)) {
      customerMap.set(companyName, {
        company_name: companyName,
        contact: entry.hiring_manager,
        hired_in_seat: 0,
        contracted: 0,
        total_revenue_all_time: 0,
        total_net_revenue_all_time: 0,
        total_revenue_ytd: 0,
        total_net_revenue_ytd: 0,
        margin_percentage: 0,
        churned: 0,
        is_churned: false,
        latest_entry_date: new Date(entry.start_date),
        entries: []
      });
    }
    
    const customer = customerMap.get(companyName);
    customer.entries.push(entry);
    
    // Update latest entry and contact
    const entryDate = new Date(entry.start_date);
    if (entryDate > customer.latest_entry_date) {
      customer.latest_entry_date = entryDate;
      customer.contact = entry.hiring_manager;
    }
  });
  
  return Array.from(customerMap.values());
};

export default function CustomersPage() {
  const { period, refreshData } = useAppContext();
  const [crmEntries, setCrmEntries] = useState(mockCrmData);
  const [customers, setCustomers] = useState(processCustomerData(mockCrmData));
  
  // Filter CRM entries based on period
  const periodFilteredCrmEntries = usePeriodFilter(crmEntries, []);
  
  // Process customer data with period filtering
  const { totalCustomers, churnedCustomers, customerDetails } = useProcessCustomerData(customers, periodFilteredCrmEntries);
  
  const [filteredCustomers, setFilteredCustomers] = useState(customerDetails);
  const [filterValue, setFilterValue] = useState('');
  const [sortConfig, setSortConfig] = useState<{key: string, direction: 'ascending' | 'descending'} | null>(null);
  
  // Update filtered customers when period changes
  useEffect(() => {
    setFilteredCustomers(customerDetails);
  }, [customerDetails]);
  
  // Calculate totals for the table
  const calculateTotals = (data: any[]) => {
    return {
      hiredInSeat: data.reduce((sum, customer) => sum + customer.hiredInSeatCount, 0),
      contracted: data.reduce((sum, customer) => sum + customer.contractedCount, 0),
      totalRevenueAllTime: data.reduce((sum, customer) => sum + customer.totalRevenue, 0),
      totalNetRevenueAllTime: data.reduce((sum, customer) => sum + customer.totalNetRevenue, 0),
      totalRevenueYtd: data.reduce((sum, customer) => sum + customer.ytdRevenue, 0),
      totalNetRevenueYtd: data.reduce((sum, customer) => sum + customer.ytdNetRevenue, 0),
      marginPercentage: data.length > 0 
        ? data.reduce((sum, customer) => sum + customer.marginPercentage, 0) / data.length 
        : 0,
      churned: data.reduce((sum, customer) => sum + customer.terminatedCount, 0),
      churnedAccounts: data.filter(customer => customer.is_churned).length
    };
  };
  
  // Calculate totals
  const totals = calculateTotals(filteredCustomers);
  
  // Handle churned account toggle
  const handleChurnedToggle = (companyName: string) => {
    const updatedCustomers = customers.map(customer => {
      if (customer.company_name === companyName) {
        return { ...customer, is_churned: !customer.is_churned };
      }
      return customer;
    });
    
    setCustomers(updatedCustomers);
  };
  
  // Handle filtering
  useEffect(() => {
    if (filterValue) {
      const filtered = customerDetails.filter(customer => 
        customer.company_name.toLowerCase().includes(filterValue.toLowerCase()) ||
        customer.contact.toLowerCase().includes(filterValue.toLowerCase())
      );
      setFilteredCustomers(filtered);
    } else {
      setFilteredCustomers(customerDetails);
    }
  }, [customerDetails, filterValue]);
  
  // Handle sorting
  const requestSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  useEffect(() => {
    if (sortConfig !== null) {
      const sortedCustomers = [...filteredCustomers].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
      setFilteredCustomers(sortedCustomers);
    }
  }, [sortConfig, customerDetails]);
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  // Format percentage
  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };
  
  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Customers
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            View all customers and their placement metrics.
          </p>
        </div>
      </div>
      
      <div className="flex justify-end mb-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiFilter className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Filter customers..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort('company_name')}
                    >
                      Company
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort('contact')}
                    >
                      Contact
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort('hiredInSeatCount')}
                    >
                      # Hired In-Seat
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort('contractedCount')}
                    >
                      # Contracted
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort('totalRevenue')}
                    >
                      Total Revenue (All-time)
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort('totalNetRevenue')}
                    >
                      Total Net Revenue (All-time)
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort('ytdRevenue')}
                    >
                      Total Revenue (YTD)
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort('ytdNetRevenue')}
                    >
                      Total Net Revenue (YTD)
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort('marginPercentage')}
                    >
                      % Margin
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort('terminatedCount')}
                    >
                      # Churned
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Churned Acct
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCustomers.map((customer) => {
                    const rowClass = customer.is_churned ? 'line-through text-red-500' : '';
                    
                    return (
                      <tr key={customer.company_name} className={rowClass}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {customer.company_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {customer.contact}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {customer.hiredInSeatCount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {customer.contractedCount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatCurrency(customer.totalRevenue)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatCurrency(customer.totalNetRevenue)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatCurrency(customer.ytdRevenue)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatCurrency(customer.ytdNetRevenue)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatPercentage(customer.marginPercentage)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {customer.terminatedCount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <input
                            type="checkbox"
                            checked={customer.is_churned}
                            onChange={() => handleChurnedToggle(customer.company_name)}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan={2} classN
(Content truncated due to size limit. Use line ranges to read in chunks)