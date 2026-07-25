import React from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { cn } from '../../lib/utils';

const data = [
  { name: 'Jan', orders: 145 },
  { name: 'Feb', orders: 168 },
  { name: 'Mar', orders: 192 },
  { name: 'Apr', orders: 178 },
  { name: 'May', orders: 210 },
  { name: 'Jun', orders: 234 },
  { name: 'Jul', orders: 256 },
  { name: 'Aug', orders: 245 },
  { name: 'Sep', orders: 220 },
  { name: 'Oct', orders: 198 },
  { name: 'Nov', orders: 275 },
  { name: 'Dec', orders: 310 },
];

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

interface OrdersChartProps {
  className?: string;
}

export default function OrdersChart({ className }: OrdersChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('border border-luxury-border p-5', className)}
    >
      <h3 className="text-sm font-display text-luxury-champagne tracking-wider uppercase mb-5">
        Orders Overview
      </h3>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
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
      </div>
    </motion.div>
  );
}
