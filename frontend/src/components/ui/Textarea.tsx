import React, { forwardRef, useState } from 'react';
import { cn } from '../../lib/utils';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  showCount?: boolean;
  maxLength?: number;
  containerClassName?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, showCount, maxLength, containerClassName, onChange, value, ...props }, ref) => {
    const [charCount, setCharCount] = useState(
      typeof value === 'string' ? value.length : 0
    );

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharCount(e.target.value.length);
      onChange?.(e);
    };

    return (
      <div className={cn('w-full', containerClassName)}>
        <div className="flex items-center justify-between mb-1.5">
          {label && (
            <label className="text-sm font-medium text-luxury-charcoal font-sans">
              {label}
            </label>
          )}
          {showCount && maxLength && (
            <span className="text-xs text-luxury-steel">
              {charCount}/{maxLength}
            </span>
          )}
        </div>
        <textarea
          ref={ref}
          maxLength={maxLength}
          value={value}
          onChange={handleChange}
          className={cn(
            'w-full px-4 py-3 bg-luxury-white border text-luxury-charcoal placeholder:text-luxury-steel/50 rounded-lg transition-all duration-300 outline-none resize-none min-h-[120px]',
            'focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold/20',
            error ? 'border-luxury-red/50 focus:border-luxury-red focus:ring-luxury-red/20' : 'border-luxury-border',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1.5 text-xs text-luxury-red">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
export default Textarea;
