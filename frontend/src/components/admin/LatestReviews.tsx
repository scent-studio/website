import React from 'react';
import { motion } from 'framer-motion';
import { Check, X, Star } from 'lucide-react';
import { cn } from '../../lib/utils';
import { getInitials, formatDate } from '../../lib/utils';

interface Review {
  _id: string;
  user: { name: string; avatar?: string };
  rating: number;
  comment: string;
  createdAt: string;
  isApproved?: boolean;
}

interface LatestReviewsProps {
  reviews?: Review[];
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  className?: string;
}

const defaultReviews: Review[] = [
  { _id: '1', user: { name: 'Isabella R.' }, rating: 5, comment: 'Absolutely divine! The longevity is incredible.', createdAt: new Date().toISOString(), isApproved: false },
  { _id: '2', user: { name: 'James M.' }, rating: 4, comment: 'Sophisticated and unique scent profile.', createdAt: new Date(Date.now() - 86400000).toISOString(), isApproved: true },
  { _id: '3', user: { name: 'Sophie L.' }, rating: 5, comment: 'My new signature scent. Pure elegance.', createdAt: new Date(Date.now() - 172800000).toISOString(), isApproved: false },
  { _id: '4', user: { name: 'Alexander K.' }, rating: 4, comment: 'Impressive collection. Fast shipping.', createdAt: new Date(Date.now() - 259200000).toISOString(), isApproved: true },
];

export default function LatestReviews({ reviews = defaultReviews, onApprove, onReject, className }: LatestReviewsProps) {
  return (
    <div className={cn('border border-luxury-border', className)}>
      <div className="px-5 py-4 border-b border-luxury-border">
        <h3 className="text-sm font-display text-luxury-champagne tracking-wider uppercase">Latest Reviews</h3>
      </div>
      <div className="divide-y divide-white/5">
        {reviews.slice(0, 5).map((review) => (
          <div key={review._id} className="px-5 py-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 flex items-center justify-center bg-luxury-gold/10 border border-luxury-gold/20 text-luxury-gold text-xs font-medium">
                  {getInitials(review.user.name)}
                </div>
                <div>
                  <p className="text-sm text-luxury-charcoal font-medium">{review.user.name}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} size={10} className="text-luxury-gold fill-luxury-gold" />
                    ))}
                  </div>
                </div>
              </div>
              <span className="text-xs text-luxury-steel">{formatDate(review.createdAt, { month: 'short', day: 'numeric' })}</span>
            </div>
            <p className="mt-2 text-sm text-luxury-steel line-clamp-2">{review.comment}</p>
            {review.isApproved === false && (
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
        ))}
      </div>
    </div>
  );
}
