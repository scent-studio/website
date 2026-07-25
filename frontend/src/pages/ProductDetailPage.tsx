import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ChevronRight, Home } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import { fetchProduct, fetchRelated, fetchProducts } from '../store/slices/productSlice';
import { productService } from '../services/productService';
import ProductGallery from '../components/product/ProductGallery';
import ProductInfo from '../components/product/ProductInfo';
import NotesPyramid from '../components/product/NotesPyramid';
import ProductTabs from '../components/product/ProductTabs';
import ReviewCard from '../components/product/ReviewCard';
import ReviewForm from '../components/product/ReviewForm';
import ProductCard from '../components/home/ProductCard';
import SectionTitle from '../components/ui/SectionTitle';
import Button from '../components/ui/Button';
import Loader from '../components/ui/Loader';
import ErrorState from '../components/ui/ErrorState';
import type { Review, Product } from '../types';
import { reviewService } from '../services/reviewService';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { product, related, loading, error } = useSelector(
    (state: RootState) => state.products
  );
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);

  useEffect(() => {
    if (slug) {
      dispatch(fetchProduct(slug));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [dispatch, slug]);

  useEffect(() => {
    if (product?._id) {
      dispatch(fetchRelated(product._id));
      const stored = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
      const updated = [product, ...stored.filter((p: Product) => p._id !== product._id)].slice(0, 4);
      localStorage.setItem('recentlyViewed', JSON.stringify(updated));
      setRecentlyViewed(updated);

      setReviewsLoading(true);
      reviewService.getProductReviews(product._id, { limit: 10 })
        .then((res) => setReviews(res.data as Review[]))
        .catch(() => {})
        .finally(() => setReviewsLoading(false));
    }
  }, [dispatch, product]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    if (stored.length > 0) setRecentlyViewed(stored);
  }, []);

  useEffect(() => {
    if (product) {
      document.title = `${product.name} - Scent Studio`;
      return () => { document.title = 'Scent Studio'; };
    }
  }, [product]);

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><Loader size="lg" text="Loading product..." /></div>;
  if (error) return <ErrorState message={error} onRetry={() => slug && dispatch(fetchProduct(slug))} />;
  if (!product) return <ErrorState title="Product not found" message="The product you're looking for doesn't exist." />;

  const brandName = typeof product.brand === 'object' ? (product.brand as any).name : product.brand;

  return (
    <div className="bg-luxury-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <nav className="flex items-center gap-1.5 text-sm mb-8">
          <Link to="/" className="text-luxury-steel hover:text-luxury-gold transition-colors"><Home size={14} /></Link>
          <ChevronRight size={12} className="text-luxury-steel/40" />
          <Link to="/shop" className="text-luxury-steel hover:text-luxury-gold transition-colors">Shop</Link>
          {brandName && (
            <>
              <ChevronRight size={12} className="text-luxury-steel/40" />
              <span className="text-luxury-steel">{brandName}</span>
            </>
          )}
          <ChevronRight size={12} className="text-luxury-steel/40" />
          <span className="text-luxury-gold-dark">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
          <ProductGallery images={product.images} productName={product.name} />
          <ProductInfo product={product} />
        </div>

        <div className="mb-16">
          <NotesPyramid
            top={product.topNotes}
            heart={product.middleNotes}
            base={product.baseNotes}
          />
        </div>

        <div className="mb-16">
          <ProductTabs description={product.description} />
        </div>

        <div className="mb-16">
          <SectionTitle title="Customer Reviews" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            <div className="space-y-4">
              {reviewsLoading ? (
                <Loader text="Loading reviews..." />
              ) : reviews.length === 0 ? (
                <p className="text-luxury-steel">No reviews yet. Be the first to review!</p>
              ) : (
                reviews.map((review) => (
                  <ReviewCard
                    key={review._id}
                    name={(review.user as any)?.name || 'Anonymous'}
                    rating={review.rating}
                    date={review.createdAt}
                    comment={review.comment}
                    isVerified={true}
                    helpfulCount={0}
                  />
                ))
              )}
            </div>
            <div className="bg-luxury-white rounded-xl shadow-soft p-6">
              <ReviewForm
                onSubmit={async (data) => {
                  try {
                    await reviewService.createReview({ product: product._id, ...data });
                    toast.success('Review submitted!');
                    const res = await reviewService.getProductReviews(product._id);
                    setReviews(res.data as Review[]);
                  } catch (err: any) {
                    toast.error(err?.response?.data?.message || 'Failed to submit review');
                  }
                }}
              />
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mb-16">
            <SectionTitle title="You May Also Like" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">
              {related.map((p, idx) => (
                <ProductCard key={p._id} product={p} index={idx} />
              ))}
            </div>
          </div>
        )}

        {recentlyViewed.length > 0 && (
          <div className="mb-16">
            <SectionTitle title="Recently Viewed" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">
              {recentlyViewed.map((p, idx) => (
                <ProductCard key={p._id} product={p} index={idx} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
