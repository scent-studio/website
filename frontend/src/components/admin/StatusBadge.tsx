import React from 'react';
import { cn } from '../../lib/utils';
import type { OrderStatus } from '../../types';

const statusStyles: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-800 border-amber-200',
  confirmed: 'bg-sky-50 text-sky-800 border-sky-200',
  packed: 'bg-indigo-50 text-indigo-800 border-indigo-200',
  shipped: 'bg-orange-50 text-orange-800 border-orange-200',
  delivering: 'bg-violet-50 text-violet-800 border-violet-200',
  delivered: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  cancelled: 'bg-rose-50 text-rose-800 border-rose-200',
  refunded: 'bg-stone-50 text-stone-600 border-stone-200',
  processing: 'bg-indigo-50 text-indigo-800 border-indigo-200',
  completed: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  failed: 'bg-rose-50 text-rose-800 border-rose-200',
};

interface StatusBadgeProps {
  status: OrderStatus | string;
  className?: string;
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const key = String(status).toLowerCase();
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider border',
        statusStyles[key] || 'bg-luxury-ivory text-luxury-steel border-luxury-border',
        className
      )}
    >
      {status}
    </span>
  );
}
