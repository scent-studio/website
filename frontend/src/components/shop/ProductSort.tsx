import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'popular', label: 'Best Selling' },
];

interface ProductSortProps {
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  totalResults?: number;
}

export default function ProductSort({
  value = 'newest',
  onChange,
  className,
  totalResults,
}: ProductSortProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selected = sortOptions.find((o) => o.value === value) || sortOptions[0];

  return (
    <div className={cn('flex items-center justify-between', className)}>
      {totalResults !== undefined && (
        <p className="text-sm text-luxury-steel">
          <span className="text-luxury-charcoal">{totalResults}</span> products found
        </p>
      )}
      <div className="relative ml-auto">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2 text-sm text-luxury-charcoal/70 border border-luxury-border hover:border-luxury-gold/50 transition-colors rounded-lg"
        >
          Sort: {selected.label}
          <ChevronDown size={14} className={cn('transition-transform', isOpen && 'rotate-180')} />
        </button>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
            <div className="absolute right-0 top-full mt-1 w-56 bg-luxury-white border border-luxury-border shadow-card rounded-lg z-20">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onChange?.(option.value);
                    setIsOpen(false);
                  }}
                  className={cn(
                    'block w-full text-left px-5 py-3 text-sm transition-colors',
                    value === option.value
                      ? 'text-luxury-gold bg-luxury-gold/5 font-medium'
                      : 'text-luxury-charcoal/70 hover:text-luxury-gold hover:bg-luxury-gold/5'
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
