import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';

interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onSearch?: (query: string) => void;
  searchPlaceholder?: string;
  isLoading?: boolean;
  className?: string;
}

export default function DataTable<T extends Record<string, any>>({
  columns,
  data,
  page = 1,
  totalPages = 1,
  onPageChange,
  onSearch,
  searchPlaceholder = 'Search...',
  isLoading,
  className,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  return (
    <div className={cn('border border-luxury-border rounded-xl overflow-hidden bg-luxury-white shadow-sm', className)}>
      {onSearch && (
        <div className="p-4 border-b border-luxury-border">
          <div className="relative max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-luxury-steel" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              onChange={(e) => onSearch(e.target.value)}
              className="w-full pl-10 pr-3 py-2 bg-luxury-ivory border border-luxury-border text-luxury-charcoal text-sm outline-none focus:border-luxury-gold/50 transition-colors rounded-lg placeholder:text-luxury-steel/40"
            />
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-luxury-border bg-luxury-ivory/50">
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && handleSort(col.key)}
                  className={cn(
                    'px-4 py-3 text-left text-xs font-serif text-luxury-steel uppercase tracking-wider',
                    col.sortable && 'cursor-pointer hover:text-luxury-gold transition-colors'
                  )}
                >
                  {col.label}
                  {sortKey === col.key && (
                    <span className="ml-1">{sortDir === 'asc' ? '\u2191' : '\u2193'}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-luxury-border">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3">
                      <div className="h-4 bg-luxury-ivory animate-pulse rounded" style={{ width: `${60 + Math.random() * 30}%` }} />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center text-sm text-luxury-steel">
                  No data found.
                </td>
              </tr>
            ) : (
              data.map((row, idx) => (
                <tr key={idx} className="hover:bg-luxury-ivory transition-colors">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 text-sm text-luxury-charcoal/80">
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-luxury-border bg-luxury-ivory/30">
          <p className="text-xs text-luxury-steel">
            Page {page} of {totalPages}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange?.(page - 1)}
              disabled={page <= 1}
              className="h-8 w-8 flex items-center justify-center border border-luxury-border text-luxury-steel hover:text-luxury-gold hover:border-luxury-gold/30 disabled:opacity-30 transition-colors rounded-lg"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              onClick={() => onPageChange?.(page + 1)}
              disabled={page >= totalPages}
              className="h-8 w-8 flex items-center justify-center border border-luxury-border text-luxury-steel hover:text-luxury-gold hover:border-luxury-gold/30 disabled:opacity-30 transition-colors rounded-lg"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
