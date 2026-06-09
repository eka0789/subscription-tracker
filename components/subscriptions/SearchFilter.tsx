'use client';

import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { FilterState, SubscriptionStatus } from '@/lib/types';

interface SearchFilterProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  totalCount: number;
}

export function SearchFilter({ filters, onChange, totalCount }: SearchFilterProps) {
  const [searchInput, setSearchInput] = useState(filters.search);

  useEffect(() => {
    const timer = setTimeout(() => {
      onChange({ ...filters, search: searchInput });
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleStatusChange = (status: string) => {
    onChange({ ...filters, status: status as SubscriptionStatus | '' });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by tool name or department..."
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <select
          value={filters.status}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="w-full sm:w-48 px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="expiring_soon">Expiring Soon</option>
          <option value="expired">Expired</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <span className="text-sm text-gray-500 whitespace-nowrap">
          Showing {totalCount} subscription{totalCount !== 1 ? 's' : ''}
        </span>
      </div>
    </div>
  );
}
