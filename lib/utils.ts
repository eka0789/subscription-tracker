import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Subscription, SubscriptionStatus } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function daysUntilRenewal(renewalDate: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const renewal = new Date(renewalDate);
  const diff = renewal.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function getStatusClasses(status: SubscriptionStatus): string {
  const map: Record<SubscriptionStatus, string> = {
    active: 'bg-green-100 text-green-800 border border-green-200',
    expiring_soon: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
    expired: 'bg-red-100 text-red-800 border border-red-200',
    cancelled: 'bg-gray-100 text-gray-600 border border-gray-200',
  };
  return map[status];
}

export function getStatusLabel(status: SubscriptionStatus): string {
  const map: Record<SubscriptionStatus, string> = {
    active: 'Active',
    expiring_soon: 'Expiring Soon',
    expired: 'Expired',
    cancelled: 'Cancelled',
  };
  return map[status];
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function exportToCSV(subscriptions: Subscription[]): void {
  const headers = ['Tool Name', 'Department', 'Renewal Date', 'Monthly Cost', 'Status', 'Notes'];
  const rows = subscriptions.map((s) => [
    s.tool_name,
    s.department,
    s.renewal_date,
    s.monthly_cost,
    getStatusLabel(s.status),
    s.notes ?? '',
  ]);

  const csvContent = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `subscriptions_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
