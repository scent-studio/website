import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { uploadService } from '../../services/uploadService';
import toast from 'react-hot-toast';

interface ImageFile {
  id: string;
  file?: File;
  preview: string;
  uploadedUrl?: string;
  uploading?: boolean;
}

interface ImageUploadProps {
  maxFiles?: number;
  onChange?: (urls: string[]) => void;
  initialUrls?: string[];
  className?: string;
}

export default function ImageUpload({ maxFiles = 5, onChange, initialUrls = [], className }: ImageUploadProps) {
  const [images, setImages] = useState<ImageFile[]>(
    initialUrls.map((url) => ({ id: url, preview: url, uploadedUrl: url }))
  );
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const notifyParent = (imgs: ImageFile[]) => {
    const urls = imgs.filter((i) => i.uploadedUrl).map((i) => i.uploadedUrl!);
    onChange?.(urls);
  };

  const uploadFiles = async (files: File[]) => {
    const newImages: ImageFile[] = files.map((file) => ({
      id: Math.random().toString(36).slice(2),
      file,
      preview: URL.createObjectURL(file),
      uploading: true,
    }));

    const updated = [...images, ...newImages];
    setImages(updated);

    try {
      const urls = await uploadService.uploadImages(files);
      const updatedWithUrls = updated.map((img, i) => {
        const urlIndex = newImages.findIndex((n) => n.id === img.id);
        if (urlIndex >= 0) {
          return { ...img, uploading: false, uploadedUrl: urls[urlIndex] };
        }
        return img;
      });
      setImages(updatedWithUrls);
      notifyParent(updatedWithUrls);
      toast.success(`${files.length} image(s) uploaded`);
    } catch {
      toast.error('Image upload failed');
      const failed = updated.filter((img) => !newImages.some((n) => n.id === img.id));
      setImages(failed);
      notifyParent(failed);
    }
  };

  const handleFiles = (fileList: FileList | File[]) => {
    const remaining = maxFiles - images.length;
    const fileArray = Array.from(fileList).slice(0, remaining);
    if (fileArray.length > 0) uploadFiles(fileArray);
  };

  const removeImage = (id: string) => {
    const updated = images.filter((img) => img.id !== id);
    setImages(updated);
    notifyParent(updated);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          'border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200',
          isDragging
            ? 'border-luxury-gold bg-luxury-gold/5'
            : 'border-luxury-border hover:border-luxury-gold/30'
        )}
      >
        <Upload size={32} className="mx-auto text-luxury-steel mb-3" />
        <p className="text-sm text-luxury-charcoal mb-1">
          Drop images here or click to browse
        </p>
        <p className="text-xs text-luxury-steel">
          PNG, JPG, WebP up to 5MB ({maxFiles - images.length} remaining)
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-4 md:grid-cols-5 gap-3">
          <AnimatePresence>
            {images.map((img) => (
              <motion.div
                key={img.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative group aspect-square border border-luxury-border overflow-hidden rounded-lg"
              >
                <img src={img.preview} alt="Upload" className="w-full h-full object-cover" />
                {img.uploading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="h-6 w-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                  <button
                    onClick={(e) => { e.stopPropagation(); removeImage(img.id); }}
                    className="h-8 w-8 flex items-center justify-center bg-red-500/80 text-white hover:bg-red-500 transition-colors rounded-lg"
                  >
                    <X size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
