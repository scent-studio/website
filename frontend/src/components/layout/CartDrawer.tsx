import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Minus, Plus, Trash2 } from 'lucide-react';
import { formatPrice } from '../../lib/utils';
import {
  getLocalCart,
  getCartSubtotal,
  onCartChange,
  removeFromLocalCart,
  updateLocalCartQuantity,
} from '../../lib/cartStorage';
import type { LocalCartItem } from '../../types';
import Button from '../ui/Button';

export default function CartDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [items, setItems] = useState<LocalCartItem[]>([]);

  useEffect(() => {
    if (isOpen) setItems(getLocalCart());
  }, [isOpen]);

  useEffect(() => onCartChange(() => setItems(getLocalCart())), []);

  const subtotal = getCartSubtotal(items);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-luxury-ink/30 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-luxury-white border-l border-luxury-border z-50 flex flex-col shadow-card"
          >
            <div className="flex items-center justify-between p-5 border-b border-luxury-border">
              <div className="flex items-center gap-3">
                <ShoppingBag size={20} className="text-luxury-charcoal" />
                <h2 className="text-lg font-serif text-luxury-charcoal">Cart ({items.length})</h2>
              </div>
              <button type="button" onClick={onClose} className="text-luxury-steel hover:text-luxury-charcoal transition-colors">
                <X size={20} />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <ShoppingBag size={48} className="text-luxury-border mb-4" />
                <h3 className="text-lg font-serif text-luxury-charcoal mb-2">Your cart is empty</h3>
                <p className="text-sm text-luxury-steel mb-6">Discover fragrances crafted with intention.</p>
                <Button variant="primary" onClick={onClose}>Continue Shopping</Button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                  {items.map((item) => (
                    <div key={`${item.product._id}-${item.size}`} className="flex gap-4 p-4 border border-luxury-border bg-luxury-white">
                      <img
                        src={item.product.images?.[0] || item.image}
                        alt={item.product.name}
                        className="w-20 h-24 object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-luxury-charcoal truncate">{item.product.name}</h4>
                        {item.size && <p className="text-xs text-luxury-steel mt-0.5">{item.size}</p>}
                        <p className="text-sm text-luxury-charcoal mt-1 font-medium">{formatPrice(item.price)}</p>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center border border-luxury-border">
                            <button
                              type="button"
                              onClick={() => updateLocalCartQuantity(item.product._id, item.size, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="h-8 w-8 flex items-center justify-center text-luxury-steel hover:text-luxury-charcoal disabled:opacity-30"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="w-8 text-center text-xs text-luxury-charcoal font-medium">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateLocalCartQuantity(item.product._id, item.size, item.quantity + 1)}
                              className="h-8 w-8 flex items-center justify-center text-luxury-steel hover:text-luxury-charcoal"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFromLocalCart(item.product._id, item.size)}
                            className="h-8 w-8 flex items-center justify-center text-luxury-steel hover:text-luxury-red"
                            title="Remove item"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-luxury-border p-5 space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-luxury-steel">Subtotal</span>
                    <span className="text-luxury-charcoal font-serif">{formatPrice(subtotal)}</span>
                  </div>
                  <Link to="/checkout" onClick={onClose}>
                    <Button variant="primary" size="lg" className="w-full">Checkout</Button>
                  </Link>
                  <Link to="/cart" onClick={onClose} className="block w-full text-center text-sm text-luxury-steel hover:text-luxury-charcoal transition-colors">
                    View Cart
                  </Link>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
