import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Camera } from 'lucide-react';
import { cn } from '../../lib/utils';
import Button from '../ui/Button';
import Textarea from '../ui/Textarea';
import Input from '../ui/Input';

interface ReviewFormProps {
  onSubmit?: (data: { title: string; comment: string; rating: number }) => void;
  className?: string;
}

export default function ReviewForm({ onSubmit, className }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.({ title, comment, rating });
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className={cn('space-y-5', className)}
    >
      <h3 className="text-lg font-serif text-luxury-charcoal">Write a Review</h3>

      <div>
        <label className="block text-sm text-luxury-charcoal mb-2">Rating</label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-0.5"
            >
              <Star
                size={24}
                className={cn(
                  'transition-colors',
                  (hoverRating || rating) >= star
                    ? 'text-luxury-gold fill-luxury-gold'
                    : 'text-luxury-steel/30'
                )}
              />
            </button>
          ))}
        </div>
      </div>

      <Input
        label="Review Title"
        placeholder="What's most important to know?"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <Textarea
        label="Your Review"
        placeholder="Share your experience with this fragrance..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        showCount
        maxLength={2000}
      />

      <div>
        <label className="block text-sm text-luxury-charcoal mb-2">Add Photos (optional)</label>
        <div className="border-2 border-dashed border-luxury-border p-8 text-center hover:border-luxury-gold/30 transition-colors cursor-pointer rounded-lg">
          <Camera size={24} className="mx-auto text-luxury-steel mb-2" />
          <p className="text-sm text-luxury-steel">Click to upload or drag and drop</p>
          <p className="text-xs text-luxury-steel/50 mt-1">Max 5 images, 5MB each</p>
        </div>
      </div>

      <Button type="submit" variant="primary" size="lg">
        Submit Review
      </Button>
    </motion.form>
  );
}
