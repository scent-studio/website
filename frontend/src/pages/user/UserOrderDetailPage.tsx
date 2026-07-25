import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Package, MapPin, CreditCard } from 'lucide-react';
import OrderTimeline from '../../components/user/OrderTimeline';
import Loader from '../../components/ui/Loader';
import ErrorState from '../../components/ui/ErrorState';
import Badge from '../../components/ui/Badge';
import { orderService } from '../../services/orderService';
import type { Order } from '../../types';
import { formatDate, formatPrice } from '../../lib/utils';

export default function UserOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    orderService.getOrder(id)
      .then((res) => setOrder(res.data))
      .catch((err) => setError(err?.response?.data?.message || 'Failed to load order'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="flex items-center justify-center min-h-[40vh]"><Loader size="md" text="Loading order..." /></div>;
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;
  if (!order) return <ErrorState title="Order not found" />;

  const orderStatus = order.status || order.orderStatus || 'pending';

  return (
    <div>
      <Link to="/account/orders" className="inline-flex items-center gap-1 text-sm text-luxury-gold hover:text-luxury-gold-dark mb-6">
        <ArrowLeft size={14} /> Back to Orders
      </Link>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-serif text-luxury-charcoal">Order #{order._id.slice(-8).toUpperCase()}</h2>
          <p className="text-sm text-luxury-steel">Placed on {formatDate(order.createdAt)}</p>
        </div>
        <Badge variant="gold" size="lg">{orderStatus}</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <OrderTimeline currentStatus={orderStatus} />
        </div>
        <div className="space-y-4">
          <div className="bg-luxury-white rounded-xl shadow-card border border-luxury-border p-4">
            <div className="flex items-center gap-2 text-luxury-gold mb-3">
              <MapPin size={16} />
              <h4 className="text-sm font-medium text-luxury-charcoal">Shipping Address</h4>
            </div>
            <p className="text-sm text-luxury-charcoal">{order.shippingAddress.street}</p>
            <p className="text-sm text-luxury-steel">{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</p>
            <p className="text-sm text-luxury-steel">{order.shippingAddress.country}</p>
          </div>

          <div className="bg-luxury-white rounded-xl shadow-card border border-luxury-border p-4">
            <div className="flex items-center gap-2 text-luxury-gold mb-3">
              <CreditCard size={16} />
              <h4 className="text-sm font-medium text-luxury-charcoal">Payment</h4>
            </div>
            <p className="text-sm text-luxury-charcoal capitalize">{order.paymentMethod}</p>
            <p className="text-sm text-luxury-steel">Status: <span className="capitalize">{order.paymentStatus}</span></p>
          </div>
        </div>
      </div>

      <div className="bg-luxury-white rounded-xl shadow-card border border-luxury-border overflow-hidden">
        <div className="px-5 py-4 border-b border-luxury-border">
          <h3 className="text-sm font-serif text-luxury-charcoal tracking-wider uppercase">Order Items</h3>
        </div>
        <div className="divide-y divide-luxury-border">
          {order.orderItems.map((item, idx) => (
            <div key={idx} className="flex items-center gap-4 px-5 py-4">
              <img src={item.image} alt={item.name} className="h-16 w-16 object-cover rounded-lg border border-luxury-border" />
              <div className="flex-1">
                <p className="text-sm text-luxury-charcoal">{item.name}</p>
                <p className="text-xs text-luxury-steel">Qty: {item.quantity}{item.size ? ` | ${item.size}` : ''}</p>
              </div>
              <p className="text-sm font-serif text-luxury-gold">{formatPrice(item.price * item.quantity)}</p>
            </div>
          ))}
        </div>
        <div className="px-5 py-4 border-t border-luxury-border space-y-1 text-sm">
          <div className="flex justify-between text-luxury-steel"><span>Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
          <div className="flex justify-between text-luxury-steel"><span>Shipping</span><span>{order.shippingCost === 0 ? 'Free' : formatPrice(order.shippingCost)}</span></div>
          <div className="flex justify-between text-luxury-steel"><span>Tax</span><span>{formatPrice(order.tax)}</span></div>
          {order.discount > 0 && <div className="flex justify-between text-luxury-green"><span>Discount</span><span>-{formatPrice(order.discount)}</span></div>}
          <div className="h-px bg-gradient-to-r from-transparent via-luxury-gold/30 to-transparent my-2" />
          <div className="flex justify-between text-lg font-serif text-luxury-gold"><span>Total</span><span>{formatPrice(order.total)}</span></div>
        </div>
      </div>

      {order.trackingNumber && (
        <div className="mt-4 bg-luxury-white rounded-xl shadow-card border border-luxury-border p-4">
          <p className="text-sm text-luxury-steel">Tracking Number: <span className="text-luxury-charcoal font-medium">{order.trackingNumber}</span></p>
        </div>
      )}
    </div>
  );
}
