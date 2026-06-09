'use client';

import { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Subscription } from '@/lib/types';
import { daysUntilRenewal, formatDate, formatCurrency } from '@/lib/utils';
import { StatusBadge } from '@/components/subscriptions/StatusBadge';

export function UpcomingRenewals() {
  const [renewals, setRenewals] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRenewals() {
      try {
        const { data, error } = await supabase
          .from('subscriptions')
          .select('*')
          .not('status', 'in', '("expired","cancelled")')
          .order('renewal_date', { ascending: true })
          .limit(5);
        if (error) throw error;
        setRenewals(data ?? []);
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }
    fetchRenewals();
  }, []);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-base font-semibold text-gray-900">Upcoming Renewals</h2>
        <p className="text-sm text-gray-500 mt-0.5">Next 5 active subscriptions due for renewal</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600" />
        </div>
      ) : renewals.length === 0 ? (
        <div className="flex items-center justify-center py-10 text-gray-400 text-sm">
          No upcoming renewals
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Tool
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Renewal Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Cost/mo
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {renewals.map((sub) => {
                const days = daysUntilRenewal(sub.renewal_date);
                const isUrgent = days <= 7;
                return (
                  <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2">
                        {isUrgent && (
                          <Bell className="w-4 h-4 text-amber-500 shrink-0" />
                        )}
                        <span className="text-sm font-medium text-gray-900">{sub.tool_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-600">{sub.department}</td>
                    <td className="px-6 py-3">
                      <div className="text-sm text-gray-700">{formatDate(sub.renewal_date)}</div>
                      <div
                        className={`text-xs mt-0.5 font-medium ${
                          days <= 7
                            ? 'text-red-500'
                            : days <= 30
                            ? 'text-amber-600'
                            : 'text-gray-400'
                        }`}
                      >
                        {days <= 0 ? 'Overdue' : `${days} day${days !== 1 ? 's' : ''} left`}
                      </div>
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-700">
                      {formatCurrency(sub.monthly_cost)}
                    </td>
                    <td className="px-6 py-3">
                      <StatusBadge status={sub.status} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
