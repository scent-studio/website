import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import { bannerService } from '../../services/bannerService';

interface Slide {
  image: string;
  alt: string;
  link: string;
}

// Shown only when no active hero banners exist in the admin panel (or the API is unreachable)
const fallbackSlides: Slide[] = [
  {
    image: '/uploads/hero-banners/banner-1.jpeg',
    alt: 'Scent Studio — Crafted for Every Moment',
    link: '/shop',
  },
  {
    image: '/uploads/hero-banners/banner-2.jpeg',
    alt: 'Scent Studio — Elevate Every Moment',
    link: '/shop',
  },
  {
    image: '/uploads/hero-banners/banner-3.jpeg',
    alt: 'Scent Studio — Discover Scents That Define You',
    link: '/shop',
  },
];

export default function HeroSlider() {
  const [slides, setSlides] = useState<Slide[] | null>(null);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    let mounted = true;
    bannerService
      .getActive('hero')
      .then((res) => {
        if (!mounted) return;
        const fromAdmin = (res.data || [])
          .filter((b) => b.image)
          .map((b) => ({ image: b.image, alt: b.title || 'Scent Studio', link: b.link || '/shop' }));
        setSlides(fromAdmin.length > 0 ? fromAdmin : fallbackSlides);
      })
      .catch(() => mounted && setSlides(fallbackSlides));
    return () => {
      mounted = false;
    };
  }, []);

  const count = slides?.length ?? 0;

  useEffect(() => {
    if (count < 2) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % count);
    }, 7000);
    return () => clearInterval(timer);
  }, [count]);

  // Reserve the hero's space while banners load, to avoid layout shift
  if (!slides) {
    return <section className="w-full bg-luxury-ink" style={{ aspectRatio: '16/7.5' }} aria-hidden="true" />;
  }

  const slide = slides[current] ?? slides[0];
  const isExternal = slide.link.startsWith('http://') || slide.link.startsWith('https://');

  return (
    <section className="relative w-full overflow-hidden bg-luxury-ink" style={{ aspectRatio: '16/7.5' }}>
      {(() => {
        const image = (
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.image + current}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              <img src={slide.image} alt={slide.alt} className="absolute inset-0 h-full w-full object-cover" />
            </motion.div>
          </AnimatePresence>
        );
        return isExternal ? (
          <a href={slide.link} className="absolute inset-0 z-0">{image}</a>
        ) : (
          <Link to={slide.link} className="absolute inset-0 z-0">{image}</Link>
        );
      })()}

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
