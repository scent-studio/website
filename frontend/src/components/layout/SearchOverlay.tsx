import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, X, Clock, TrendingUp, ArrowRight, Sparkles, Command,
} from 'lucide-react';

const recentSearches = ['oud perfumes', 'rose fragrance', 'gift sets', 'unisex'];

const quickFilters = [
  { label: 'New Arrivals', path: '/new-arrivals' },
  { label: 'Best Sellers', path: '/best-sellers' },
  { label: 'Women', path: '/shop?gender=female' },
  { label: 'Men', path: '/shop?gender=male' },
  { label: 'Gift Sets', path: '/shop?giftSet=true' },
];

const suggestions = [
  {
    name: 'Midnight Oud',
    price: 'Rs. 37,000',
    note: 'Woody · Amber',
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=240&q=80',
  },
  {
    name: 'Rose Velvet',
    price: 'Rs. 49,000',
    note: 'Floral · Soft',
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=240&q=80',
  },
  {
    name: 'Amber Nights',
    price: 'Rs. 33,000',
    note: 'Oriental · Warm',
    image: 'https://images.unsplash.com/photo-1594035910387-fea477942556?auto=format&fit=crop&w=240&q=80',
  },
  {
    name: 'Citrus Breeze',
    price: 'Rs. 25,000',
    note: 'Fresh · Citrus',
    image: 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?auto=format&fit=crop&w=240&q=80',
  },
];

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const ease = [0.22, 1, 0.36, 1] as const;

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const filteredSuggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return suggestions;
    return suggestions.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.note.toLowerCase().includes(q)
    );
  }, [query]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 120);
      document.body.style.overflow = 'hidden';
    } else {
      setQuery('');
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  const submitSearch = () => {
    const q = query.trim();
    if (!q) return;
    onClose();
    navigate(`/shop?search=${encodeURIComponent(q)}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[12vh] md:pt-[14vh]"
          role="dialog"
          aria-modal="true"
          aria-label="Search"
        >
          <motion.button
            type="button"
            aria-label="Close search"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-luxury-ink/45 backdrop-blur-md"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, y: -24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.98 }}
            transition={{ duration: 0.35, ease }}
            className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-luxury-border/80 bg-luxury-white shadow-[0_24px_80px_rgba(28,28,28,0.22)]"
          >
            {/* Search field */}
            <div className="relative border-b border-luxury-border/80">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-luxury-gold/50 to-transparent" />
              <div className="flex items-center gap-3 px-4 py-3.5 sm:px-5 sm:py-4">
                <Search size={20} className="shrink-0 text-luxury-gold" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') submitSearch();
                  }}
                  placeholder="Search fragrances, notes, collections..."
                  className="min-w-0 flex-1 bg-transparent text-base sm:text-lg text-luxury-charcoal placeholder:text-luxury-steel/45 outline-none font-sans"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    className="rounded-full p-1.5 text-luxury-steel hover:bg-luxury-ivory hover:text-luxury-charcoal transition-colors"
                    aria-label="Clear search"
                  >
                    <X size={16} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-luxury-border bg-luxury-ivory/80 px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-luxury-steel hover:text-luxury-charcoal transition-colors"
                >
                  Esc
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="sm:hidden rounded-full p-1.5 text-luxury-steel hover:bg-luxury-ivory hover:text-luxury-charcoal transition-colors"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="max-h-[min(62vh,520px)] overflow-y-auto overscroll-contain">
              {!query && (
                <div className="p-4 sm:p-5 space-y-6">
                  {/* Quick filters */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05, duration: 0.35 }}
                  >
                    <div className="mb-3 flex items-center gap-2">
                      <Sparkles size={13} className="text-luxury-gold" />
                      <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-luxury-steel">
                        Quick explore
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {quickFilters.map((filter) => (
                        <Link
                          key={filter.label}
                          to={filter.path}
                          onClick={onClose}
                          className="rounded-full border border-luxury-border bg-luxury-ivory/60 px-3.5 py-1.5 text-xs text-luxury-charcoal/80 hover:border-luxury-gold/40 hover:bg-luxury-gold/10 hover:text-luxury-charcoal transition-all"
                        >
                          {filter.label}
                        </Link>
                      ))}
                    </div>
                  </motion.div>

                  {/* Recent */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.35 }}
                  >
                    <div className="mb-3 flex items-center gap-2">
                      <Clock size={13} className="text-luxury-steel" />
                      <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-luxury-steel">
                        Recent searches
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((term) => (
                        <button
                          key={term}
                          type="button"
                          onClick={() => setQuery(term)}
                          className="group inline-flex items-center gap-2 rounded-xl border border-luxury-border/80 bg-luxury-white px-3 py-2 text-sm text-luxury-charcoal/70 hover:border-luxury-gold/35 hover:text-luxury-charcoal transition-all"
                        >
                          <Search size={12} className="text-luxury-steel/50 group-hover:text-luxury-gold transition-colors" />
                          {term}
                        </button>
                      ))}
                    </div>
                  </motion.div>

                  {/* Popular */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.35 }}
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TrendingUp size={13} className="text-luxury-gold" />
                        <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-luxury-steel">
                          Popular right now
                        </h3>
                      </div>
                      <Link
                        to="/best-sellers"
                        onClick={onClose}
                        className="inline-flex items-center gap-1 text-[11px] text-luxury-gold-dark hover:text-luxury-charcoal transition-colors"
                      >
                        View all <ArrowRight size={12} />
                      </Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {suggestions.map((product, idx) => (
                        <motion.div
                          key={product.name}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.18 + idx * 0.05, duration: 0.35 }}
                        >
                          <Link
                            to="/shop"
                            onClick={onClose}
                            className="group flex items-center gap-3 rounded-xl border border-transparent p-2 hover:border-luxury-border hover:bg-luxury-ivory/70 transition-all"
                          >
                            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-luxury-ivory">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium text-luxury-charcoal group-hover:text-luxury-gold-dark transition-colors">
                                {product.name}
                              </p>
                              <p className="mt-0.5 text-[11px] text-luxury-steel">{product.note}</p>
                              <p className="mt-1 font-serif text-xs text-luxury-gold-dark">{product.price}</p>
                            </div>
                            <ArrowRight
                              size={14}
                              className="shrink-0 text-luxury-border opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-luxury-gold"
                            />
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              )}

              {query && (
                <div className="p-4 sm:p-5 space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm text-luxury-steel">
                      {filteredSuggestions.length > 0 ? (
                        <>
                          Results for{' '}
                          <span className="font-medium text-luxury-charcoal">&ldquo;{query}&rdquo;</span>
                        </>
                      ) : (
                        <>
                          No matches for{' '}
                          <span className="font-medium text-luxury-charcoal">&ldquo;{query}&rdquo;</span>
                        </>
                      )}
                    </p>
                    <button
                      type="button"
                      onClick={submitSearch}
                      className="inline-flex items-center gap-1.5 rounded-full bg-luxury-ink px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-wider text-white hover:bg-luxury-gold hover:text-luxury-charcoal transition-colors"
                    >
                      View all <ArrowRight size={12} />
                    </button>
                  </div>

                  {filteredSuggestions.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3">
                      {filteredSuggestions.map((product, idx) => (
                        <motion.div
                          key={product.name}
                          initial={{ opacity: 0, y: 14 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05, duration: 0.3 }}
                        >
                          <Link
                            to={`/shop?search=${encodeURIComponent(query.trim())}`}
                            onClick={onClose}
                            className="group block overflow-hidden rounded-xl border border-luxury-border bg-luxury-ivory/30 hover:border-luxury-gold/35 hover:shadow-card transition-all duration-300"
                          >
                            <div className="aspect-[4/5] overflow-hidden bg-luxury-ivory">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            </div>
                            <div className="p-3">
                              <p className="truncate text-sm font-medium text-luxury-charcoal group-hover:text-luxury-gold-dark transition-colors">
                                {product.name}
                              </p>
                              <p className="mt-0.5 text-[11px] text-luxury-steel">{product.note}</p>
                              <p className="mt-1.5 font-serif text-xs text-luxury-gold-dark">{product.price}</p>
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-xl border border-dashed border-luxury-border bg-luxury-ivory/40 px-6 py-10 text-center">
                      <Search size={22} className="mx-auto mb-3 text-luxury-steel/40" />
                      <p className="text-sm text-luxury-charcoal mb-1">Nothing matched that search</p>
                      <p className="text-xs text-luxury-steel mb-4">Try a note, brand, or browse the full shop</p>
                      <button
                        type="button"
                        onClick={submitSearch}
                        className="inline-flex items-center gap-1.5 text-sm text-luxury-gold-dark hover:text-luxury-charcoal transition-colors"
                      >
                        Search shop for &ldquo;{query}&rdquo; <ArrowRight size={14} />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer hint */}
            <div className="flex items-center justify-between border-t border-luxury-border/80 bg-luxury-ivory/50 px-4 py-2.5 sm:px-5">
              <p className="flex items-center gap-1.5 text-[11px] text-luxury-steel">
                <Command size={11} />
                Press <kbd className="rounded border border-luxury-border bg-luxury-white px-1.5 py-0.5 font-sans text-[10px]">Enter</kbd> to search shop
              </p>
              <p className="hidden sm:block text-[11px] text-luxury-steel/70">Scent Studio</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
