import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

const sizeStyles = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-[95vw] h-[95vh]',
};

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: keyof typeof sizeStyles;
  children: React.ReactNode;
  footer?: React.ReactNode;
  showClose?: boolean;
  className?: string;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  size = 'md',
  children,
  footer,
  showClose = true,
  className,
}: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={cn(
              'relative w-full bg-luxury-white border border-luxury-border rounded-xl shadow-card',
              sizeStyles[size],
              className
            )}
          >
            {showClose && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-luxury-steel hover:text-luxury-charcoal transition-colors z-10"
              >
                <X size={20} />
              </button>
            )}
            {title && (
              <div className="px-6 py-4 border-b border-luxury-border">
                <h2 className="text-xl font-serif text-luxury-charcoal">{title}</h2>
              </div>
            )}
            <div className="p-6 overflow-y-auto max-h-[70vh]">{children}</div>
            {footer && (
              <div className="px-6 py-4 border-t border-luxury-border flex items-center justify-end gap-3">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
