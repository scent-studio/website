import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
  containerClassName?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, placeholder, containerClassName, ...props }, ref) => {
    return (
      <div className={cn('w-full', containerClassName)}>
        {label && (
          <label className="block text-sm font-medium text-luxury-charcoal mb-1.5 font-sans">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={cn(
              'w-full px-4 py-3 bg-luxury-white border text-luxury-charcoal rounded-lg transition-all duration-300 outline-none appearance-none cursor-pointer',
              'focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold/20',
              error ? 'border-luxury-red/50 focus:border-luxury-red focus:ring-luxury-red/20' : 'border-luxury-border',
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-luxury-white text-luxury-charcoal">
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-luxury-steel pointer-events-none"
          />
        </div>
        {error && <p className="mt-1.5 text-xs text-luxury-red">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
export default Select;
