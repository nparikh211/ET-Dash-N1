"use client"

import { format } from 'date-fns';
import { FiCalendar } from 'react-icons/fi';

export default function ContractEndDates({ contracts }: { contracts: any[] }) {
  if (!contracts || contracts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <FiCalendar className="h-12 w-12 text-gray-300" />
        <p className="mt-2 text-gray-500">No upcoming contracts ending soon</p>
      </div>
    );
  }
  
  return (
    <div className="flow-root">
      <ul className="-my-5 divide-y divide-gray-200">
        {contracts.map((contract) => (
          <li key={contract.id} className="py-4">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <FiCalendar className="h-6 w-6 text-primary-600" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {contract.personnel_name}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {contract.position} at {contract.company_name}
                </p>
              </div>
              <div>
                <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  {format(new Date(contract.end_date), 'MMM d, yyyy')}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
