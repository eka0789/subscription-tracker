'use client';

import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { Subscription, SubscriptionInsert, SubscriptionStatus } from '@/lib/types';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: SubscriptionInsert) => Promise<void>;
  editingItem?: Subscription | null;
}

const defaultForm: SubscriptionInsert = {
  tool_name: '',
  department: '',
  renewal_date: '',
  monthly_cost: 0,
  status: 'active',
  notes: '',
};

export function SubscriptionModal({ isOpen, onClose, onSave, editingItem }: SubscriptionModalProps) {
  const [formData, setFormData] = useState<SubscriptionInsert>(defaultForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editingItem) {
      setFormData({
        tool_name: editingItem.tool_name,
        department: editingItem.department,
        renewal_date: editingItem.renewal_date,
        monthly_cost: editingItem.monthly_cost,
        status: editingItem.status,
        notes: editingItem.notes ?? '',
      });
    } else {
      setFormData(defaultForm);
    }
    setErrors({});
  }, [editingItem, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.tool_name.trim()) newErrors.tool_name = 'Tool name is required';
    if (!formData.department.trim()) newErrors.department = 'Department is required';
    if (!formData.renewal_date) newErrors.renewal_date = 'Renewal date is required';
    if (formData.monthly_cost < 0) newErrors.monthly_cost = 'Cost must be 0 or greater';
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (err: unknown) {
      setErrors({ submit: err instanceof Error ? err.message : 'Failed to save' });
    } finally {
      setSaving(false);
    }
  };

  const handleBackdrop = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) onClose();
  };

  const isEdit = !!editingItem;

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdrop}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {isEdit ? 'Edit Subscription' : 'Add Subscription'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errors.submit && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {errors.submit}
            </p>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tool / App Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.tool_name}
              onChange={(e) => setFormData({ ...formData, tool_name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g. Slack, Notion, AWS"
            />
            {errors.tool_name && <p className="mt-1 text-xs text-red-500">{errors.tool_name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g. Engineering, Design, Marketing"
              list="departments"
            />
            <datalist id="departments">
              <option value="Engineering" />
              <option value="Design" />
              <option value="Marketing" />
              <option value="Operations" />
              <option value="Product" />
              <option value="Infrastructure" />
              <option value="All Dept" />
            </datalist>
            {errors.department && <p className="mt-1 text-xs text-red-500">{errors.department}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Renewal Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.renewal_date}
              onChange={(e) => setFormData({ ...formData, renewal_date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.renewal_date && <p className="mt-1 text-xs text-red-500">{errors.renewal_date}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Monthly Cost (USD)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.monthly_cost}
              onChange={(e) =>
                setFormData({ ...formData, monthly_cost: parseFloat(e.target.value) || 0 })
              }
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.monthly_cost && <p className="mt-1 text-xs text-red-500">{errors.monthly_cost}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value as SubscriptionStatus })
              }
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="active">Active</option>
              <option value="expiring_soon">Expiring Soon</option>
              <option value="expired">Expired</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              rows={3}
              value={formData.notes ?? ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              placeholder="Optional notes..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : isEdit ? 'Update Subscription' : 'Save Subscription'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
