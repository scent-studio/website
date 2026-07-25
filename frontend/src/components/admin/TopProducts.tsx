import React from 'react';
import { Link } from 'react-router-dom';
import { cn, formatPrice } from '../../lib/utils';

interface Product {
  _id: string;
  name: string;
  image?: string;
  soldCount: number;
  revenue: number;
}

interface TopProductsProps {
  products?: Product[];
  className?: string;
}

const defaultProducts: Product[] = [
  { _id: '1', name: 'Midnight Oud', image: 'https://placehold.co/40x40/1a1a1a/d4a853?text=P', soldCount: 342, revenue: 63270 },
  { _id: '2', name: 'Rose Velvet', image: 'https://placehold.co/40x40/1a1a1a/d4a853?text=P', soldCount: 289, revenue: 70805 },
  { _id: '3', name: 'Amber Nights', image: 'https://placehold.co/40x40/1a1a1a/d4a853?text=P', soldCount: 256, revenue: 42240 },
  { _id: '4', name: 'Oud Royale', image: 'https://placehold.co/40x40/1a1a1a/d4a853?text=P', soldCount: 198, revenue: 63360 },
  { _id: '5', name: 'Sandalwood Dream', image: 'https://placehold.co/40x40/1a1a1a/d4a853?text=P', soldCount: 167, revenue: 35070 },
];

export default function TopProducts({ products = defaultProducts, className }: TopProductsProps) {
  const maxSold = Math.max(...products.map((p) => p.soldCount));

  return (
    <div className={cn('border border-luxury-border', className)}>
      <div className="flex items-center justify-between px-5 py-4 border-b border-luxury-border">
        <h3 className="text-sm font-display text-luxury-champagne tracking-wider uppercase">Top Products</h3>
        <Link to="/admin/products" className="text-xs text-luxury-gold hover:text-luxury-gold-light transition-colors">
          View All
        </Link>
      </div>
      <div className="p-5 space-y-4">
        {products.map((product, idx) => (
          <div key={product._id} className="flex items-center gap-3">
            <span className="text-xs text-luxury-steel w-5 font-medium">{idx + 1}</span>
            <div className="h-10 w-10 flex-shrink-0 overflow-hidden border border-luxury-border">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-luxury-charcoal truncate">{product.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 h-1.5 bg-luxury-ink">
                  <div
                    className="h-full bg-luxury-gold/60"
                    style={{ width: `${(product.soldCount / maxSold) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-luxury-steel">{product.soldCount}</span>
              </div>
            </div>
            <span className="text-sm font-serif text-luxury-gold">{formatPrice(product.revenue)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
