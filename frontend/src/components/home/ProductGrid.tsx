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
  preferredSize?: string;
}

const columnsMap = {
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-2 lg:grid-cols-3',
  4: 'sm:grid-cols-2 lg:grid-cols-4',
};

export default function ProductGrid({
  title,
  subtitle,
  products = [],
  className,
  columns = 4,
  viewAllLink,
  preferredSize,
}: ProductGridProps) {
  if (!products.length) return null;

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
              <ProductCard product={product} index={idx} preferredSize={preferredSize} />
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
