import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

const variantStyles = {
  primary: 'bg-luxury-ink text-luxury-on-ink hover:bg-luxury-gold hover:text-luxury-charcoal shadow-sm',
  secondary: 'border border-luxury-charcoal/20 text-luxury-charcoal hover:border-luxury-gold hover:text-luxury-gold',
  ghost: 'text-luxury-steel hover:text-luxury-charcoal hover:bg-luxury-ivory',
  danger: 'bg-luxury-red/90 text-white hover:bg-luxury-red',
  outline: 'bg-transparent text-luxury-charcoal border border-luxury-border hover:border-luxury-charcoal/40',
};

const sizeStyles = {
  sm: 'px-4 py-1.5 text-xs',
  md: 'px-6 py-2.5 text-sm',
  lg: 'px-8 py-3 text-sm',
  xl: 'px-10 py-4 text-base',
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variantStyles;
  size?: keyof typeof sizeStyles;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={!disabled ? { y: -1 } : {}}
        whileTap={!disabled ? { scale: 0.98 } : {}}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-medium tracking-wide transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-luxury-gold/30 focus:ring-offset-2 focus:ring-offset-luxury-cream disabled:opacity-40 disabled:cursor-not-allowed rounded-lg',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        disabled={disabled || isLoading}
        {...(props as any)}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : leftIcon ? (
          <span className="h-4 w-4 flex-shrink-0">{leftIcon}</span>
        ) : null}
        {children}
        {rightIcon && !isLoading && <span className="h-4 w-4 flex-shrink-0">{rightIcon}</span>}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
