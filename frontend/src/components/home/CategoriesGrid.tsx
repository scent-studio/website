import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import SectionTitle from '../ui/SectionTitle';

type Category = {
  name: string;
  href: string;
  image: string;
  description: string;
};

const categories: Category[] = [
  {
    name: 'New Arrivals',
    href: '/shop?sort=newest',
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&h=800&fit=crop',
    description: 'Freshly curated scents',
  },
  {
    name: 'Men',
    href: '/shop?gender=male',
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&h=800&fit=crop',
    description: 'Bold & masculine',
  },
  {
    name: 'Women',
    href: '/shop?gender=female',
    image: 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=800&h=800&fit=crop',
    description: 'Elegant & radiant',
  },
  {
    name: 'Unisex',
    href: '/shop?gender=unisex',
    image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&h=800&fit=crop',
    description: 'For every moment',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (idx: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: idx * 0.1,
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
};

export default function CategoriesGrid() {
  return (
    <section className="py-10 bg-luxury-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Shop the Best Perfumes"
          subtitle="Browse Our Collections"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mt-12">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.name}
              custom={idx}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={cardVariants}
            >
              <Link
                to={cat.href}
                className={cn(
                  'group relative block aspect-square overflow-hidden rounded-2xl',
                  'border border-luxury-border bg-luxury-cream',
                  'shadow-soft hover:shadow-card-hover transition-shadow duration-500'
                )}
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-luxury-charcoal/80 via-luxury-charcoal/20 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100" />

                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 flex items-end justify-between">
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-display text-white tracking-wider">
                      {cat.name}
                    </h3>
                    <p className="text-sm text-luxury-gold/90 mt-2 font-light tracking-wide">
                      {cat.description}
                    </p>
                  </div>

                  <span
                    aria-hidden="true"
                    className="hidden sm:inline-flex items-center justify-center w-10 h-10 rounded-full border border-luxury-gold/40 text-luxury-gold transition-all duration-500 group-hover:bg-luxury-gold group-hover:text-luxury-charcoal group-hover:border-luxury-gold translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                  >
                    &rarr;
                  </span>
                </div>

                <span className="absolute top-5 left-5 inline-block w-8 h-px bg-luxury-gold/60 transition-all duration-500 group-hover:w-16" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
