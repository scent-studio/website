import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, ShoppingCart, Users, Package } from 'lucide-react';
import StatsCard from '../../components/admin/StatsCard';
import SalesChart from '../../components/admin/SalesChart';
import OrdersChart from '../../components/admin/OrdersChart';
import RecentOrders from '../../components/admin/RecentOrders';
import TopProducts from '../../components/admin/TopProducts';
import LatestReviews from '../../components/admin/LatestReviews';
import InventoryAlerts from '../../components/admin/InventoryAlerts';
import { analyticsService } from '../../services/analyticsService';
import type { AnalyticsData } from '../../services/analyticsService';
import { formatPrice } from '../../lib/utils';
import toast from 'react-hot-toast';

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay, ease },
  }),
};

const sectionReveal = {
  hidden: { opacity: 0, y: 32 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease },
  }),
};

export default function AdminDashboardPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsService.getDashboard()
      .then((res) => setData(res.data))
      .catch(() => toast.error('Failed to load dashboard data'))
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    { icon: <DollarSign size={20} />, label: 'Total Revenue', value: data ? formatPrice(data.totalRevenue) : '$0', trend: 12 },
    { icon: <ShoppingCart size={20} />, label: 'Total Orders', value: data?.totalOrders || 0, trend: 8 },
    { icon: <Users size={20} />, label: 'Total Customers', value: data?.totalUsers || 0, trend: 15 },
    { icon: <Package size={20} />, label: 'Total Products', value: data?.totalProducts || 0, trend: 5 },
  ];

  return (
    <div className="space-y-6">
      <motion.div
        custom={0}
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="flex flex-col gap-2"
      >
        <h2 className="text-xl font-serif text-luxury-charcoal tracking-wide">Dashboard Overview</h2>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.7, delay: 0.2, ease }}
          className="h-px w-16 origin-left bg-luxury-gold/70"
        />
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <StatsCard
            key={stat.label}
            icon={stat.icon}
            label={stat.label}
            value={stat.value}
            trend={stat.trend}
            delay={0.08 + idx * 0.09}
          />
        ))}
      </div>

      <motion.div
        custom={0.35}
        initial="hidden"
        animate="visible"
        variants={sectionReveal}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <SalesChart />
        <OrdersChart />
      </motion.div>

      <motion.div
        custom={0.5}
        initial="hidden"
        animate="visible"
        variants={sectionReveal}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <RecentOrders />
        <TopProducts />
      </motion.div>

      <motion.div
        custom={0.65}
        initial="hidden"
        animate="visible"
        variants={sectionReveal}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <LatestReviews />
        <InventoryAlerts />
      </motion.div>
    </div>
  );
}
