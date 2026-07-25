import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface ProductGalleryProps {
  images?: string[];
  productName?: string;
}

const defaultImages = [
  'https://placehold.co/800x1000/1a1a1a/d4a853?text=Product+Front',
  'https://placehold.co/800x1000/1a1a1a/d4a853?text=Product+Side',
  'https://placehold.co/800x1000/1a1a1a/d4a853?text=Product+Back',
  'https://placehold.co/800x1000/1a1a1a/d4a853?text=Product+Detail',
];

export default function ProductGallery({ images = defaultImages, productName = 'Product' }: ProductGalleryProps) {
  const [selected, setSelected] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!zoomed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[80px_1fr] gap-4">
      <div className="flex md:flex-col gap-2 order-2 md:order-1">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setSelected(idx)}
            className={cn(
              'w-16 h-20 md:w-full md:h-20 flex-shrink-0 border-2 rounded-lg transition-all duration-200 overflow-hidden',
              selected === idx
                ? 'border-luxury-gold'
                : 'border-luxury-border hover:border-luxury-gold/50'
            )}
          >
            <img
              src={img}
              alt={`${productName} ${idx + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>

      <div
        className="relative overflow-hidden cursor-crosshair order-1 md:order-2"
        onMouseEnter={() => setZoomed(true)}
        onMouseLeave={() => setZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        <div className="aspect-[4/5] overflow-hidden rounded-xl shadow-soft bg-luxury-white">
          <motion.img
            key={selected}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            src={images[selected]}
            alt={productName}
            className={cn(
              'w-full h-full object-cover transition-transform duration-200',
              zoomed && 'scale-150'
            )}
            style={
              zoomed
                ? { transformOrigin: `${mousePos.x}% ${mousePos.y}%` }
                : undefined
            }
          />
        </div>

        <div className="absolute bottom-3 right-3">
          <div className="flex gap-1">
            {images.map((_, idx) => (
              <span
                key={idx}
                className={cn(
                  'h-1.5 transition-all duration-300',
                  idx === selected ? 'w-6 bg-luxury-gold' : 'w-1.5 bg-luxury-border'
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
