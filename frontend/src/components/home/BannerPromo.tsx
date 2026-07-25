import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import Button from '../ui/Button';

interface BannerPromoProps {
  className?: string;
}

export default function BannerPromo({ className }: BannerPromoProps) {
  return (
    <section className={cn('relative overflow-hidden py-20 md:py-28', className)}>
      <img
        src="https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1920&q=80"
        alt="Luxury Perfume Collection"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/50" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-xs font-display text-luxury-gold-light tracking-[0.3em] uppercase"
        >
          Limited Edition
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mt-4 text-3xl md:text-5xl font-display text-white leading-tight"
        >
          The Royal Collection
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-4 text-white/80 max-w-lg mx-auto"
        >
          Handcrafted with the rarest ingredients from around the world. Experience true royalty.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <Button variant="primary" size="xl">
            Explore the Collection
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
