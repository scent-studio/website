import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import SectionTitle from '../ui/SectionTitle';
import Button from '../ui/Button';

const collections = [
  {
    name: 'Amber Oud',
    description: 'Warm, rich & deeply refined.',
    image: '/public/uploads/collections/amber-oud.png',
    link: '/shop?category=oriental',
    size: 'large',
  },
  {
    // name: 'Ocean Noir',
    // description: 'Intense. Sophisticated. Unforgettable.',
    image: '/public/uploads/collections/ocean-noir.png',
    link: '/shop?category=fresh',
    size: 'small',
  },
  {
    // name: 'Velvet Rouge',
    // description: 'A luxurious blend of passion and mystery.',
    image: '/public/uploads/collections/velvet-rouge.png',
    link: '/shop?category=floral',
    size: 'small',
  },
];

export default function FeaturedCollections() {
  return (
    <section className="py-20 bg-luxury-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Featured Collections"
          subtitle="Explore our carefully curated fragrance families, each telling its own unique story."
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {collections.map((collection, idx) => (
            <motion.div
              key={collection.name}
              initial={{ opacity: 0, y: 56, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: idx * 0.14, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                'relative group overflow-hidden rounded-xl',
                idx === 0 ? 'md:col-span-2 md:row-span-2' : ''
              )}
            >
              <div className="aspect-[4/5] md:aspect-auto md:h-full">
                <img
                  src={collection.image}
                  alt={collection.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <h3 className="text-xl md:text-2xl font-display text-white mb-2">
                  {collection.name}
                </h3>
                <p className="text-sm text-white/70 mb-4 max-w-xs">{collection.description}</p>
                <Link to={collection.link} >
                  <Button className='text-white' variant="outline" size="sm">
                    Shop Now
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
