'use client';

import { ChevronDown, ChevronUp, ChevronsUpDown, Pencil, Trash2 } from 'lucide-react';
import { Subscription, FilterState, SortField } from '@/lib/types';
import { daysUntilRenewal, formatCurrency, formatDate } from '@/lib/utils';
import { StatusBadge } from './StatusBadge';

interface SubscriptionTableProps {
  subscriptions: Subscription[];
  loading: boolean;
  filters: FilterState;
  onSort: (field: SortField) => void;
  onEdit: (item: Subscription) => void;
  onDelete: (item: Subscription) => void;
}

function SortIcon({ field, filters }: { field: SortField; filters: FilterState }) {
  if (filters.sortField !== field) return <ChevronsUpDown className="w-4 h-4 opacity-30" />;
  return filters.sortDirection === 'asc' ? (
    <ChevronUp className="w-4 h-4" />
  ) : (
    <ChevronDown className="w-4 h-4" />
  );
}

function DaysDisplay({ days }: { days: number }) {
  if (days <= 0) {
    return <span className="text-red-500 text-xs font-medium">Expired</span>;
  }
  if (days <= 30) {
    return (
      <span className="text-amber-600 text-xs font-medium flex items-center gap-1">
        ⚠️ {days}d left
      </span>
    );
  }
  return <span className="text-gray-400 text-xs">{days}d left</span>;
}

export function SubscriptionTable({
  subscriptions,
  loading,
  filters,
  onSort,
  onEdit,
  onDelete,
}: SubscriptionTableProps) {
  const thClass = 'px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider';
  const sortableThClass = `${thClass} cursor-pointer hover:text-gray-700 select-none`;

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-center py-20 text-gray-400">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
        </div>
      </div>
    );
  }

  if (subscriptions.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <p className="text-lg font-medium">No subscriptions found</p>
          <p className="text-sm mt-1">Try adjusting your search or filter criteria</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th
                className={sortableThClass}
                onClick={() => onSort('tool_name')}
              >
                <div className="flex items-center gap-1">
                  Tool / App Name
                  <SortIcon field="tool_name" filters={filters} />
                </div>
              </th>
              <th
                className={sortableThClass}
                onClick={() => onSort('department')}
              >
                <div className="flex items-center gap-1">
                  Department
                  <SortIcon field="department" filters={filters} />
                </div>
              </th>
              <th
                className={sortableThClass}
                onClick={() => onSort('renewal_date')}
              >
                <div className="flex items-center gap-1">
                  Renewal Date
                  <SortIcon field="renewal_date" filters={filters} />
                </div>
              </th>
              <th
                className={sortableThClass}
                onClick={() => onSort('monthly_cost')}
              >
                <div className="flex items-center gap-1">
                  Monthly Cost
                  <SortIcon field="monthly_cost" filters={filters} />
                </div>
              </th>
              <th
                className={sortableThClass}
                onClick={() => onSort('status')}
              >
                <div className="flex items-center gap-1">
                  Status
                  <SortIcon field="status" filters={filters} />
                </div>
              </th>
              <th className={thClass}>Notes</th>
              <th className={thClass}>Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {subscriptions.map((sub) => {
              const days = daysUntilRenewal(sub.renewal_date);
              return (
                <tr
                  key={sub.id}
                  className="odd:bg-white even:bg-gray-50/50 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                    {sub.tool_name}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{sub.department}</td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-gray-700">{formatDate(sub.renewal_date)}</div>
                    <DaysDisplay days={days} />
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {formatCurrency(sub.monthly_cost)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={sub.status} />
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 max-w-[200px]">
                    {sub.notes ? (
                      <span title={sub.notes}>
                        {sub.notes.length > 50 ? `${sub.notes.slice(0, 50)}…` : sub.notes}
                      </span>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onEdit(sub)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(sub)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
