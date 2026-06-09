import { SubscriptionStatus } from '@/lib/types';
import { getStatusClasses, getStatusLabel } from '@/lib/utils';

interface StatusBadgeProps {
  status: SubscriptionStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClasses(status)}`}
    >
      {getStatusLabel(status)}
    </span>
  );
}
