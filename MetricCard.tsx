"use client"

import { ReactNode } from 'react';
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  bgColor: string;
  iconColor: string;
  change?: number;
  highlighted?: boolean;
}

export default function MetricCard({
  title,
  value,
  icon,
  bgColor,
  iconColor,
  change = 0,
  highlighted = false,
}: MetricCardProps) {
  return (
    <div className={`${highlighted ? 'ring-2 ring-yellow-400' : ''} bg-white overflow-hidden shadow rounded-lg`}>
      <div className="p-5">
        <div className="flex items-center">
          <div className={`flex-shrink-0 ${bgColor} rounded-md p-3`}>
            {icon}
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd>
                <div className="text-lg font-medium text-gray-900">{value}</div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-5 py-3">
        <div className="text-sm">
          <div className="flex items-center">
            {change > 0 ? (
              <FiTrendingUp className="flex-shrink-0 self-center h-5 w-5 text-green-500" />
            ) : change < 0 ? (
              <FiTrendingDown className="flex-shrink-0 self-center h-5 w-5 text-red-500" />
            ) : (
              <span className="flex-shrink-0 self-center h-5 w-5" />
            )}
            <span
              className={`ml-2 ${
                change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-500'
              }`}
            >
              {change > 0 ? `↑ ${change}%` : change < 0 ? `↓ ${Math.abs(change)}%` : `${change}%`} vs previous period
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
