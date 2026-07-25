import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ThumbsUp } from 'lucide-react';
import { cn, getInitials } from '../../lib/utils';
import Rating from '../ui/Rating';

interface ReviewCardProps {
  name: string;
  rating: number;
  date: string;
  comment: string;
  avatar?: string;
  isVerified?: boolean;
  helpfulCount?: number;
  images?: string[];
}

export default function ReviewCard({
  name,
  rating,
  date,
  comment,
  avatar,
  isVerified,
  helpfulCount = 0,
  images,
}: ReviewCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="p-5 bg-luxury-white rounded-xl shadow-soft"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {avatar ? (
            <img src={avatar} alt={name} className="h-10 w-10 object-cover rounded-lg border border-luxury-gold/20" />
          ) : (
            <div className="h-10 w-10 flex items-center justify-center bg-luxury-gold/10 border border-luxury-gold/20 text-luxury-gold text-sm font-medium rounded-lg">
              {getInitials(name)}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-luxury-charcoal">{name}</span>
              {isVerified && (
                <CheckCircle size={12} className="text-green-500" />
              )}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <Rating value={rating} size="sm" />
              <span className="text-xs text-luxury-steel">{date}</span>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-3 text-sm text-luxury-steel leading-relaxed">{comment}</p>

      {images && images.length > 0 && (
        <div className="flex gap-2 mt-3">
          {images.map((img, idx) => (
            <img key={idx} src={img} alt="Review" className="h-16 w-16 object-cover rounded-lg border border-luxury-border" />
          ))}
        </div>
      )}

      <div className="mt-3 flex items-center gap-2">
        <button className="flex items-center gap-1 text-xs text-luxury-steel hover:text-luxury-gold transition-colors">
          <ThumbsUp size={12} /> Helpful ({helpfulCount})
        </button>
      </div>
    </motion.div>
  );
}
