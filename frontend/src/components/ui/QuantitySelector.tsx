import React from 'react';
import { Minus, Plus } from 'lucide-react';
import { cn } from '../../lib/utils';

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = { sm: 'h-8', md: 'h-10', lg: 'h-12' };
const btnSizeMap = { sm: 'h-8 w-8', md: 'h-10 w-10', lg: 'h-12 w-12' };
const textSizeMap = { sm: 'text-sm', md: 'text-base', lg: 'text-lg' };

export default function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99,
  size = 'md',
  className,
}: QuantitySelectorProps) {
  const handleDecrement = () => {
    if (value > min) onChange(value - 1);
  };

  const handleIncrement = () => {
    if (value < max) onChange(value + 1);
  };

  const btnBase =
    'flex items-center justify-center border border-luxury-gold/30 text-luxury-gold transition-all duration-200 hover:bg-luxury-gold/10 hover:border-luxury-gold disabled:opacity-30 disabled:cursor-not-allowed rounded-none';

  return (
    <div className={cn('inline-flex items-center border border-luxury-border rounded-lg overflow-hidden', sizeMap[size], className)}>
      <button
        onClick={handleDecrement}
        disabled={value <= min}
        className={cn(btnBase, btnSizeMap[size], 'border-r border-luxury-border')}
      >
        <Minus size={size === 'sm' ? 12 : size === 'md' ? 14 : 16} />
      </button>
      <span
        className={cn(
          'flex items-center justify-center px-4 font-medium text-luxury-charcoal bg-luxury-white',
          textSizeMap[size]
        )}
      >
        {value}
      </span>
      <button
        onClick={handleIncrement}
        disabled={value >= max}
        className={cn(btnBase, btnSizeMap[size], 'border-l border-luxury-border')}
      >
        <Plus size={size === 'sm' ? 12 : size === 'md' ? 14 : 16} />
      </button>
    </div>
  );
}
