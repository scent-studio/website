import React from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { cn } from '../../lib/utils';

interface OrdersDataPoint {
  month: string;
  count: number;
}

interface OrdersChartProps {
  data?: OrdersDataPoint[];
  className?: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-luxury-dark border border-luxury-gold/20 p-3">
        <p className="text-xs text-luxury-steel mb-1">{label}</p>
        <p className="text-sm font-medium text-luxury-gold">
          {payload[0].value} orders
        </p>
      </div>
    );
  }
  return null;
};

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function OrdersChart({ data = [], className }: OrdersChartProps) {
  const chartData = data.map((d) => {
    const [year, month] = d.month.split('-');
    return {
      name: monthNames[parseInt(month, 10) - 1] || d.month,
      orders: d.count,
    };
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('border border-luxury-border p-5', className)}
    >
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-display text-luxury-champagne tracking-wider uppercase">Orders Overview</h3>
        <span className="text-xs text-luxury-steel">Last 12 months</span>
      </div>

      <div className="h-72">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--lux-border))" vertical={false} />
              <XAxis dataKey="name" stroke="rgb(var(--lux-steel))" fontSize={12} tickLine={false} />
              <YAxis stroke="rgb(var(--lux-steel))" fontSize={12} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="orders"
                fill="rgb(var(--lux-gold))"
                radius={[2, 2, 0, 0]}
                barSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-sm text-luxury-steel">
            No order data yet
          </div>
        )}
      </div>
    </motion.div>
  );
}
