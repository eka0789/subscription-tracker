'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Subscription, SubscriptionInsert, SubscriptionUpdate, FilterState } from '@/lib/types';

export function useSubscriptions(filters: FilterState) {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscriptions = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase.from('subscriptions').select('*');

      if (filters.search) {
        query = query.or(
          `tool_name.ilike.%${filters.search}%,department.ilike.%${filters.search}%`
        );
      }
      if (filters.status) {
        query = query.eq('status', filters.status);
      }

      query = query.order(filters.sortField, { ascending: filters.sortDirection === 'asc' });

      const { data, error } = await query;
      if (error) throw error;
      setSubscriptions(data ?? []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  const createSubscription = async (payload: SubscriptionInsert) => {
    const { error } = await supabase.from('subscriptions').insert(payload);
    if (error) throw error;
    await fetchSubscriptions();
  };

  const updateSubscription = async (id: string, payload: SubscriptionUpdate) => {
    const { error } = await supabase.from('subscriptions').update(payload).eq('id', id);
    if (error) throw error;
    await fetchSubscriptions();
  };

  const deleteSubscription = async (id: string) => {
    const { error } = await supabase.from('subscriptions').delete().eq('id', id);
    if (error) throw error;
    await fetchSubscriptions();
  };

  return {
    subscriptions,
    loading,
    error,
    refetch: fetchSubscriptions,
    createSubscription,
    updateSubscription,
    deleteSubscription,
  };
}
