import React, { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '../../lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, leftIcon, rightIcon, containerClassName, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';

    return (
      <div className={cn('w-full', containerClassName)}>
        {label && (
          <label className="block text-sm font-medium text-luxury-charcoal mb-1.5 font-sans">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-luxury-steel pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            type={isPassword ? (showPassword ? 'text' : 'password') : type}
            className={cn(
              'w-full px-4 py-3 bg-luxury-white border text-luxury-charcoal placeholder:text-luxury-steel/50 rounded-lg transition-all duration-300 outline-none',
              'focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold/20',
              error ? 'border-luxury-red/50 focus:border-luxury-red focus:ring-luxury-red/20' : 'border-luxury-border',
              leftIcon && 'pl-10',
              (rightIcon || isPassword) && 'pr-10',
              className
            )}
            {...props}
          />
          {isPassword ? (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-luxury-steel hover:text-luxury-charcoal transition-colors"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          ) : rightIcon ? (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-luxury-steel pointer-events-none">
              {rightIcon}
            </div>
          ) : null}
        </div>
        {error && <p className="mt-1.5 text-xs text-luxury-red">{error}</p>}
        {helperText && !error && <p className="mt-1.5 text-xs text-luxury-steel">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
