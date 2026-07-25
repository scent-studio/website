import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Package, ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';
import { orderService } from '../services/orderService';
import type { Order, OrderStatus } from '../types';
import Loader from '../components/ui/Loader';
import { formatDate, formatPrice, cn } from '../lib/utils';

const STATUS_STEPS: { key: OrderStatus; label: string }[] = [
  { key: 'pending', label: 'Pending' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'packed', label: 'Packed' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'delivering', label: 'Out for Delivery' },
  { key: 'delivered', label: 'Delivered' },
];

const STATUS_ORDER: OrderStatus[] = ['pending', 'confirmed', 'packed', 'shipped', 'delivering', 'delivered'];

function getStepIndex(status: OrderStatus | undefined): number {
  if (!status) return 0;
  const idx = STATUS_ORDER.indexOf(status);
  return idx >= 0 ? idx : 0;
}

export default function OrderSuccessPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    orderService.getOrder(id)
      .then((res) => setOrder(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!id) return;
    const interval = setInterval(() => {
      orderService.getOrder(id)
        .then((res) => setOrder(res.data))
        .catch(() => {});
    }, 10000);
    return () => clearInterval(interval);
  }, [id]);

  const isGuest = !!order?.isGuestOrder || (!!order && !order.user);
  const customerEmail =
    (typeof order?.user === 'object' && order?.user?.email) || order?.guestInfo?.email || '';

  const currentStatus = (order?.status || order?.orderStatus || 'pending') as OrderStatus;
  const currentStep = getStepIndex(currentStatus);
  const isCancelled = currentStatus === 'cancelled';
  const isRefunded = currentStatus === 'refunded';

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-luxury-cream px-4 py-16">
      <div className="max-w-lg mx-auto text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
          className="inline-flex items-center justify-center h-24 w-24 bg-luxury-gold/10 border border-luxury-gold/30 rounded-full mb-8"
        >
          <CheckCircle size={48} className="text-luxury-gold" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-serif text-luxury-charcoal tracking-wider uppercase"
        >
          Order Confirmed!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-4 text-luxury-steel"
        >
          Thank you for your purchase. Your order has been placed successfully.
        </motion.p>

        {loading ? (
          <div className="mt-8"><Loader size="sm" /></div>
        ) : order ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 p-6 bg-luxury-white border border-luxury-border rounded-xl shadow-card"
          >
            <div className="flex items-center justify-center gap-2 text-luxury-gold mb-4">
              <Package size={20} />
              <span className="text-lg font-serif">Order #{order._id.slice(-8).toUpperCase()}</span>
            </div>
            <p className="text-sm text-luxury-steel">{formatDate(order.createdAt)}</p>
            <p className="text-lg font-serif text-luxury-gold mt-2">{formatPrice(order.total)}</p>
            <p className="text-xs text-luxury-steel mt-1">
              A confirmation email has been sent to {customerEmail || 'your email'}.
            </p>

            {isCancelled ? (
              <div className="mt-5 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm font-medium text-red-700">This order has been cancelled.</p>
              </div>
            ) : isRefunded ? (
              <div className="mt-5 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm font-medium text-blue-700">This order has been refunded.</p>
              </div>
            ) : (
              <div className="mt-6 pt-5 border-t border-luxury-border">
                <p className="text-xs font-medium text-luxury-charcoal uppercase tracking-wider mb-4">Order Status</p>
                <div className="flex items-center justify-between relative">
                  <div className="absolute top-3 left-0 right-0 h-0.5 bg-luxury-border" />
                  <div className="absolute top-3 left-0 h-0.5 bg-luxury-gold transition-all duration-500" style={{ width: `${(currentStep / (STATUS_STEPS.length - 1)) * 100}%` }} />
                  {STATUS_STEPS.map((s, idx) => {
                    const isActive = idx <= currentStep;
                    const isCurrent = idx === currentStep;
                    return (
                      <div key={s.key} className="relative z-10 flex flex-col items-center">
                        <div className={cn(
                          'h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-medium border-2 transition-colors',
                          isCurrent ? 'bg-luxury-gold border-luxury-gold text-white' :
                          isActive ? 'bg-luxury-ink border-luxury-ink text-white' :
                          'bg-luxury-white border-luxury-border text-luxury-steel'
                        )}>
                          {isActive ? <CheckCircle size={12} /> : idx + 1}
                        </div>
                        <span className={cn(
                          'mt-2 text-[10px] tracking-wide whitespace-nowrap',
                          isCurrent ? 'text-luxury-gold font-medium' :
                          isActive ? 'text-luxury-charcoal' : 'text-luxury-steel'
                        )}>
                          {s.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {isGuest && (
              <p className="text-xs text-luxury-steel mt-4 border-t border-luxury-border pt-3">
                Save this page to track your order. Create an account to keep all your orders in one place.
              </p>
            )}
          </motion.div>
        ) : null}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link to="/shop">
            <Button variant="primary" size="lg">
              Continue Shopping
            </Button>
          </Link>
          <Link to={isGuest ? '/register' : '/account/orders'}>
            <Button variant="outline" size="lg">
              {isGuest ? 'Create Account' : 'View Orders'}
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
