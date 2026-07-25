import React, { useState } from 'react';
import { Star, StarHalf } from 'lucide-react';
import { cn } from '../../lib/utils';

interface RatingProps {
  value: number;
  onChange?: (value: number) => void;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  reviewCount?: number;
  className?: string;
}

const sizeMap = { sm: 14, md: 18, lg: 24 };

export default function Rating({
  value,
  onChange,
  size = 'md',
  showText,
  reviewCount,
  className,
}: RatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const isInteractive = !!onChange;
  const displayValue = hoverValue ?? value;

  const getStar = (index: number) => {
    const filled = displayValue >= index;
    const half = !filled && displayValue >= index - 0.5;

    if (half) {
      return <StarHalf key={index} size={sizeMap[size]} className="text-luxury-gold fill-luxury-gold" />;
    }
    return (
      <Star
        key={index}
        size={sizeMap[size]}
        className={cn(
          'transition-colors duration-150',
          filled ? 'text-luxury-gold fill-luxury-gold' : 'text-luxury-steel/30 fill-none'
        )}
      />
    );
  };

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div
        className={cn('flex items-center', isInteractive && 'cursor-pointer')}
        onMouseLeave={() => setHoverValue(null)}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            onClick={() => isInteractive && onChange?.(star)}
            onMouseEnter={() => isInteractive && setHoverValue(star)}
            className={cn(isInteractive && 'px-0.5')}
          >
            {getStar(star)}
          </span>
        ))}
      </div>
      {showText && (
        <span className="text-sm text-luxury-steel ml-2">
          {value.toFixed(1)}
          {reviewCount !== undefined && ` (${reviewCount})`}
        </span>
      )}
    </div>
  );
}
