import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    const delta = 1;
    const rangeStart = Math.max(2, currentPage - delta);
    const rangeEnd = Math.min(totalPages - 1, currentPage + delta);

    pages.push(1);
    if (rangeStart > 2) pages.push('ellipsis');
    for (let i = rangeStart; i <= rangeEnd; i++) pages.push(i);
    if (rangeEnd < totalPages - 1) pages.push('ellipsis');
    if (totalPages > 1) pages.push(totalPages);

    return pages;
  };

  const buttonBase =
    'flex items-center justify-center h-10 w-10 text-sm font-medium transition-all duration-200 border rounded-lg';
  const activeStyle = 'bg-luxury-gold text-white border-luxury-gold shadow-elegant';
  const inactiveStyle = 'bg-luxury-white text-luxury-steel border-luxury-border hover:border-luxury-gold/50 hover:text-luxury-gold';

  return (
    <nav className={cn('flex items-center justify-center gap-1', className)}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className={cn(buttonBase, inactiveStyle, 'disabled:opacity-30 disabled:cursor-not-allowed')}
      >
        <ChevronLeft size={16} />
      </button>

      {getPageNumbers().map((page, idx) =>
        page === 'ellipsis' ? (
          <span key={`ellipsis-${idx}`} className="px-2 text-luxury-steel">
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={cn(buttonBase, page === currentPage ? activeStyle : inactiveStyle)}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className={cn(buttonBase, inactiveStyle, 'disabled:opacity-30 disabled:cursor-not-allowed')}
      >
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}
