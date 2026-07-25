import React from 'react';
import { Link } from 'react-router-dom';
import { cn, formatPrice, formatDate } from '../../lib/utils';
import StatusBadge from './StatusBadge';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  image: string;
}

interface Order {
  _id: string;
  user?: { name: string; email: string };
  guestInfo?: { name: string; email?: string; phone?: string };
  orderItems: OrderItem[];
  total: number;
  status: string;
  orderStatus: string;
  createdAt: string;
  isGuestOrder: boolean;
}

interface RecentOrdersProps {
  orders?: Order[];
  className?: string;
}

export default function RecentOrders({ orders = [], className }: RecentOrdersProps) {
  return (
    <div className={cn('border border-luxury-border', className)}>
      <div className="flex items-center justify-between px-5 py-4 border-b border-luxury-border">
        <h3 className="text-sm font-display text-luxury-champagne tracking-wider uppercase">Recent Orders</h3>
        <Link to="/admin/orders" className="text-xs text-luxury-gold hover:text-luxury-gold-light transition-colors">
          View All
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-luxury-border">
              <th className="px-4 py-3 text-left text-xs text-luxury-steel font-medium">Order</th>
              <th className="px-4 py-3 text-left text-xs text-luxury-steel font-medium">Customer</th>
              <th className="px-4 py-3 text-left text-xs text-luxury-steel font-medium">Items</th>
              <th className="px-4 py-3 text-left text-xs text-luxury-steel font-medium">Total</th>
              <th className="px-4 py-3 text-left text-xs text-luxury-steel font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {orders.length > 0 ? orders.map((order) => {
              const customerName = order.user?.name || order.guestInfo?.name || 'Guest';
              return (
                <tr key={order._id} className="hover:bg-luxury-ink/20 transition-colors">
                  <td className="px-4 py-3">
                    <Link to={`/admin/orders/${order._id}`} className="text-sm text-luxury-gold hover:text-luxury-gold-light transition-colors">
                      #{order._id.slice(-6).toUpperCase()}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm text-luxury-charcoal">{customerName}</td>
                  <td className="px-4 py-3 text-sm text-luxury-steel">{order.orderItems.length} item(s)</td>
                  <td className="px-4 py-3 text-sm font-serif text-luxury-gold">{formatPrice(order.total)}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={order.orderStatus || order.status} />
                  </td>
                </tr>
              );
            }) : (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-luxury-steel">
                  No orders yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
