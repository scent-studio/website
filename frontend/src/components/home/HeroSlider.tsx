import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';

const slides = [
  {
    image: '/uploads/hero-banners/slide-1.png',
    alt: 'Scent Studio — Crafted for Every Moment',
    link: '/shop',
  },
  {
    image: '/uploads/hero-banners/slide-2.png',
    alt: 'Scent Studio — Elevate Every Moment',
    link: '/shop',
  },
  {
    image: '/uploads/hero-banners/slide-3.png',
    alt: 'Scent Studio — Discover Scents That Define You',
    link: '/shop',
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[current];

  return (
    <section className="relative w-full overflow-hidden bg-luxury-ink" style={{ aspectRatio: '16/7.5' }}>
      <Link to={slide.link} className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <img
              src={slide.image}
              alt={slide.alt}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </motion.div>
        </AnimatePresence>
      </Link>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        {slides.map((_, idx) => (
          <button
            key={idx}
            type="button"
            aria-label={`Go to slide ${idx + 1}`}
            onClick={() => setCurrent(idx)}
            className={cn(
              'h-1.5 transition-all duration-300',
              idx === current ? 'w-10 bg-luxury-gold' : 'w-4 bg-white/40 hover:bg-white/70'
            )}
          />
        ))}
      </div>

      <button
        type="button"
        aria-label="Previous slide"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrent((c) => (c - 1 + slides.length) % slides.length); }}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 hidden md:flex h-11 w-11 items-center justify-center border border-white/30 text-white/80 hover:bg-white/10 transition-colors"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        type="button"
        aria-label="Next slide"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrent((c) => (c + 1) % slides.length); }}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 hidden md:flex h-11 w-11 items-center justify-center border border-white/30 text-white/80 hover:bg-white/10 transition-colors"
      >
        <ChevronRight size={20} />
      </button>
    </section>
  );
}
