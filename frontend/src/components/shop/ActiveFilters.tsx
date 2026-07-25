import React from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ActiveFilter {
  id: string;
  label: string;
  section: string;
}

interface ActiveFiltersProps {
  filters?: ActiveFilter[];
  onRemove?: (filter: ActiveFilter) => void;
  onClearAll?: () => void;
  className?: string;
}

const defaultFilters: ActiveFilter[] = [
  { id: 'women', label: 'Women', section: 'gender' },
  { id: 'maison-luxe', label: 'Maison Luxe', section: 'brand' },
];

export default function ActiveFilters({
  filters = defaultFilters,
  onRemove,
  onClearAll,
  className,
}: ActiveFiltersProps) {
  if (filters.length === 0) return null;

  return (
    <div className={cn('flex items-center flex-wrap gap-2', className)}>
      <span className="text-xs text-luxury-steel mr-1">Active Filters:</span>
      {filters.map((filter) => (
        <span
          key={filter.id}
          className="inline-flex items-center gap-1.5 px-3 py-1 text-xs bg-luxury-gold/10 text-luxury-gold border border-luxury-gold/20 rounded-full"
        >
          {filter.label}
          <button
            onClick={() => onRemove?.(filter)}
            className="hover:text-luxury-gold-light transition-colors"
          >
            <X size={12} />
          </button>
        </span>
      ))}
      {filters.length > 1 && (
        <button
          onClick={onClearAll}
          className="text-xs text-luxury-steel hover:text-luxury-gold transition-colors ml-1"
        >
          Clear All
        </button>
      )}
    </div>
  );
}
