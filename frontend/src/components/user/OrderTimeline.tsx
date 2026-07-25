import React from 'react';
import { cn } from '../../lib/utils';
import { Package, CheckCircle, Truck, Clock, XCircle } from 'lucide-react';

const statusConfig: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  pending: { label: 'Order Placed', icon: Clock, color: 'text-luxury-gold' },
  confirmed: { label: 'Order Confirmed', icon: CheckCircle, color: 'text-luxury-gold' },
  processing: { label: 'Processing', icon: Package, color: 'text-luxury-gold' },
  shipped: { label: 'Shipped', icon: Truck, color: 'text-luxury-gold' },
  delivered: { label: 'Delivered', icon: CheckCircle, color: 'text-green-400' },
  cancelled: { label: 'Cancelled', icon: XCircle, color: 'text-red-400' },
};

const steps = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];

interface OrderTimelineProps {
  currentStatus: string;
  className?: string;
}

export default function OrderTimeline({ currentStatus, className }: OrderTimelineProps) {
  const currentIndex = steps.indexOf(currentStatus);
  const isCancelled = currentStatus === 'cancelled';

  return (
    <div className={cn('', className)}>
      <div className="relative">
        {steps.map((step, idx) => {
          const config = statusConfig[step];
          const Icon = config.icon;
          const isActive = idx <= currentIndex && !isCancelled;
          const isCurrent = idx === currentIndex;
          const isCompleted = idx < currentIndex;

          return (
            <div key={step} className="flex items-start gap-4 pb-8 last:pb-0 relative">
              {idx < steps.length - 1 && (
                <div
                  className={cn(
                    'absolute left-[15px] top-8 w-px h-full',
                    isCompleted ? 'bg-luxury-gold/40' : 'bg-luxury-border'
                  )}
                />
              )}
              <div
                className={cn(
                  'relative z-10 h-8 w-8 flex items-center justify-center border-2 transition-all duration-300 flex-shrink-0',
                  isActive
                    ? 'border-luxury-gold bg-luxury-gold/10 text-luxury-gold'
                    : 'border-luxury-border text-luxury-steel',
                  isCurrent ? 'animate-glow' : ''
                )}
              >
                <Icon size={14} />
              </div>
              <div className="pt-1">
                <p
                  className={cn(
                    'text-sm font-medium transition-colors',
                    isActive ? 'text-luxury-charcoal' : 'text-luxury-steel/50'
                  )}
                >
                  {config.label}
                </p>
                {isCurrent && !isCancelled && (
                  <p className="text-xs text-luxury-gold mt-0.5">Current</p>
                )}
              </div>
            </div>
          );
        })}

        {isCancelled && (
          <div className="flex items-start gap-4">
            <div className="z-10 h-8 w-8 flex items-center justify-center border-2 border-red-400/50 bg-red-400/10 text-red-400 flex-shrink-0">
              <XCircle size={14} />
            </div>
            <div className="pt-1">
              <p className="text-sm font-medium text-red-400">
                {statusConfig.cancelled.label}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
