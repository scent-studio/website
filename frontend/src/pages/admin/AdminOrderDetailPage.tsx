import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Package, MapPin, CreditCard, User } from 'lucide-react';
import StatusBadge from '../../components/admin/StatusBadge';
import Button from '../../components/ui/Button';
import Loader from '../../components/ui/Loader';
import ErrorState from '../../components/ui/ErrorState';
import { orderService } from '../../services/orderService';
import type { Order, OrderStatus } from '../../types';
import { formatDate, formatPrice } from '../../lib/utils';
import toast from 'react-hot-toast';

export default function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    orderService.getOrder(id)
      .then((res) => setOrder(res.data))
      .catch((err) => setError(err?.response?.data?.message || 'Failed to load order'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleStatusUpdate = async (status: OrderStatus) => {
    if (!order) return;
    setUpdating(true);
    try {
      await orderService.adminUpdateOrderStatus(order._id, status);
      toast.success(`Order marked as ${status}`);
      setOrder({ ...order, status, orderStatus: status });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to update');
    } finally {
      setUpdating(false);
    }
  };

  const handlePaymentStatusUpdate = async (paymentStatus: string) => {
    if (!order) return;
    setUpdating(true);
    try {
      await orderService.adminUpdatePaymentStatus(order._id, paymentStatus);
      toast.success(`Payment marked as ${paymentStatus}`);
      setOrder({ ...order, paymentStatus: paymentStatus as any });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to update payment status');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <Loader size="lg" text="Loading order..." />;
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;
  if (!order) return <ErrorState title="Order not found" />;

  const statusActions: OrderStatus[] = [
    'pending',
    'confirmed',
    'packed',
    'shipped',
    'delivering',
    'delivered',
    'cancelled',
  ];
  const currentStatus = (order.status || order.orderStatus) as OrderStatus;
  const currentIdx = statusActions.indexOf(currentStatus);
  const nextActions = statusActions.slice(currentIdx + 1);

  return (
    <div>
      <Link to="/admin/orders" className="inline-flex items-center gap-1 text-sm text-luxury-gold hover:text-luxury-gold mb-6">
        <ArrowLeft size={14} /> Back to Orders
      </Link>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-serif text-luxury-charcoal tracking-wide">Order #{order._id.slice(-8).toUpperCase()}</h2>
          <p className="text-sm text-luxury-steel">{formatDate(order.createdAt)}</p>
        </div>
        <StatusBadge status={currentStatus} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-luxury-white border border-luxury-border rounded-lg p-5">
          <div className="flex items-center gap-2 text-luxury-gold mb-3">
            <User size={16} />
            <h4 className="text-sm font-medium text-luxury-charcoal">Customer</h4>
            {!order.user && (
              <span className="text-[10px] uppercase tracking-wider text-luxury-steel border border-luxury-border px-1.5 py-0.5">
                Guest
              </span>
            )}
          </div>
          <p className="text-sm text-luxury-charcoal">
            {(order.user as any)?.name || order.guestInfo?.name || order.shippingAddress?.name || 'Guest'}
          </p>
          <p className="text-sm text-luxury-steel">
            {(order.user as any)?.email || order.guestInfo?.email || 'N/A'}
          </p>
          <p className="text-sm text-luxury-steel">
            {(order.user as any)?.phone || order.guestInfo?.phone || order.shippingAddress?.phone || ''}
          </p>
        </div>
        <div className="bg-luxury-white border border-luxury-border rounded-lg p-5">
          <div className="flex items-center gap-2 text-luxury-gold mb-3"><MapPin size={16} /><h4 className="text-sm font-medium text-luxury-charcoal">Shipping</h4></div>
          <p className="text-sm text-luxury-charcoal">{order.shippingAddress.street}</p>
          <p className="text-sm text-luxury-steel">{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</p>
        </div>
        <div className="bg-luxury-white border border-luxury-border rounded-lg p-5">
          <div className="flex items-center gap-2 text-luxury-gold mb-3"><CreditCard size={16} /><h4 className="text-sm font-medium text-luxury-charcoal">Payment</h4></div>
          <p className="text-sm text-luxury-charcoal capitalize">{order.paymentMethod}</p>
          <div className="flex items-center gap-2 mt-1">
            <StatusBadge status={order.paymentStatus || 'pending'} />
          </div>
          <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-luxury-border">
            {['pending', 'completed', 'failed', 'refunded'].map((ps) => (
              <button
                key={ps}
                onClick={() => handlePaymentStatusUpdate(ps)}
                disabled={updating || order.paymentStatus === ps}
                className={`text-xs px-3 py-1.5 border transition-colors ${
                  order.paymentStatus === ps
                    ? 'bg-luxury-ink text-white border-luxury-ink'
                    : 'bg-luxury-white text-luxury-steel border-luxury-border hover:border-luxury-gold hover:text-luxury-gold'
                }`}
              >
                {ps.charAt(0).toUpperCase() + ps.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {nextActions.length > 0 && !['delivered', 'cancelled'].includes(currentStatus) && (
        <div className="flex items-center gap-3 mb-8 flex-wrap">
          <span className="text-sm text-luxury-steel">Update Status:</span>
          {nextActions.map((action) => (
            <Button
              key={action}
              variant={action === 'cancelled' ? 'danger' : 'secondary'}
              size="sm"
              onClick={() => handleStatusUpdate(action)}
              isLoading={updating}
            >
              {action.charAt(0).toUpperCase() + action.slice(1)}
            </Button>
          ))}
        </div>
      )}

      <div className="bg-luxury-white border border-luxury-border rounded-xl overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-luxury-border">
          <h3 className="text-sm font-serif text-luxury-charcoal tracking-wider uppercase">Order Items ({order.orderItems.length})</h3>
        </div>
        <div className="divide-y divide-luxury-border">
          {order.orderItems.map((item, idx) => (
            <div key={idx} className="flex items-center gap-4 px-5 py-4">
              <img src={item.image} alt={item.name} className="h-16 w-16 object-cover border border-luxury-border rounded-lg" />
              <div className="flex-1">
                <p className="text-sm text-luxury-charcoal">{item.name}</p>
                <p className="text-xs text-luxury-steel">Qty: {item.quantity}{item.size ? ` | ${item.size}` : ''}</p>
              </div>
              <p className="text-sm font-serif text-luxury-gold">{formatPrice(item.price * item.quantity)}</p>
            </div>
          ))}
        </div>
        <div className="px-5 py-4 border-t border-luxury-border space-y-1 text-sm bg-luxury-ivory/50">
          <div className="flex justify-between text-luxury-steel"><span>Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
          <div className="flex justify-between text-luxury-steel"><span>Shipping</span><span>{order.shippingCost === 0 ? 'Free' : formatPrice(order.shippingCost)}</span></div>
          <div className="flex justify-between text-luxury-steel"><span>Tax</span><span>{formatPrice(order.tax)}</span></div>
          {order.discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-{formatPrice(order.discount)}</span></div>}
          <div className="h-px bg-gradient-to-r from-transparent via-luxury-gold/20 to-transparent my-2" />
          <div className="flex justify-between text-lg font-serif text-luxury-gold"><span>Total</span><span>{formatPrice(order.total)}</span></div>
        </div>
      </div>
    </div>
  );
}
