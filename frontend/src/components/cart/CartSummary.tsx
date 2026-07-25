import React, { useState } from 'react';
import { cn, formatPrice } from '../../lib/utils';
import Button from '../ui/Button';

interface CartSummaryProps {
  subtotal?: number;
  shipping?: number;
  tax?: number;
  discount?: number;
  couponCode?: string;
  className?: string;
}

export default function CartSummary({
  subtotal = 485,
  shipping = 0,
  tax = 48.50,
  discount = 0,
  couponCode,
  className,
}: CartSummaryProps) {
  const [couponInput, setCouponInput] = useState(couponCode || '');
  const total = subtotal + shipping + tax - discount;

  return (
    <div className={cn('bg-luxury-white border border-luxury-border rounded-xl shadow-card p-6 space-y-4', className)}>
      <h3 className="text-lg font-serif text-luxury-charcoal">Order Summary</h3>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-luxury-steel">Subtotal</span>
          <span className="text-luxury-charcoal">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-luxury-steel">Shipping</span>
          <span className={shipping === 0 ? 'text-luxury-gold-dark' : 'text-luxury-charcoal'}>
            {shipping === 0 ? 'Free' : formatPrice(shipping)}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-luxury-steel">Tax</span>
          <span className="text-luxury-charcoal">{formatPrice(tax)}</span>
        </div>
        {discount > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-luxury-gold-dark">Discount</span>
            <span className="text-luxury-gold-dark">-{formatPrice(discount)}</span>
          </div>
        )}
        <div className="h-px bg-gradient-to-r from-transparent via-luxury-gold/20 to-transparent" />
        <div className="flex items-center justify-between">
          <span className="text-base font-medium text-luxury-charcoal">Total</span>
          <span className="text-xl font-serif text-luxury-gold">{formatPrice(total)}</span>
        </div>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={couponInput}
          onChange={(e) => setCouponInput(e.target.value)}
          placeholder="Coupon code"
          className="flex-1 px-4 py-2.5 bg-luxury-white border border-luxury-border text-luxury-charcoal placeholder:text-luxury-steel/40 text-sm outline-none focus:border-luxury-gold/50 transition-colors rounded-lg"
        />
        <Button variant="secondary" size="md" className="whitespace-nowrap">
          Apply
        </Button>
      </div>

      <Button variant="primary" size="lg" className="w-full">
        Proceed to Checkout
      </Button>
    </div>
  );
}
