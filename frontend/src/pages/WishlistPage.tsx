import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import { formatPrice } from '../lib/utils';
import { addToLocalCart } from '../lib/cartStorage';
import {
  getLocalWishlist,
  onWishlistChange,
  removeFromLocalWishlist,
  type WishlistItem,
} from '../lib/wishlistStorage';
import toast from 'react-hot-toast';

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>(() => getLocalWishlist());

  useEffect(() => {
    return onWishlistChange(() => setItems(getLocalWishlist()));
  }, []);

  const handleRemove = (productId: string) => {
    try {
      removeFromLocalWishlist(productId);
      toast.success('Removed from wishlist');
    } catch {
      toast.error('Failed to remove');
    }
  };

  const handleAddToCart = (item: WishlistItem) => {
    try {
      addToLocalCart(item as any, 1, '50ml');
      toast.success('Added to cart');
    } catch {
      toast.error('Failed to add to cart');
    }
  };

  const brandName = (item: WishlistItem) =>
    typeof item.brand === 'object' ? item.brand?.name : item.brand;

  return (
    <div>
      <PageHeader
        title="My Wishlist"
        subtitle={`${items.length} saved items`}
        breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Wishlist' }]}
      />
      <section className="py-16 bg-luxury-cream min-h-[60vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {items.length === 0 ? (
            <EmptyState
              icon={<Heart size={48} />}
              title="Your wishlist is empty"
              description="Save your favorite fragrances here."
              action={{ label: 'Explore Perfumes', onClick: () => { window.location.href = '/shop'; } }}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {items.map((item) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group border border-luxury-border bg-luxury-white hover:border-luxury-gold/30 transition-all"
                >
                  <Link to={`/product/${item.slug}`} className="block aspect-[3/4] bg-luxury-warm overflow-hidden">
                    <img
                      src={item.images?.[0] || '/placeholder-perfume.jpg'}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </Link>
                  <div className="p-4">
                    {brandName(item) && (
                      <p className="text-xs text-luxury-steel mb-1 tracking-wider uppercase">
                        {brandName(item)}
                      </p>
                    )}
                    <Link
                      to={`/product/${item.slug}`}
                      className="block text-sm text-luxury-charcoal hover:text-luxury-gold transition-colors font-medium mb-2"
                    >
                      {item.name}
                    </Link>
                    <p className="text-sm text-luxury-charcoal font-semibold">
                      {formatPrice(item.discountedPrice || item.price)}
                    </p>
                    <div className="flex gap-2 mt-4">
                      <Button
                        variant="primary"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleAddToCart(item)}
                      >
                        <ShoppingBag size={14} /> Add to Cart
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleRemove(item._id)}>
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
