import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { cn } from '../../lib/utils';

const periods = ['7d', '30d', '90d', '1y'] as const;

const dataMap: Record<string, { name: string; revenue: number; orders: number }[]> = {
  '7d': [
    { name: 'Mon', revenue: 4200, orders: 28 },
    { name: 'Tue', revenue: 3800, orders: 24 },
    { name: 'Wed', revenue: 5100, orders: 32 },
    { name: 'Thu', revenue: 4600, orders: 29 },
    { name: 'Fri', revenue: 6200, orders: 38 },
    { name: 'Sat', revenue: 7400, orders: 45 },
    { name: 'Sun', revenue: 5800, orders: 35 },
  ],
  '30d': Array.from({ length: 30 }, (_, i) => ({
    name: `Day ${i + 1}`,
    revenue: Math.floor(3000 + Math.random() * 5000),
    orders: Math.floor(15 + Math.random() * 35),
  })),
  '90d': Array.from({ length: 12 }, (_, i) => ({
    name: `W${i + 1}`,
    revenue: Math.floor(20000 + Math.random() * 30000),
    orders: Math.floor(100 + Math.random() * 200),
  })),
  '1y': Array.from({ length: 12 }, (_, i) => ({
    name: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i],
    revenue: Math.floor(80000 + Math.random() * 70000),
    orders: Math.floor(400 + Math.random() * 400),
  })),
};

interface SalesChartProps {
  className?: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-luxury-dark border border-luxury-gold/20 p-3">
        <p className="text-xs text-luxury-steel mb-1">{label}</p>
        {payload.map((entry: any, idx: number) => (
          <p key={idx} className="text-sm font-medium" style={{ color: entry.color }}>
            {entry.name}: ${entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function SalesChart({ className }: SalesChartProps) {
  const [period, setPeriod] = useState<typeof periods[number]>('7d');
  const data = dataMap[period];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('border border-luxury-border p-5', className)}
    >
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-display text-luxury-champagne tracking-wider uppercase">Sales Overview</h3>
        <div className="flex gap-1">
          {periods.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={cn(
                'px-3 py-1 text-xs transition-all',
                period === p
                  ? 'bg-luxury-gold text-luxury-black'
                  : 'text-luxury-steel hover:text-luxury-charcoal bg-luxury-ivory'
              )}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
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
      </div>
    </motion.div>
  );
}
