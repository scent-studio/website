import React from 'react';
import { Link } from 'react-router-dom';
import { cn, formatPrice, formatDate } from '../../lib/utils';
import StatusBadge from './StatusBadge';

interface Order {
  _id: string;
  user?: { name: string };
  total: number;
  orderStatus: string;
  createdAt: string;
  items: Array<{ name: string }>;
}

interface RecentOrdersProps {
  orders?: Order[];
  className?: string;
}

const defaultOrders: Order[] = [
  { _id: 'ORD-001', user: { name: 'Isabella R.' }, total: 245, orderStatus: 'delivered', createdAt: new Date().toISOString(), items: [{ name: 'Rose Velvet' }] },
  { _id: 'ORD-002', user: { name: 'James M.' }, total: 185, orderStatus: 'shipped', createdAt: new Date(Date.now() - 86400000).toISOString(), items: [{ name: 'Midnight Oud' }] },
  { _id: 'ORD-003', user: { name: 'Sophie L.' }, total: 430, orderStatus: 'processing', createdAt: new Date(Date.now() - 172800000).toISOString(), items: [{ name: 'Amber Nights' }, { name: 'Rose Velvet' }] },
  { _id: 'ORD-004', user: { name: 'Alexander K.' }, total: 320, orderStatus: 'pending', createdAt: new Date(Date.now() - 259200000).toISOString(), items: [{ name: 'Oud Royale' }] },
  { _id: 'ORD-005', user: { name: 'Emma W.' }, total: 145, orderStatus: 'cancelled', createdAt: new Date(Date.now() - 345600000).toISOString() as any, items: [{ name: 'Vanilla Bourbon' }] },
];

export default function RecentOrders({ orders = defaultOrders, className }: RecentOrdersProps) {
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
            {orders.map((order) => (
              <tr key={order._id} className="hover:bg-luxury-ink/20 transition-colors">
                <td className="px-4 py-3">
                  <Link to={`/admin/orders/${order._id}`} className="text-sm text-luxury-gold hover:text-luxury-gold-light transition-colors">
                    #{order._id}
                  </Link>
                </td>
                <td className="px-4 py-3 text-sm text-luxury-charcoal">{order.user?.name}</td>
                <td className="px-4 py-3 text-sm text-luxury-steel">{order.items.length} item(s)</td>
                <td className="px-4 py-3 text-sm font-serif text-luxury-gold">{formatPrice(order.total)}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={order.orderStatus} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
