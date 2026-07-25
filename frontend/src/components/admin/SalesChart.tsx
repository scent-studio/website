import React from 'react';
import { motion } from 'framer-motion';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { cn } from '../../lib/utils';
import { formatPrice } from '../../lib/utils';

interface RevenueDataPoint {
  date: string;
  revenue: number;
  orders: number;
}

interface SalesChartProps {
  data?: RevenueDataPoint[];
  className?: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-luxury-dark border border-luxury-gold/20 p-3">
        <p className="text-xs text-luxury-steel mb-1">{label}</p>
        {payload.map((entry: any, idx: number) => (
          <p key={idx} className="text-sm font-medium" style={{ color: entry.color }}>
            {entry.name === 'revenue' ? formatPrice(entry.value) : `${entry.value} orders`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function SalesChart({ data = [], className }: SalesChartProps) {
  const chartData = data.map((d) => ({
    name: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    revenue: d.revenue,
    orders: d.orders,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('border border-luxury-border p-5', className)}
    >
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-display text-luxury-champagne tracking-wider uppercase">Sales Overview</h3>
        <span className="text-xs text-luxury-steel">Last 30 days</span>
      </div>

      <div className="h-72">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--lux-border))" />
              <XAxis dataKey="name" stroke="rgb(var(--lux-steel))" fontSize={12} tickLine={false} />
              <YAxis stroke="rgb(var(--lux-steel))" fontSize={12} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="rgb(var(--lux-gold))"
                strokeWidth={2}
                dot={{ fill: 'rgb(var(--lux-gold))', r: 3 }}
                activeDot={{ r: 5, fill: 'rgb(var(--lux-gold))' }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-sm text-luxury-steel">
            No sales data yet
          </div>
        )}
      </div>
    </motion.div>
  );
}
