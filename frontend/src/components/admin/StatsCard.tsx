import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '../../lib/utils';

interface StatsCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  trend?: number;
  delay?: number;
  className?: string;
}

export default function StatsCard({ icon, label, value, trend, delay = 0, className }: StatsCardProps) {
  const isPositive = trend && trend >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 28, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -5, transition: { duration: 0.25 } }}
      className={cn(
        'p-5 bg-luxury-white border border-luxury-border rounded-xl shadow-sm hover:shadow-card hover:border-luxury-gold/30 transition-colors duration-300 cursor-default',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: delay + 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="h-10 w-10 flex items-center justify-center bg-luxury-gold/10 border border-luxury-gold/20 text-luxury-gold rounded-lg"
        >
          {icon}
        </motion.div>
        {trend !== undefined && (
          <motion.span
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: delay + 0.2 }}
            className={cn(
              'flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full',
              isPositive ? 'text-green-600 bg-green-50' : 'text-red-500 bg-red-50'
            )}
          >
            {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(trend)}%
          </motion.span>
        )}
      </div>
      <div className="mt-4">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: delay + 0.18 }}
          className="text-3xl font-serif text-luxury-charcoal"
        >
          {value}
        </motion.p>
        <p className="text-sm text-luxury-steel mt-1">{label}</p>
      </div>
    </motion.div>
  );
}
