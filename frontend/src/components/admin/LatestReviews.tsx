import React from 'react';
import { motion } from 'framer-motion';
import { Check, X, Star } from 'lucide-react';
import { cn } from '../../lib/utils';
import { getInitials, formatDate } from '../../lib/utils';

interface Review {
  _id: string;
  user: { name: string; avatar?: string };
  product: { name: string; slug: string };
  rating: number;
  title?: string;
  comment: string;
  isApproved: boolean;
  createdAt: string;
}

interface LatestReviewsProps {
  reviews?: Review[];
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  className?: string;
}

export default function LatestReviews({ reviews = [], onApprove, onReject, className }: LatestReviewsProps) {
  return (
    <div className={cn('border border-luxury-border', className)}>
      <div className="px-5 py-4 border-b border-luxury-border">
        <h3 className="text-sm font-display text-luxury-champagne tracking-wider uppercase">Latest Reviews</h3>
      </div>
      <div className="divide-y divide-white/5">
        {reviews.length > 0 ? reviews.map((review) => (
          <div key={review._id} className="px-5 py-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 flex items-center justify-center bg-luxury-gold/10 border border-luxury-gold/20 text-luxury-gold text-xs font-medium">
                  {getInitials(review.user?.name || 'U')}
                </div>
                <div>
                  <p className="text-sm text-luxury-charcoal font-medium">{review.user?.name || 'Anonymous'}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} size={10} className="text-luxury-gold fill-luxury-gold" />
                    ))}
                    <span className="text-xs text-luxury-steel ml-1">for {review.product?.name}</span>
                  </div>
                </div>
              </div>
              <span className="text-xs text-luxury-steel">{formatDate(review.createdAt, { month: 'short', day: 'numeric' })}</span>
            </div>
            {review.title && <p className="mt-2 text-sm text-luxury-charcoal font-medium">{review.title}</p>}
            <p className="mt-1 text-sm text-luxury-steel line-clamp-2">{review.comment}</p>
            {!review.isApproved && (
              <div className="flex items-center gap-2 mt-3">
                <button
                  onClick={() => onApprove?.(review._id)}
                  className="flex items-center gap-1 text-xs text-green-400 hover:text-green-300 transition-colors"
                >
                  <Check size={12} /> Approve
                </button>
                <button
                  onClick={() => onReject?.(review._id)}
                  className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors"
                >
                  <X size={12} /> Reject
                </button>
              </div>
            )}
          </div>
        )) : (
          <div className="px-5 py-8 text-center text-sm text-luxury-steel">
            No reviews yet
          </div>
        )}
      </div>
    </div>
  );
}
