import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Camera, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import Button from '../ui/Button';
import Textarea from '../ui/Textarea';
import Input from '../ui/Input';

interface ReviewFormProps {
  onSubmit?: (data: { title: string; comment: string; rating: number; images: string[] }) => void;
  className?: string;
}

export default function ReviewForm({ onSubmit, className }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const { uploadService } = await import('../../services/uploadService');
      const urls = await uploadService.uploadImages(Array.from(files).slice(0, 5 - images.length));
      setImages((prev) => [...prev, ...urls].slice(0, 5));
    } catch {
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;
    onSubmit?.({ title, comment, rating, images });
    setRating(0);
    setTitle('');
    setComment('');
    setImages([]);
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
        <label className="block text-sm text-luxury-charcoal mb-2">
          Rating <span className="text-red-500">*</span>
        </label>
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
                size={28}
                className={cn(
                  'transition-colors',
                  (hoverRating || rating) >= star
                    ? 'text-luxury-gold fill-luxury-gold'
                    : 'text-luxury-steel/30'
                )}
              />
            </button>
          ))}
          {rating > 0 && (
            <span className="ml-2 text-sm text-luxury-steel">{rating} of 5 stars</span>
          )}
        </div>
      </div>

      <Input
        label="Review Title"
        placeholder="What's most important to know?"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <Textarea
        label="Your Review"
        placeholder="Share your experience with this fragrance..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        showCount
        maxLength={2000}
        required
      />

      <div>
        <label className="block text-sm text-luxury-charcoal mb-2">Add Photos (optional)</label>
        <label className="block border-2 border-dashed border-luxury-border p-8 text-center hover:border-luxury-gold/30 transition-colors cursor-pointer rounded-lg">
          {uploading ? (
            <div className="h-6 w-6 mx-auto border-2 border-luxury-gold border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Camera size={24} className="mx-auto text-luxury-steel mb-2" />
              <p className="text-sm text-luxury-steel">Click to upload or drag and drop</p>
              <p className="text-xs text-luxury-steel/50 mt-1">Max 5 images, 5MB each</p>
            </>
          )}
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleImageUpload}
            disabled={uploading || images.length >= 5}
          />
        </label>
        {images.length > 0 && (
          <div className="grid grid-cols-5 gap-2 mt-3">
            {images.map((img, idx) => (
              <div key={idx} className="relative aspect-square border border-luxury-border overflow-hidden rounded-lg">
                <img src={img} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-1 right-1 h-5 w-5 flex items-center justify-center bg-red-500/80 text-white rounded-full"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Button type="submit" variant="primary" size="lg" disabled={rating === 0}>
        Submit Review
      </Button>
    </motion.form>
  );
}
