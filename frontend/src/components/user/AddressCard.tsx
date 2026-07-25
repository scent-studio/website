import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Edit2, Trash2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import Badge from '../ui/Badge';
import type { Address } from '../../types';

interface AddressCardProps {
  address: Address;
  isDefault?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  className?: string;
}

export default function AddressCard({ address, isDefault, onEdit, onDelete, className }: AddressCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'relative p-5 border border-luxury-border hover:border-luxury-gold/20 transition-all duration-300',
        isDefault && 'border-luxury-gold/30',
        className
      )}
    >
      {isDefault && (
        <Badge variant="gold" size="sm" className="absolute top-3 right-3">Default</Badge>
      )}

      <div className="flex items-start gap-3">
        <MapPin size={18} className="text-luxury-gold mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm text-luxury-charcoal font-medium">
            {address.street}
          </p>
          <p className="text-sm text-luxury-steel">
            {address.city}, {address.state} {address.zip}
          </p>
          <p className="text-sm text-luxury-steel">{address.country}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 mt-4 pt-3 border-t border-luxury-border">
        <button
          onClick={onEdit}
          className="flex items-center gap-1.5 text-xs text-luxury-steel hover:text-luxury-gold transition-colors"
        >
          <Edit2 size={12} /> Edit
        </button>
        <button
          onClick={onDelete}
          className="flex items-center gap-1.5 text-xs text-luxury-steel hover:text-red-400 transition-colors"
        >
          <Trash2 size={12} /> Delete
        </button>
      </div>
    </motion.div>
  );
}
