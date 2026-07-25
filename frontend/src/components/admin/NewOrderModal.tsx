import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X } from 'lucide-react';
import Button from '../ui/Button';
import { formatPrice } from '../../lib/utils';
import { getAdminSocket } from '../../lib/socket';

interface NewOrderData {
  _id: string;
  customerName: string;
  total: number;
  createdAt: string;
}

const seenOrders = new Set<string>();

export default function NewOrderModal() {
  const navigate = useNavigate();
  const [order, setOrder] = useState<NewOrderData | null>(null);

  useEffect(() => {
    const socket = getAdminSocket();

    const handleNewOrder = (data: NewOrderData) => {
      if (seenOrders.has(data._id)) return;
      seenOrders.add(data._id);
      setOrder(data);

      try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 880;
        gain.gain.value = 0.15;
        osc.start();
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
        osc.stop(ctx.currentTime + 0.5);
      } catch {}
    };

    socket.on('newOrder', handleNewOrder);
    return () => { socket.off('newOrder', handleNewOrder); };
  }, []);

  return (
    <AnimatePresence>
      {order && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="bg-luxury-white rounded-2xl shadow-2xl border border-luxury-border w-full max-w-md overflow-hidden"
          >
            <div className="bg-luxury-ink px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-luxury-gold/20 flex items-center justify-center">
                  <ShoppingBag size={20} className="text-luxury-gold" />
                </div>
                <div>
                  <h3 className="text-white font-serif text-lg">New Order Received!</h3>
                  <p className="text-white/60 text-xs">Just now</p>
                </div>
              </div>
              <button
                onClick={() => setOrder(null)}
                className="text-white/60 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-luxury-steel">Order ID</span>
                  <span className="text-luxury-charcoal font-mono">#{order._id.slice(-8).toUpperCase()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-luxury-steel">Customer</span>
                  <span className="text-luxury-charcoal font-medium">{order.customerName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-luxury-steel">Total</span>
                  <span className="text-luxury-gold font-serif text-lg">{formatPrice(order.total)}</span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  variant="primary"
                  size="md"
                  className="flex-1"
                  onClick={() => { setOrder(null); navigate(`/admin/orders/${order._id}`); }}
                >
                  View Order
                </Button>
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => setOrder(null)}
                >
                  Dismiss
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
