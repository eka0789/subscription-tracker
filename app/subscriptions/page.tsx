'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { Plus, Download } from 'lucide-react';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { Subscription, SubscriptionInsert, FilterState, SortField } from '@/lib/types';
import { exportToCSV } from '@/lib/utils';
import { SearchFilter } from '@/components/subscriptions/SearchFilter';
import { SubscriptionTable } from '@/components/subscriptions/SubscriptionTable';
import { SubscriptionModal } from '@/components/subscriptions/SubscriptionModal';
import { DeleteConfirmModal } from '@/components/subscriptions/DeleteConfirmModal';

export default function SubscriptionsPage() {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    status: '',
    sortField: 'renewal_date',
    sortDirection: 'asc',
  });
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Subscription | null>(null);
  const [deletingItem, setDeletingItem] = useState<Subscription | null>(null);

  const { subscriptions, loading, error, createSubscription, updateSubscription, deleteSubscription } =
    useSubscriptions(filters);

  const handleSort = (field: SortField) => {
    setFilters((prev) => ({
      ...prev,
      sortField: field,
      sortDirection: prev.sortField === field && prev.sortDirection === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleAdd = () => {
    setEditingItem(null);
    setShowModal(true);
  };

  const handleEdit = (item: Subscription) => {
    setEditingItem(item);
    setShowModal(true);
  };

  const handleSave = async (data: SubscriptionInsert) => {
    if (editingItem) {
      await updateSubscription(editingItem.id, data);
    } else {
      await createSubscription(data);
    }
  };

  const handleDelete = (item: Subscription) => {
    setDeletingItem(item);
  };

  const handleConfirmDelete = async () => {
    if (deletingItem) {
      await deleteSubscription(deletingItem.id);
    }
  };

  const handleExportCSV = () => {
    exportToCSV(subscriptions);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Subscriptions</h1>
          <p className="text-sm text-gray-500 mt-0.5">Track and manage all your tool subscriptions</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Subscription
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
          Error loading subscriptions: {error}
        </div>
      )}

      <SearchFilter
        filters={filters}
        onChange={setFilters}
        totalCount={subscriptions.length}
      />

      <SubscriptionTable
        subscriptions={subscriptions}
        loading={loading}
        filters={filters}
        onSort={handleSort}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <SubscriptionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
        editingItem={editingItem}
      />

      <DeleteConfirmModal
        isOpen={!!deletingItem}
        onClose={() => setDeletingItem(null)}
        onConfirm={handleConfirmDelete}
        itemName={deletingItem?.tool_name ?? ''}
      />
    </div>
  );
}
