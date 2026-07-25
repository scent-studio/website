import React from 'react';
import { motion } from 'framer-motion';
import { Trash2, Minus, Plus } from 'lucide-react';
import { formatPrice } from '../../lib/utils';
import { Link } from 'react-router-dom';
import type { LocalCartItem } from '../../types';

interface CartItemProps {
  item: LocalCartItem;
  onUpdateQuantity?: (id: string, quantity: number) => void;
  onRemove?: (id: string) => void;
}

export default function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const { product, quantity, size } = item;
  const productPath = `/product/${product.slug || product._id}`;
  const unitPrice = item.price ?? product.price;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex gap-4 p-4 bg-luxury-white rounded-xl border border-luxury-border shadow-soft"
    >
      <Link to={productPath} className="w-20 h-24 flex-shrink-0 overflow-hidden rounded-lg">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </Link>

      <div className="flex-1 min-w-0">
        <Link to={productPath}>
          <h4 className="text-sm font-medium text-luxury-charcoal hover:text-luxury-gold transition-colors truncate">
            {product.name}
          </h4>
        </Link>
        {size && <p className="text-xs text-luxury-steel mt-0.5">{size}</p>}
        <p className="text-sm text-luxury-charcoal font-medium mt-1">{formatPrice(unitPrice)}</p>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center border border-luxury-border rounded-md">
            <button
              onClick={() => onUpdateQuantity?.(product._id, quantity - 1)}
              disabled={quantity <= 1}
              className="h-7 w-7 flex items-center justify-center text-luxury-steel hover:text-luxury-gold disabled:opacity-30 transition-colors"
            >
              <Minus size={12} />
            </button>
            <span className="w-8 text-center text-xs text-luxury-charcoal">{quantity}</span>
            <button
              onClick={() => onUpdateQuantity?.(product._id, quantity + 1)}
              className="h-7 w-7 flex items-center justify-center text-luxury-steel hover:text-luxury-gold transition-colors"
            >
              <Plus size={12} />
            </button>
          </div>
          <button
            onClick={() => onRemove?.(product._id)}
            className="h-7 w-7 flex items-center justify-center text-luxury-steel hover:text-luxury-red transition-colors"
            title="Remove item"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="text-right flex-shrink-0">
        <p className="text-sm font-medium text-luxury-charcoal">
          {formatPrice(unitPrice * quantity)}
        </p>
      </div>
    </motion.div>
  );
}
