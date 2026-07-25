import React from 'react';
import { AlertTriangle, Package } from 'lucide-react';
import { cn } from '../../lib/utils';

interface AlertItem {
  id: string;
  name: string;
  stock: number;
  type: 'low' | 'out';
}

interface InventoryAlertsProps {
  items?: AlertItem[];
  className?: string;
}

const defaultItems: AlertItem[] = [
  { id: '1', name: 'Midnight Oud - 100ml', stock: 2, type: 'low' },
  { id: '2', name: 'Rose Velvet - 50ml', stock: 0, type: 'out' },
  { id: '3', name: 'Amber Nights - 30ml', stock: 3, type: 'low' },
  { id: '4', name: 'Oud Royale - 100ml', stock: 0, type: 'out' },
  { id: '5', name: 'Sandalwood Dream - 50ml', stock: 1, type: 'low' },
];

export default function InventoryAlerts({ items = defaultItems, className }: InventoryAlertsProps) {
  return (
    <div className={cn('border border-luxury-border', className)}>
      <div className="px-5 py-4 border-b border-luxury-border">
        <h3 className="text-sm font-display text-luxury-champagne tracking-wider uppercase">Inventory Alerts</h3>
      </div>
      <div className="divide-y divide-white/5">
        {items.map((item) => (
          <div key={item.id} className="px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'h-8 w-8 flex items-center justify-center',
                  item.type === 'out' ? 'bg-red-500/10 text-red-400' : 'bg-yellow-500/10 text-yellow-400'
                )}
              >
                {item.type === 'out' ? <AlertTriangle size={14} /> : <Package size={14} />}
              </div>
              <div>
                <p className="text-sm text-luxury-charcoal">{item.name}</p>
                <p className={cn(
                  'text-xs',
                  item.type === 'out' ? 'text-red-400' : 'text-yellow-400'
                )}>
                  {item.type === 'out' ? 'Out of Stock' : `Only ${item.stock} left`}
                </p>
              </div>
            </div>
            <span className={cn(
              'text-xs font-medium px-2 py-1',
              item.type === 'out' ? 'bg-red-500/10 text-red-400' : 'bg-yellow-500/10 text-yellow-400'
            )}>
              {item.stock}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
