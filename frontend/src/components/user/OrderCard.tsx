import React from 'react';
import { motion } from 'framer-motion';
import { Package, ChevronRight } from 'lucide-react';
import { formatPrice, formatDate } from '../../lib/utils';
import Badge from '../ui/Badge';
import type { Order, OrderItem } from '../../types';

interface OrderCardProps {
  order: Order | {
    _id: string;
    items?: Array<{ name: string; quantity: number; image: string }>;
    orderItems?: OrderItem[];
    total: number;
    orderStatus?: string;
    status?: string;
    createdAt: string;
    trackingNumber?: string;
  };
  onView?: (id: string) => void;
}

const statusColors: Record<string, 'gold' | 'green' | 'blue' | 'red' | 'charcoal'> = {
  pending: 'gold',
  confirmed: 'blue',
  packed: 'blue',
  shipped: 'gold',
  delivering: 'blue',
  delivered: 'green',
  cancelled: 'red',
  refunded: 'charcoal',
  processing: 'blue',
};

export default function OrderCard({ order, onView }: OrderCardProps) {
  const status = (order as any).status || (order as any).orderStatus || 'pending';
  const items: Array<{ name: string; quantity: number; image: string }> =
    (order as any).orderItems || (order as any).items || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-luxury-white border border-luxury-border p-5 hover:shadow-card-hover transition-all duration-300"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Package size={20} className="text-luxury-gold-dark" />
          <div>
            <p className="text-sm font-medium text-luxury-charcoal">
              Order #{order._id.slice(-8).toUpperCase()}
            </p>
            <p className="text-xs text-luxury-steel mt-0.5">{formatDate(order.createdAt)}</p>
          </div>
        </div>
        <Badge variant={statusColors[status] || 'gold'} size="sm">
          {status}
        </Badge>
      </div>

      <div className="mt-4 flex items-center gap-3">
        {items.slice(0, 3).map((item, idx) => (
          <div key={idx} className="h-14 w-14 flex-shrink-0 overflow-hidden border border-luxury-border">
            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
          </div>
        ))}
        {items.length > 3 && (
          <span className="text-xs text-luxury-steel">+{items.length - 3} more</span>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-lg font-serif text-luxury-charcoal">{formatPrice(order.total)}</span>
        <button
          type="button"
          onClick={() => onView?.(order._id)}
          className="flex items-center gap-1 text-sm text-luxury-charcoal hover:text-luxury-gold-dark transition-colors"
        >
          View Details <ChevronRight size={14} />
        </button>
      </div>
    </motion.div>
  );
}
