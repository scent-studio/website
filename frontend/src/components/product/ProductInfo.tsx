import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Heart, Share2, ShoppingBag, Zap, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../../store';
import { addToWishlist, removeFromWishlist, toggleWishlistLocal } from '../../store/slices/wishlistSlice';
import { cn, formatPrice, getDisplayPrice, findProductSize } from '../../lib/utils';
import { addToLocalCart, getProductUnitPrice } from '../../lib/cartStorage';
import { isInLocalWishlist, onWishlistChange } from '../../lib/wishlistStorage';
import Rating from '../ui/Rating';
import QuantitySelector from '../ui/QuantitySelector';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import type { Product, ProductSize } from '../../types';
import toast from 'react-hot-toast';

interface ProductInfoProps {
  product: Product;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const wishlistIds = useSelector((state: RootState) => state.wishlist.wishlistIds);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const [quantity, setQuantity] = useState(1);
  const [localWishlisted, setLocalWishlisted] = useState(() => isInLocalWishlist(product._id));

  const sizes = product.sizes || [];
  const preferredDefault =
    findProductSize(sizes, '100ml')?.size || sizes[0]?.size || '';
  const [selectedSize, setSelectedSize] = useState(preferredDefault);

  useEffect(() => {
    setSelectedSize(findProductSize(sizes, '100ml')?.size || sizes[0]?.size || '');
  }, [product._id]);

  useEffect(() => {
    const sync = () => setLocalWishlisted(isInLocalWishlist(product._id));
    sync();
    return onWishlistChange(sync);
  }, [product._id]);

  const isWishlisted = wishlistIds.includes(product._id) || localWishlisted;
  const brandName = product.brand && typeof product.brand === 'object' ? (product.brand as any)?.name : product.brand;
  const { price: displayBase, original, hasDiscount, percent } = getDisplayPrice(
    product,
    selectedSize || '100ml'
  );
  const unitPrice = selectedSize
    ? getProductUnitPrice(product, selectedSize)
    : displayBase;
  const selectedSizeInfo = findProductSize(sizes, selectedSize);
  const inStock = selectedSizeInfo
    ? selectedSizeInfo.stock > 0
    : (product.inStock ?? product.stock > 0);
  const reviewCount = product.numReviews ?? 0;

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }
    if (!inStock) {
      toast.error('This size is out of stock');
      return;
    }
    try {
      addToLocalCart(product, quantity, selectedSize);
      toast.success('Added to cart');
    } catch {
      toast.error('Failed to add to cart');
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  const handleToggleWishlist = async () => {
    if (!isAuthenticated) {
      dispatch(toggleWishlistLocal(product as any));
      toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
      return;
    }
    try {
      if (isWishlisted) {
        await dispatch(removeFromWishlist(product._id)).unwrap();
        toast.success('Removed from wishlist');
      } else {
        await dispatch(addToWishlist(product._id)).unwrap();
        toast.success('Added to wishlist');
      }
    } catch {
      // Guest-style fallback so heart still works offline / on API mismatch
      dispatch(toggleWishlistLocal(product as any));
      toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: product.name, url: window.location.href });
      } catch {
        /* cancelled */
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied');
    }
  };

  const sizeOptions = useMemo(() => sizes as ProductSize[], [sizes]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      {brandName && (
        <p className="text-xs text-luxury-gold tracking-[0.2em] uppercase">
          {brandName}
        </p>
      )}

      <h1 className="text-3xl md:text-4xl font-serif text-luxury-charcoal leading-tight">
        {product.name}
      </h1>

      <div className="flex items-center gap-3">
        <Rating value={product.rating} size="md" showText reviewCount={reviewCount} />
      </div>

      <div className="flex items-baseline gap-3">
        <span className="text-2xl font-serif text-luxury-charcoal">{formatPrice(unitPrice)}</span>
        {hasDiscount && original != null && (
          <>
            <span className="text-lg text-luxury-steel line-through">{formatPrice(original)}</span>
            <Badge variant="gold" size="sm">-{percent}%</Badge>
          </>
        )}
      </div>

      <p className="text-luxury-steel leading-relaxed text-[15px]">
        {product.shortDescription || product.description}
      </p>

      <div className="flex flex-wrap items-center gap-2">
        {product.isBestSeller && <Badge variant="gold">Bestseller</Badge>}
        {product.isNewArrival && <Badge variant="gold">New</Badge>}
        {inStock ? (
          <span className="flex items-center gap-1 text-xs text-luxury-green">
            <Check size={12} /> In Stock
          </span>
        ) : (
          <span className="text-xs text-luxury-red">Out of Stock</span>
        )}
      </div>

      {sizeOptions.length > 0 && (
        <div>
          <label className="block text-sm text-luxury-charcoal font-medium mb-3 tracking-wide">Size</label>
          <div className="flex flex-wrap gap-2">
            {sizeOptions.map((s) => (
              <button
                key={s.sku || s.size}
                type="button"
                disabled={s.stock === 0}
                onClick={() => setSelectedSize(s.size)}
                className={cn(
                  'min-w-[4.5rem] px-4 py-2.5 text-sm border transition-all duration-200',
                  selectedSize === s.size
                    ? 'border-luxury-ink bg-luxury-ink text-white'
                    : 'border-luxury-border text-luxury-steel hover:border-luxury-charcoal',
                  s.stock === 0 && 'opacity-40 cursor-not-allowed'
                )}
              >
                <span className="block">{s.size}</span>
                <span className="block text-[10px] mt-0.5 opacity-70">
                  {formatPrice(Number(s.price) || 0)}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm text-luxury-charcoal font-medium mb-3">Quantity</label>
        <QuantitySelector value={quantity} onChange={setQuantity} min={1} max={10} />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Button variant="primary" size="xl" className="flex-1" onClick={handleAddToCart} disabled={!inStock}>
          <ShoppingBag size={18} /> Add to Cart
        </Button>
        <Button variant="secondary" size="xl" className="flex-1" onClick={handleBuyNow} disabled={!inStock}>
          <Zap size={18} /> Buy Now
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={handleToggleWishlist}
          className={cn(
            'flex items-center gap-2 text-sm transition-colors',
            isWishlisted ? 'text-luxury-gold' : 'text-luxury-steel hover:text-luxury-charcoal'
          )}
        >
          <Heart size={16} className={isWishlisted ? 'fill-current' : ''} />
          {isWishlisted ? 'Saved' : 'Wishlist'}
        </button>
        <button
          type="button"
          onClick={handleShare}
          className="flex items-center gap-2 text-sm text-luxury-steel hover:text-luxury-charcoal transition-colors"
        >
          <Share2 size={16} /> Share
        </button>
      </div>
    </motion.div>
  );
}
