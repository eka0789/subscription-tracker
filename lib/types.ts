export type SubscriptionStatus = 'active' | 'expiring_soon' | 'expired' | 'cancelled';

export interface Subscription {
  id: string;
  tool_name: string;
  department: string;
  renewal_date: string;
  monthly_cost: number;
  status: SubscriptionStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export type SubscriptionInsert = Omit<Subscription, 'id' | 'created_at' | 'updated_at'>;
export type SubscriptionUpdate = Partial<SubscriptionInsert>;

export interface DashboardStats {
  total: number;
  active: number;
  expiring_soon: number;
  expired: number;
  total_monthly_cost: number;
}

export type SortField = 'tool_name' | 'department' | 'renewal_date' | 'monthly_cost' | 'status';
export type SortDirection = 'asc' | 'desc';

export interface FilterState {
  search: string;
  status: SubscriptionStatus | '';
  sortField: SortField;
  sortDirection: SortDirection;
}
