import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import SectionTitle from '../ui/SectionTitle';

const categories = [
  { name: 'Floral', slug: 'floral', image: '/public//uploads/categories/lamour-eclat.png', description: 'Elegant & Timeless' },
  { name: 'Oriental', slug: 'oriental', image: '/public//uploads/categories/harmonia.png', description: 'Warm & Sensual' },
  { name: 'Woody', slug: 'woody', image: '/public//uploads/categories/noir-intense.png', description: 'Bold & Confident' },
  { name: 'Fresh', slug: 'fresh', image: '/public//uploads/categories/oudh-blanc.png', description: 'Clean & Invigorating' },
  { name: 'Citrus', slug: 'citrus', image: '/public//uploads/categories/oudh-royale.png', description: 'Bright & Zesty' },
];

export default function CategoryShowcase() {
  return (
    <section className="py-20 bg-luxury-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Shop by Category"
          subtitle="Find your perfect fragrance family."
        />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 44, scale: 0.94 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: idx * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                to={`/shop?category=${cat.slug}`}
                className="group relative block aspect-[3/4] overflow-hidden rounded-xl"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
                  <h3 className="text-sm font-display text-white tracking-wider uppercase">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-white/70 mt-1">{cat.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
