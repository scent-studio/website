import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { cn } from '../../lib/utils';
import Button from '../ui/Button';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmLabel?: string;
  isLoading?: boolean;
  variant?: 'danger' | 'warning';
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmLabel = 'Delete',
  isLoading,
  variant = 'danger',
}: ConfirmDialogProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-luxury-white border border-luxury-border rounded-xl shadow-card p-6 max-w-sm w-full"
          >
            <div className="text-center">
              <div
                className={cn(
                  'inline-flex h-12 w-12 items-center justify-center mb-4 rounded-xl',
                  variant === 'danger' ? 'bg-red-50 text-red-500' : 'bg-yellow-50 text-yellow-600'
                )}
              >
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-lg font-serif text-luxury-charcoal mb-2">{title}</h3>
              <p className="text-sm text-luxury-steel mb-6">{message}</p>
              <div className="flex items-center justify-center gap-3">
                <Button variant="ghost" size="md" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  variant={variant === 'danger' ? 'danger' : 'primary'}
                  size="md"
                  onClick={onConfirm}
                  isLoading={isLoading}
                >
                  {confirmLabel}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
