import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Droplets, Clock, Package, MapPin, Truck } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import ScrollReveal from '../components/ui/ScrollReveal';
import SectionTitle from '../components/ui/SectionTitle';

const values = [
  {
    icon: Sparkles,
    title: 'Premium-Inspired',
    description:
      'Fragrances inspired by some of the world\'s most loved perfumes, crafted to deliver a luxurious experience.',
  },
  {
    icon: Droplets,
    title: 'Quality Oils',
    description:
      'High-quality fragrance oils and carefully selected ingredients for an exceptional scent profile.',
  },
  {
    icon: Clock,
    title: 'Long-Lasting',
    description:
      'Excellent longevity with smooth projection that stays with you from morning to night.',
  },
  {
    icon: Package,
    title: 'Elegant Packaging',
    description:
      'Every bottle is designed with attention to detail, giving you a premium look and feel.',
  },
  {
    icon: MapPin,
    title: 'Made in Karachi',
    description:
      'Proudly crafted in Karachi, Pakistan — supporting local artistry and craftsmanship.',
  },
  {
    icon: Truck,
    title: 'Fast COD Delivery',
    description:
      'Nationwide delivery with Cash on Delivery available across Pakistan.',
  },
];

const collections = [
  {
    name: 'Fateh',
    inspired: 'Le Male Elixir',
    description: 'Our signature bestseller. A bold, fresh, and confident fragrance perfect for everyday wear.',
  },
  {
    name: 'Legacy',
    inspired: 'Office for Men',
    description: 'A clean, modern, and professional scent with excellent performance.',
  },
  {
    name: 'CEO',
    inspired: 'Signature Blend',
    description: 'A sophisticated fragrance made for those who want to leave a powerful first impression.',
  },
  {
    name: 'Shaheen',
    inspired: 'Signature Blend',
    description: 'Created with the spirit of ambition, freedom, and strength — a fragrance that represents confidence.',
  },
  {
    name: 'Scent Days',
    inspired: 'Khamrah',
    description: 'Warm notes of cinnamon, vanilla, amber, and spices for a rich, comforting experience.',
  },
  {
    name: 'Rosaria',
    inspired: 'Gucci Flora',
    description: 'A graceful floral fragrance perfect for those who love elegance and freshness.',
  },
  {
    name: 'Lush Euphoria',
    inspired: 'Fakhar',
    description: 'A vibrant feminine fragrance offering freshness with a soft floral touch.',
  },
];

export default function AboutPage() {
  useEffect(() => {
    document.title = 'About Scent Studio | Premium Fragrances Pakistan';
    return () => { document.title = 'Scent Studio | Premium Fragrances in Pakistan'; };
  }, []);

  return (
    <div>
      <PageHeader
        title="About Scent Studio"
        subtitle="Born in Karachi. Crafted for Pakistan."
        breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'About' }]}
      />

      {/* Philosophy */}
      <section className="py-20 md:py-24 bg-luxury-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <ScrollReveal variant="slideInLeft">
              <div>
                <SectionTitle title="Our Story" align="left" className="mb-8" />
                <p className="text-luxury-steel leading-relaxed mb-5 text-sm md:text-base">
                  Founded in May 2025, Scent Studio was created with one simple vision: to make
                  premium-inspired fragrances accessible without the premium price tag.
                </p>
                <p className="text-luxury-steel leading-relaxed mb-5 text-sm md:text-base">
                  Every fragrance we create is carefully blended using high-quality fragrance oils,
                  fine raw materials, and premium-grade ingredients to deliver an experience that
                  feels luxurious from the first spray to the final dry down.
                </p>
                <p className="text-luxury-steel leading-relaxed text-sm md:text-base">
                  We believe great perfume shouldn&apos;t cost a fortune. At Scent Studio, we focus
                  on creating fragrances with excellent longevity, smooth projection, and refined
                  scent profiles inspired by some of the world&apos;s most loved perfumes. Each
                  bottle is designed to give you confidence, elegance, and lasting memories.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal variant="slideInRight" delay={0.12}>
              <div className="relative max-w-md mx-auto lg:max-w-none">
                <div className="absolute -top-4 -left-4 w-24 h-24 border border-luxury-gold/25 rounded-2xl pointer-events-none" />
                <div className="absolute -bottom-4 -right-4 w-32 h-32 border border-luxury-gold/15 rounded-2xl pointer-events-none" />
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-luxury-border shadow-card bg-luxury-warm">
                  <img
                    src="https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=900&q=80"
                    alt="Scent Studio perfume craftsmanship"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-luxury-ink/35 via-transparent to-transparent" />
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 md:py-24 bg-luxury-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            title="Why Choose Scent Studio"
            subtitle="The principles that guide every bottle we create."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v, idx) => (
              <ScrollReveal key={v.title} delay={idx * 0.1} variant="scaleIn">
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.25 }}
                  className="h-full text-center p-8 rounded-xl bg-luxury-white border border-luxury-border hover:border-luxury-gold/40 transition-colors duration-300 shadow-card"
                >
                  <div className="inline-flex items-center justify-center h-16 w-16 rounded-xl border border-luxury-gold/30 text-luxury-gold mb-5 bg-luxury-gold/5">
                    <v.icon size={28} />
                  </div>
                  <h3 className="text-lg font-serif text-luxury-charcoal mb-3">{v.title}</h3>
                  <p className="text-sm text-luxury-steel leading-relaxed">{v.description}</p>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Collection */}
      <section className="py-20 md:py-24 bg-luxury-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            title="Our Collection"
            subtitle="Designed for every personality and occasion."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {collections.map((item, idx) => (
              <ScrollReveal key={item.name} delay={idx * 0.08} variant="scaleIn">
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.25 }}
                  className="h-full p-6 rounded-xl bg-luxury-white border border-luxury-border hover:border-luxury-gold/40 transition-colors duration-300 shadow-card"
                >
                  <div className="flex items-baseline gap-2 mb-2">
                    <h3 className="text-lg font-serif text-luxury-charcoal">{item.name}</h3>
                    <span className="text-[11px] text-luxury-gold tracking-wider uppercase">
                      {item.inspired}
                    </span>
                  </div>
                  <p className="text-sm text-luxury-steel leading-relaxed">{item.description}</p>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Promise */}
      <section className="py-20 md:py-24 bg-luxury-ivory">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <SectionTitle
              title="Our Promise"
              subtitle="Quality you can smell. Prices you can trust."
            />
            <p className="text-luxury-steel leading-relaxed text-sm md:text-base max-w-2xl mx-auto mt-6">
              Every bottle from Scent Studio is prepared with care, passion, and attention to quality.
              We never compromise on the materials we use because we believe every customer deserves
              a fragrance that looks premium, smells luxurious, and performs exceptionally.
            </p>
            <p className="text-luxury-steel leading-relaxed text-sm md:text-base max-w-2xl mx-auto mt-4">
              Whether you&apos;re buying your first perfume or growing your collection, Scent Studio
              is here to help you discover fragrances that match your style without exceeding your
              budget.
            </p>
            <div className="mt-10 inline-flex flex-col items-center gap-1 text-luxury-charcoal">
              <span className="font-serif text-xl tracking-wide">Scent Studio</span>
              <span className="text-xs text-luxury-steel tracking-[0.2em] uppercase">
                Born in Karachi &bull; Since May 2025
              </span>
              <span className="text-[11px] text-luxury-gold tracking-[0.15em] mt-1">
                Premium Fragrances. Budget Friendly. Unforgettable Impressions.
              </span>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
