import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, Heart, User, Clock, ChevronRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../../store';
import { fetchWishlist } from '../../store/slices/wishlistSlice';
import { orderService } from '../../services/orderService';
import type { Order } from '../../types';
import Loader from '../../components/ui/Loader';
import { formatDate, formatPrice } from '../../lib/utils';
import Badge from '../../components/ui/Badge';

export default function UserDashboardHome() {
  const { user } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const { items } = useSelector((state: RootState) => state.wishlist);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(fetchWishlist());
    orderService.getOrders({ limit: 5 })
      .then((res) => setRecentOrders(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [dispatch]);

  const stats = [
    { label: 'Orders', value: recentOrders.length, icon: Package, link: '/account/orders', color: 'text-luxury-gold' },
    { label: 'Wishlist', value: items.length, icon: Heart, link: '/account/wishlist', color: 'text-luxury-gold' },
    { label: 'Profile', value: 'Complete', icon: User, link: '/account/profile', color: 'text-luxury-gold' },
  ];

  return (
    <div>
      <h2 className="text-lg font-serif text-luxury-charcoal mb-6">Welcome back, {user?.name?.split(' ')[0] || 'Valued Customer'}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {stats.map((stat, idx) => (
          <Link key={stat.label} to={stat.link}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-luxury-white rounded-xl shadow-card border border-luxury-border p-5 hover:border-luxury-gold/40 transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 flex items-center justify-center bg-luxury-gold/10 border border-luxury-gold/20 rounded-lg text-luxury-gold">
                  <stat.icon size={18} />
                </div>
                <div>
                  <p className="text-xl font-serif text-luxury-charcoal">{stat.value}</p>
                  <p className="text-xs text-luxury-steel">{stat.label}</p>
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

      <div className="bg-luxury-white rounded-xl shadow-card border border-luxury-border overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-luxury-border">
          <h3 className="text-sm font-serif text-luxury-charcoal tracking-wider uppercase">Recent Orders</h3>
          <Link to="/account/orders" className="text-xs text-luxury-gold hover:text-luxury-gold-dark flex items-center gap-1">
            View All <ChevronRight size={12} />
          </Link>
        </div>
        {loading ? (
          <div className="p-8"><Loader size="sm" /></div>
        ) : recentOrders.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm text-luxury-steel mb-3">No orders yet</p>
            <Link to="/shop" className="text-sm text-luxury-gold hover:text-luxury-gold-dark">Start Shopping</Link>
          </div>
        ) : (
          <div className="divide-y divide-luxury-border">
            {recentOrders.map((order) => (
              <Link key={order._id} to={`/account/order/${order._id}`} className="flex items-center justify-between px-5 py-4 hover:bg-luxury-cream transition-colors">
                <div className="flex items-center gap-3">
                  <Package size={16} className="text-luxury-gold" />
                  <div>
                    <p className="text-sm text-luxury-charcoal">Order #{order._id.slice(-8).toUpperCase()}</p>
                    <p className="text-xs text-luxury-steel">{formatDate(order.createdAt)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-serif text-luxury-gold">{formatPrice(order.total)}</p>
                  <Badge variant="gold" size="sm">{order.orderStatus}</Badge>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
