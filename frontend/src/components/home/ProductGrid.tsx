import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';
import SectionTitle from '../ui/SectionTitle';
import ProductCard from './ProductCard';
import type { Product } from '../../types';

interface ProductGridProps {
  title?: string;
  subtitle?: string;
  products?: Product[];
  className?: string;
  columns?: 2 | 3 | 4;
  viewAllLink?: string;
}

const defaultProducts = [
  { _id: '1', name: 'Midnight Oud', slug: 'midnight-oud', price: 185, discount: 16, discountedPrice: 185, images: ['https://placehold.co/600x800/FCFBF8/C9A96A?text=Midnight+Oud'], brand: { name: 'Maison Luxe' }, rating: 4.8, numReviews: 124, isBestSeller: true },
  { _id: '2', name: 'Rose Velvet', slug: 'rose-velvet', price: 245, discount: 0, discountedPrice: 245, images: ['https://placehold.co/600x800/FCFBF8/C9A96A?text=Rose+Velvet'], brand: { name: 'Fleur Noire' }, rating: 4.6, numReviews: 89, isNewArrival: true },
  { _id: '3', name: 'Amber Nights', slug: 'amber-nights', price: 165, discount: 15, discountedPrice: 165, images: ['https://placehold.co/600x800/FCFBF8/C9A96A?text=Amber+Nights'], brand: { name: 'Oriental Luxe' }, rating: 4.7, numReviews: 203 },
  { _id: '4', name: 'Citrus Breeze', slug: 'citrus-breeze', price: 125, discount: 0, discountedPrice: 125, images: ['https://placehold.co/600x800/FCFBF8/C9A96A?text=Citrus+Breeze'], brand: { name: 'Fresh Atelier' }, rating: 4.5, numReviews: 67 },
  { _id: '5', name: 'Sandalwood Dream', slug: 'sandalwood-dream', price: 210, discount: 0, discountedPrice: 210, images: ['https://placehold.co/600x800/FCFBF8/C9A96A?text=Sandalwood'], brand: { name: 'Wood & Co' }, rating: 4.9, numReviews: 156 },
  { _id: '6', name: 'Jasmine Petals', slug: 'jasmine-petals', price: 175, discount: 0, discountedPrice: 175, images: ['https://placehold.co/600x800/FCFBF8/C9A96A?text=Jasmine'], brand: { name: 'Fleur Noire' }, rating: 4.4, numReviews: 42 },
  { _id: '7', name: 'Oud Royale', slug: 'oud-royale', price: 320, discount: 20, discountedPrice: 320, images: ['https://placehold.co/600x800/FCFBF8/C9A96A?text=Oud+Royale'], brand: { name: 'Maison Luxe' }, rating: 4.9, numReviews: 88, isNewArrival: true },
  { _id: '8', name: 'Vanilla Bourbon', slug: 'vanilla-bourbon', price: 145, discount: 0, discountedPrice: 145, images: ['https://placehold.co/600x800/FCFBF8/C9A96A?text=Vanilla'], brand: { name: 'Sweet Notes' }, rating: 4.3, numReviews: 55 },
] as unknown as Product[];

const columnsMap = {
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-2 lg:grid-cols-3',
  4: 'sm:grid-cols-2 lg:grid-cols-4',
};

export default function ProductGrid({
  title,
  subtitle,
  products = defaultProducts,
  className,
  columns = 4,
  viewAllLink,
}: ProductGridProps) {
  return (
    <section className={cn('py-10 bg-luxury-cream', className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {title && <SectionTitle title={title} subtitle={subtitle} />}
        <div
          className={cn(
            'flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory min-w-0',
            'sm:pb-0 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:snap-none',
            columnsMap[columns]
          )}
        >
          {products.map((product, idx) => (
            <div
              key={product._id}
              className="min-w-[72%] snap-center flex-shrink-0 sm:min-w-0 sm:flex-shrink"
            >
              <ProductCard product={product} index={idx} />
            </div>
          ))}
        </div>
        {viewAllLink && (
          <div className="mt-10 text-center">
            <Link
              to={viewAllLink}
              className="inline-block border border-luxury-charcoal px-8 py-3 text-sm tracking-[0.2em] uppercase text-luxury-charcoal hover:bg-luxury-charcoal hover:text-luxury-gold transition-colors"
            >
              View All
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
