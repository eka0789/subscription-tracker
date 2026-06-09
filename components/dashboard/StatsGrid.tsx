'use client';

import { useEffect, useState } from 'react';
import { LayoutGrid, CheckCircle, Clock, XCircle, DollarSign } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { DashboardStats } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { StatsCard } from './StatsCard';

export function StatsGrid() {
  const [stats, setStats] = useState<DashboardStats>({
    total: 0,
    active: 0,
    expiring_soon: 0,
    expired: 0,
    total_monthly_cost: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const { data, error } = await supabase.from('subscriptions').select('status, monthly_cost');
        if (error) throw error;

        const rows = data ?? [];
        const total = rows.length;
        const active = rows.filter((r) => r.status === 'active').length;
        const expiring_soon = rows.filter((r) => r.status === 'expiring_soon').length;
        const expired = rows.filter((r) => r.status === 'expired').length;
        const total_monthly_cost = rows
          .filter((r) => r.status === 'active')
          .reduce((sum, r) => sum + (r.monthly_cost ?? 0), 0);

        setStats({ total, active, expiring_soon, expired, total_monthly_cost });
      } catch {
        // silently fail — stats just stay at 0
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 animate-pulse h-28" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Subscriptions"
          value={stats.total}
          colorClass="border-l-indigo-500"
          icon={<LayoutGrid className="w-8 h-8" />}
        />
        <StatsCard
          title="Active"
          value={stats.active}
          colorClass="border-l-green-500"
          icon={<CheckCircle className="w-8 h-8" />}
        />
        <StatsCard
          title="Expiring Soon"
          value={stats.expiring_soon}
          colorClass="border-l-amber-500"
          icon={<Clock className="w-8 h-8" />}
        />
        <StatsCard
          title="Expired"
          value={stats.expired}
          colorClass="border-l-red-500"
          icon={<XCircle className="w-8 h-8" />}
        />
      </div>
      <div className="grid grid-cols-1 gap-4">
        <StatsCard
          title="Total Monthly Cost (Active)"
          value={formatCurrency(stats.total_monthly_cost)}
          colorClass="border-l-indigo-500"
          icon={<DollarSign className="w-8 h-8" />}
        />
      </div>
    </div>
  );
}
