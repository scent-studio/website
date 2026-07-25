import React from 'react';
import { cn } from '../../lib/utils';
import { formatPrice, calculateDiscount } from '../../lib/utils';

interface PriceProps {
  price: number;
  originalPrice?: number;
  currency?: string;
  size?: 'sm' | 'md' | 'lg';
  showDiscount?: boolean;
  className?: string;
}

const sizeMap = {
  sm: { current: 'text-base', original: 'text-xs', badge: 'text-[10px]' },
  md: { current: 'text-xl', original: 'text-sm', badge: 'text-xs' },
  lg: { current: 'text-2xl', original: 'text-base', badge: 'text-sm' },
};

export default function Price({
  price,
  originalPrice,
  currency = 'USD',
  size = 'md',
  showDiscount = true,
  className,
}: PriceProps) {
  const hasDiscount = originalPrice && originalPrice > price;
  const discount = hasDiscount ? calculateDiscount(originalPrice, price) : 0;

  return (
    <div className={cn('flex items-center gap-2 flex-wrap', className)}>
      <span className={cn('font-serif text-luxury-gold font-semibold', sizeMap[size].current)}>
        {formatPrice(price, currency)}
      </span>
      {hasDiscount && (
        <>
          <span className={cn('text-luxury-steel line-through', sizeMap[size].original)}>
            {formatPrice(originalPrice!, currency)}
          </span>
          {showDiscount && (
            <span
              className={cn(
                'px-2 py-0.5 bg-luxury-gold/15 text-luxury-gold border border-luxury-gold/20 font-medium',
                sizeMap[size].badge
              )}
            >
              -{discount}%
            </span>
          )}
        </>
      )}
    </div>
  );
}
