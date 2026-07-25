import React from 'react';
import { cn } from '../../lib/utils';

const variantStyles = {
  gold: 'bg-luxury-gold/10 text-luxury-gold-dark border border-luxury-gold/20',
  charcoal: 'bg-luxury-ink/5 text-luxury-charcoal border border-luxury-ink/10',
  blue: 'bg-blue-50 text-blue-700 border border-blue-200',
  red: 'bg-luxury-red/10 text-luxury-red border border-luxury-red/20',
  green: 'bg-luxury-green/10 text-luxury-green border border-luxury-green/20',
  outline: 'bg-transparent text-luxury-charcoal border border-luxury-border',
};

const sizeStyles = {
  sm: 'px-2 py-0.5 text-[10px]',
  md: 'px-3 py-1 text-xs',
  lg: 'px-4 py-1.5 text-sm',
};

interface BadgeProps {
  variant?: keyof typeof variantStyles;
  size?: keyof typeof sizeStyles;
  className?: string;
  children: React.ReactNode;
}

export default function Badge({ variant = 'gold', size = 'md', className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium tracking-wide rounded-full',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {children}
    </span>
  );
}
