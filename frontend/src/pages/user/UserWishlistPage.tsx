import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../../store';
import { fetchWishlist, removeFromWishlist, clearWishlist } from '../../store/slices/wishlistSlice';
import Loader from '../../components/ui/Loader';
import EmptyState from '../../components/ui/EmptyState';
import ErrorState from '../../components/ui/ErrorState';
import Button from '../../components/ui/Button';
import { formatPrice } from '../../lib/utils';
import { useCart } from '../../hooks/useCart';
import toast from 'react-hot-toast';

export default function UserWishlistPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, isLoading, error } = useSelector((state: RootState) => state.wishlist);
  const { addToCart } = useCart();

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  const handleRemove = (productId: string) => {
    dispatch(removeFromWishlist(productId));
    toast.success('Removed from wishlist');
  };

  const handleAddToCart = async (productId: string) => {
    try {
      await addToCart({ product: productId, quantity: 1 });
      toast.success('Added to cart');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to add to cart');
    }
  };

  if (isLoading) return <Loader size="md" text="Loading wishlist..." />;
  if (error) return <ErrorState message={error} onRetry={() => dispatch(fetchWishlist())} />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-serif text-luxury-charcoal">My Wishlist ({items.length})</h2>
        {items.length > 0 && (
          <Button variant="ghost" size="sm" onClick={() => { dispatch(clearWishlist()); toast.success('Wishlist cleared'); }}>
            <Trash2 size={14} /> Clear All
          </Button>
        )}
      </div>
      {items.length === 0 ? (
        <EmptyState icon={<Heart size={40} />} title="Your wishlist is empty" description="Save your favorite fragrances." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((product, idx) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="group relative bg-luxury-white rounded-xl shadow-card border border-luxury-border hover:border-luxury-gold/40 transition-all duration-500 overflow-hidden"
            >
              <div className="relative overflow-hidden">
                <Link to={`/product/${product.slug}`}>
                  <div className="aspect-[3/4] overflow-hidden">
                    <img src={product.images?.[0] || 'https://placehold.co/400x533/1a1a1a/d4a853?text=P'} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                </Link>
                <button onClick={() => handleRemove(product._id)} className="absolute top-3 right-3 h-8 w-8 flex items-center justify-center bg-luxury-ink/60 text-white hover:bg-red-500 hover:text-white transition-all rounded-lg">
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="p-4">
                <Link to={`/product/${product.slug}`}>
                  <h3 className="text-sm font-medium text-luxury-charcoal hover:text-luxury-gold truncate">{product.name}</h3>
                </Link>
                <p className="text-sm font-serif text-luxury-gold mt-1">{formatPrice(product.price)}</p>
                <Button variant="primary" size="sm" className="w-full mt-3" onClick={() => handleAddToCart(product._id)}>
                  <ShoppingBag size={14} /> Add to Cart
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
