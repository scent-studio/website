import React from 'react';
import { AlertTriangle, Package } from 'lucide-react';
import { cn } from '../../lib/utils';

interface AlertItem {
  _id: string;
  name: string;
  slug: string;
  stock: number;
  lowStockThreshold: number;
  images: string[];
}

interface InventoryAlertsProps {
  items?: AlertItem[];
  className?: string;
}

export default function InventoryAlerts({ items = [], className }: InventoryAlertsProps) {
  return (
    <div className={cn('border border-luxury-border', className)}>
      <div className="px-5 py-4 border-b border-luxury-border">
        <h3 className="text-sm font-display text-luxury-champagne tracking-wider uppercase">Inventory Alerts</h3>
      </div>
      <div className="divide-y divide-white/5">
        {items.length > 0 ? items.map((item) => {
          const isOut = item.stock === 0;
          return (
            <div key={item._id} className="px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'h-8 w-8 flex items-center justify-center',
                    isOut ? 'bg-red-500/10 text-red-400' : 'bg-yellow-500/10 text-yellow-400'
                  )}
                >
                  {isOut ? <AlertTriangle size={14} /> : <Package size={14} />}
                </div>
                <div>
                  <p className="text-sm text-luxury-charcoal">{item.name}</p>
                  <p className={cn(
                    'text-xs',
                    isOut ? 'text-red-400' : 'text-yellow-400'
                  )}>
                    {isOut ? 'Out of Stock' : `Only ${item.stock} left`}
                  </p>
                </div>
              </div>
              <span className={cn(
                'text-xs font-medium px-2 py-1',
                isOut ? 'bg-red-500/10 text-red-400' : 'bg-yellow-500/10 text-yellow-400'
              )}>
                {item.stock}
              </span>
            </div>
          );
        }) : (
          <div className="px-5 py-8 text-center text-sm text-luxury-steel">
            All products are well stocked
          </div>
        )}
      </div>
    </div>
  );
}
