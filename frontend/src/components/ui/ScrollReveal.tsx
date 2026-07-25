import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

const ease = [0.22, 1, 0.36, 1] as const;

const variants = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  fadeInUp: {
    hidden: { opacity: 0, y: 56 },
    visible: { opacity: 1, y: 0 },
  },
  fadeInDown: {
    hidden: { opacity: 0, y: -40 },
    visible: { opacity: 1, y: 0 },
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.88 },
    visible: { opacity: 1, scale: 1 },
  },
  slideInLeft: {
    hidden: { opacity: 0, x: -72 },
    visible: { opacity: 1, x: 0 },
  },
  slideInRight: {
    hidden: { opacity: 0, x: 72 },
    visible: { opacity: 1, x: 0 },
  },
};

interface ScrollRevealProps {
  children: React.ReactNode;
  variant?: keyof typeof variants;
  delay?: number;
  duration?: number;
  once?: boolean;
  className?: string;
}

export default function ScrollReveal({
  children,
  variant = 'fadeInUp',
  delay = 0,
  duration = 0.7,
  once = true,
  className,
}: ScrollRevealProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.2, margin: '0px 0px -60px 0px' }}
      variants={variants[variant]}
      transition={{ duration, delay, ease }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
