import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import SectionTitle from '../ui/SectionTitle';

const ease = [0.22, 1, 0.36, 1] as const;

interface HowToPickSectionProps {
  className?: string;
}

export default function HowToPickSection({ className }: HowToPickSectionProps) {
  return (
    <section className={cn('py-20 md:py-24 bg-luxury-cream', className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="How to Pick the Right Perfume"
          subtitle="A few thoughtful steps to finding a fragrance that feels unmistakably yours."
          align="center"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease }}
            className="order-2 lg:order-1"
          >
            <p className="text-base md:text-lg text-luxury-charcoal/80 font-sans leading-relaxed">
            Scent Studio 5ml Testers

Experience our premium fragrances in a convenient 5ml size before choosing your favorite. Crafted with the same high-quality fragrance oils as our full-size perfumes, these testers offer long-lasting performance in a compact, travel-friendly bottle. Perfect for discovering your signature scent or carrying it wherever you go.
            </p>

            {/* <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.2, ease }}
              className="mt-8"
            >
              <Link
                to="/products?category=tester-box"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 text-sm font-medium tracking-wide rounded-lg bg-luxury-gold text-luxury-charcoal hover:bg-luxury-charcoal hover:text-luxury-cream transition-all duration-300 shadow-sm"
              >
                Try Our Tester Box
                <ArrowRight size={16} />
              </Link>
            </motion.div> */}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease }}
            className="order-1 lg:order-2 relative"
          >
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-luxury-border bg-luxury-ivory shadow-card">
              <img
                src="/uploads/categories/tester.jpeg"
                alt="Curated perfume tester box"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-luxury-charcoal/20 via-transparent to-transparent" />
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.25, ease }}
              className="absolute -bottom-6 -left-6 hidden md:flex items-center gap-3 px-5 py-4 bg-luxury-white border border-luxury-border rounded-xl shadow-card"
            >
              <div className="h-10 w-10 rounded-full bg-luxury-gold/15 flex items-center justify-center">
                <span className="text-luxury-gold font-serif text-lg">★</span>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-luxury-steel">Trusted</p>
                <p className="text-sm font-serif text-luxury-charcoal">By 5,000+ Fragrance Lovers</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
