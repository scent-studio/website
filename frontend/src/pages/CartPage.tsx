import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, Trash2 } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import {
  getLocalCart,
  clearLocalCart,
  getCartSubtotal,
  calcShipping,
  onCartChange,
  removeFromLocalCart,
  updateLocalCartQuantity,
} from '../lib/cartStorage';
import type { LocalCartItem } from '../types';
import toast from 'react-hot-toast';

export default function CartPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<LocalCartItem[]>([]);

  useEffect(() => {
    setItems(getLocalCart());
    return onCartChange(() => setItems(getLocalCart()));
  }, []);

  const subtotal = getCartSubtotal(items);
  const shipping = calcShipping(subtotal);

  const handleRemove = (productId: string, size?: string) => {
    removeFromLocalCart(productId, size);
    toast.success('Item removed');
  };

  const handleUpdateQuantity = (productId: string, qty: number, size?: string) => {
    if (qty < 1) return;
    updateLocalCartQuantity(productId, size || '', qty);
  };

  const handleClear = () => {
    clearLocalCart();
    toast.success('Cart cleared');
  };

  return (
    <div>
      <PageHeader
        title="Shopping Cart"
        subtitle={`${items.length} item(s) in your cart`}
        breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Cart' }]}
      />
      <section className="py-16 bg-luxury-cream min-h-[60vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {items.length === 0 ? (
            <EmptyState
              icon={<ShoppingBag size={48} />}
              title="Your cart is empty"
              description="Discover fragrances crafted for lasting presence."
              action={{ label: 'Continue Shopping', onClick: () => navigate('/shop') }}
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                  <CartItem
                    key={`${item.product._id}-${item.size}`}
                    item={item}
                    onUpdateQuantity={(id, qty) => handleUpdateQuantity(id, qty, item.size)}
                    onRemove={(id) => handleRemove(id, item.size)}
                  />
                ))}
                <div className="flex items-center justify-between pt-4">
                  <Link
                    to="/shop"
                    className="flex items-center gap-2 text-sm text-luxury-charcoal hover:text-luxury-gold-dark transition-colors"
                  >
                    <ArrowLeft size={14} /> Continue Shopping
                  </Link>
                  <Button variant="ghost" size="sm" onClick={handleClear}>
                    <Trash2 size={14} /> Clear Cart
                  </Button>
                </div>
              </div>
              <div className="space-y-4 lg:sticky lg:top-24 self-start">
                <CartSummary subtotal={subtotal} shipping={shipping} discount={0} />
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={() => navigate('/checkout')}
                >
                  Proceed to Checkout
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
