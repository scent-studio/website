import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

export function InlineLoader({ size = 'md', className }: { size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const sizeMap = { sm: 'h-5 w-5', md: 'h-8 w-8', lg: 'h-12 w-12' };

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <motion.div
        className={cn('relative', sizeMap[size])}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      >
        <div className="absolute inset-0 border-2 border-luxury-gold/15 rounded-full" />
        <div className="absolute inset-0 border-2 border-transparent border-t-luxury-gold rounded-full" />
      </motion.div>
    </div>
  );
}

export function FullPageLoader({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-luxury-cream">
      <motion.div
        className="relative h-20 w-20"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      >
        <div className="absolute inset-0 border-2 border-luxury-gold/10 rounded-full" />
        <div className="absolute inset-0 border-2 border-transparent border-t-luxury-gold rounded-full" />
        <div className="absolute inset-2 border-2 border-transparent border-b-luxury-gold-light rounded-full" />
        <div className="absolute inset-4 bg-luxury-gold/5 rounded-full" />
      </motion.div>
      <motion.p
        className="mt-6 text-luxury-charcoal font-serif text-lg tracking-wider"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {text}
      </motion.p>
      <div className="mt-4 flex gap-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="h-1.5 w-1.5 bg-luxury-gold/60 rounded-full"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </div>
    </div>
  );
}

export default function Loader({ size = 'md', className, text }: LoaderProps) {
  if (text) {
    return (
      <div className={cn('flex flex-col items-center gap-3', className)}>
        <InlineLoader size={size} />
        <p className="text-sm text-luxury-steel font-sans">{text}</p>
      </div>
    );
  }
  return <InlineLoader size={size} className={className} />;
}
