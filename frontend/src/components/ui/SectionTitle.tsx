import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

const ease = [0.22, 1, 0.36, 1] as const;

export default function SectionTitle({
  title,
  subtitle,
  align = 'center',
  className,
}: SectionTitleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.7, ease }}
      className={cn(
        'mb-14',
        align === 'center' && 'text-center',
        align === 'right' && 'text-right',
        className
      )}
    >
      <h2
        className={cn(
          'text-3xl md:text-4xl lg:text-5xl font-serif tracking-tight text-luxury-charcoal',
          align === 'center' && 'text-balance'
        )}
      >
        {title}
      </h2>
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.65, delay: 0.15, ease }}
        className={cn(
          'h-px w-14 bg-luxury-gold mt-5 mb-5 origin-left',
          align === 'center' && 'mx-auto origin-center',
          align === 'right' && 'ml-auto origin-right'
        )}
      />
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.2, ease }}
          className={cn(
            'text-luxury-steel font-sans text-sm md:text-base leading-relaxed',
            align === 'center' && 'max-w-xl mx-auto'
          )}
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}
