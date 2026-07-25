import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

const variantStyles = {
  default: 'bg-luxury-ink/40 border border-luxury-border',
  glass: 'bg-black/40 backdrop-blur-xl border border-white/10 shadow-xl',
  gradient: 'bg-gradient-to-br from-luxury-ink/60 to-luxury-dark/60 border border-luxury-gold/10',
  bordered: 'bg-luxury-dark/40 border border-luxury-gold/20',
};

interface CardProps {
  variant?: keyof typeof variantStyles;
  className?: string;
  children: React.ReactNode;
  hover?: boolean;
  image?: string;
  imageAlt?: string;
  imageHeight?: string;
  onClick?: () => void;
}

export default function Card({
  variant = 'default',
  className,
  children,
  hover = true,
  image,
  imageAlt = '',
  imageHeight = 'h-48',
  onClick,
}: CardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' } : {}}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className={cn(
        'rounded-none overflow-hidden transition-all duration-500',
        'hover:border-luxury-gold/30',
        variantStyles[variant],
        hover && 'cursor-pointer',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {image && (
        <div className={cn('relative overflow-hidden', imageHeight)}>
          <img
            src={image}
            alt={imageAlt}
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
          />
        </div>
      )}
      <div className="p-6">{children}</div>
    </motion.div>
  );
}
