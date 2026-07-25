import React from 'react';
import { cn } from '../../lib/utils';

interface DividerProps {
  text?: string;
  className?: string;
}

export default function Divider({ text, className }: DividerProps) {
  if (!text) {
    return (
      <div className={cn('h-px bg-gradient-to-r from-transparent via-luxury-gold/40 to-transparent', className)} />
    );
  }

  return (
    <div className={cn('flex items-center gap-4', className)}>
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-luxury-gold/40" />
      <span className="text-xs font-display text-luxury-gold tracking-[0.2em] uppercase whitespace-nowrap">
        {text}
      </span>
      <div className="flex-1 h-px bg-gradient-to-l from-transparent via-luxury-gold/40" />
    </div>
  );
}
