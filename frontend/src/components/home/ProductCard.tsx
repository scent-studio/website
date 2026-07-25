import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { cn, formatPrice, getDisplayPrice } from '../../lib/utils';
import { addToLocalCart } from '../../lib/cartStorage';
import {
  addToLocalWishlist,
  isInLocalWishlist,
  onWishlistChange,
  toggleLocalWishlist,
} from '../../lib/wishlistStorage';
import { addToWishlist, removeFromWishlist } from '../../store/slices/wishlistSlice';
import type { RootState, AppDispatch } from '../../store';
import Rating from '../ui/Rating';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import type { Product } from '../../types';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product | {
    _id: string;
    name: string;
    slug: string;
    price: number;
    discount?: number;
    discountedPrice?: number;
    images: string[];
    brand?: { name: string } | string;
    rating: number;
    numReviews?: number;
    reviewCount?: number;
    isNewArrival?: boolean;
    isBestSeller?: boolean;
    sizes?: { size: string; price: number; stock: number; sku: string }[];
  };
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const [isWishlisted, setIsWishlisted] = useState(() => isInLocalWishlist(product._id));
  const [isHovered, setIsHovered] = useState(false);
  const { price, original, hasDiscount, percent } = getDisplayPrice(product as Product);
  const brandName = typeof product.brand === 'object' ? product.brand?.name : product.brand;
  const reviews = (product as Product).numReviews ?? (product as any).reviewCount ?? 0;
  const image = product.images?.[0] || '/placeholder-perfume.jpg';

  useEffect(() => {
    const sync = () => setIsWishlisted(isInLocalWishlist(product._id));
    sync();
    return onWishlistChange(sync);
  }, [product._id]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const sizes = (product as Product).sizes;
    const defaultSize = sizes?.[0]?.size || '100ml';
    try {
      addToLocalCart(product as Product, 1, defaultSize);
      toast.success('Added to cart');
    } catch {
      toast.error('Could not add to cart');
    }
  };

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isAuthenticated) {
      try {
        if (isWishlisted) {
          await dispatch(removeFromWishlist(product._id)).unwrap();
          toast.success('Removed from wishlist');
        } else {
          await dispatch(addToWishlist(product._id)).unwrap();
          addToLocalWishlist(product as Product);
          toast.success('Added to wishlist');
        }
      } catch {
        const nowIn = toggleLocalWishlist(product as Product);
        toast.success(nowIn ? 'Added to wishlist' : 'Removed from wishlist');
      }
      return;
    }

    const nowIn = toggleLocalWishlist(product as Product);
    toast.success(nowIn ? 'Added to wishlist' : 'Removed from wishlist');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ delay: Math.min(index * 0.08, 0.4), duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative"
    >
      <div className="relative overflow-hidden bg-luxury-warm">
        <Link to={`/product/${product.slug}`}>
          <div className="aspect-[3/4] overflow-hidden">
            <img
              src={image}
              alt={product.name}
              loading="lazy"
              className={cn(
                'w-full h-full object-cover transition-transform duration-700',
                isHovered && 'scale-105'
              )}
            />
          </div>
        </Link>

        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isNewArrival && <Badge variant="gold" size="sm">New</Badge>}
          {product.isBestSeller && <Badge variant="gold" size="sm">Bestseller</Badge>}
          {hasDiscount && <Badge variant="gold" size="sm">-{percent}%</Badge>}
        </div>

        <button
          type="button"
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          onClick={handleToggleWishlist}
          className={cn(
            'absolute top-3 right-3 h-9 w-9 flex items-center justify-center transition-all duration-300 z-10',
            isWishlisted
              ? 'bg-luxury-ink text-luxury-gold'
              : 'bg-luxury-white/90 text-luxury-steel hover:text-luxury-charcoal'
          )}
        >
          <Heart size={15} className={isWishlisted ? 'fill-current' : ''} />
        </button>

        <motion.div
          initial={false}
          animate={{ y: isHovered ? 0 : 72 }}
          transition={{ duration: 0.28 }}
          className="absolute bottom-0 left-0 right-0 p-3 bg-luxury-white/95 backdrop-blur-sm"
        >
          <div className="flex gap-2">
            <Button variant="primary" size="sm" className="flex-1 text-xs" onClick={handleAddToCart}>
              <ShoppingBag size={14} /> Add to Cart
            </Button>
            <Link to={`/product/${product.slug}`}>
              <Button variant="outline" size="sm" className="px-3">
                <Eye size={14} />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>

      <div className="pt-4 pb-2">
        {brandName && (
          <p className="text-[11px] text-luxury-steel tracking-[0.18em] uppercase mb-1">{brandName}</p>
        )}
        <Link to={`/product/${product.slug}`}>
          <h3 className="font-serif text-lg text-luxury-charcoal leading-snug hover:text-luxury-gold-dark transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-2 mt-1.5">
          <Rating value={product.rating} size="sm" />
          <span className="text-xs text-luxury-steel">({reviews})</span>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-base font-medium text-luxury-charcoal">
            {formatPrice(price)}
          </span>
          {hasDiscount && original != null && (
            <span className="text-sm text-luxury-steel/70 line-through">
              {formatPrice(original)}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
