import React from 'react';
import { Link } from 'react-router-dom';
import { cn, formatPrice } from '../../lib/utils';

interface Product {
  _id: string;
  name: string;
  slug: string;
  totalSales: number;
  price: number;
  images: string[];
}

interface TopProductsProps {
  products?: Product[];
  className?: string;
}

export default function TopProducts({ products = [], className }: TopProductsProps) {
  const maxSold = products.length > 0 ? Math.max(...products.map((p) => p.totalSales)) : 1;

  return (
    <div className={cn('border border-luxury-border', className)}>
      <div className="flex items-center justify-between px-5 py-4 border-b border-luxury-border">
        <h3 className="text-sm font-display text-luxury-champagne tracking-wider uppercase">Top Products</h3>
        <Link to="/admin/products" className="text-xs text-luxury-gold hover:text-luxury-gold-light transition-colors">
          View All
        </Link>
      </div>
      <div className="p-5 space-y-4">
        {products.length > 0 ? products.map((product, idx) => (
          <div key={product._id} className="flex items-center gap-3">
            <span className="text-xs text-luxury-steel w-5 font-medium">{idx + 1}</span>
            <div className="h-10 w-10 flex-shrink-0 overflow-hidden border border-luxury-border">
              <img
                src={product.images?.[0] || 'https://placehold.co/40x40/1a1a1a/d4a853?text=P'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-luxury-charcoal truncate">{product.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 h-1.5 bg-luxury-ink">
                  <div
                    className="h-full bg-luxury-gold/60"
                    style={{ width: `${maxSold > 0 ? (product.totalSales / maxSold) * 100 : 0}%` }}
                  />
                </div>
                <span className="text-xs text-luxury-steel">{product.totalSales} sold</span>
              </div>
            </div>
            <span className="text-sm font-serif text-luxury-gold">{formatPrice(product.totalSales * product.price)}</span>
          </div>
        )) : (
          <div className="text-center py-6 text-sm text-luxury-steel">
            No product data yet
          </div>
        )}
      </div>
    </div>
  );
}
