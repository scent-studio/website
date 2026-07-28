import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ActiveFilter {
  key: string;
  label: string;
  param: string;
}

interface ActiveFiltersProps {
  className?: string;
}

const genderLabels: Record<string, string> = { female: 'Women', male: 'Men', unisex: 'Unisex' };

export default function ActiveFilters({ className }: ActiveFiltersProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters: ActiveFilter[] = [];
  const gender = searchParams.get('gender');
  if (gender) {
    gender.split(',').filter(Boolean).forEach((g) => {
      filters.push({ key: `gender-${g}`, label: genderLabels[g] || g, param: 'gender' });
    });
  }
  const category = searchParams.get('category');
  if (category) {
    category.split(',').filter(Boolean).forEach((c) => {
      filters.push({ key: `category-${c}`, label: c.charAt(0).toUpperCase() + c.slice(1), param: 'category' });
    });
  }
  const brand = searchParams.get('brand');
  if (brand) {
    brand.split(',').filter(Boolean).forEach((b) => {
      filters.push({ key: `brand-${b}`, label: b.charAt(0).toUpperCase() + b.slice(1), param: 'brand' });
    });
  }
  const size = searchParams.get('size');
  if (size) {
    size.split(',').filter(Boolean).forEach((s) => {
      filters.push({ key: `size-${s}`, label: s, param: 'size' });
    });
  }
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  if (minPrice || maxPrice) {
    filters.push({
      key: 'price',
      label: `Rs. ${minPrice || '0'} - Rs. ${maxPrice || '∞'}`,
      param: 'price',
    });
  }
  const inStock = searchParams.get('inStock');
  if (inStock === 'true') {
    filters.push({ key: 'inStock', label: 'In Stock Only', param: 'inStock' });
  }

  if (filters.length === 0) return null;

  const handleRemove = (filter: ActiveFilter) => {
    const params = new URLSearchParams(searchParams);
    if (filter.param === 'price') {
      params.delete('minPrice');
      params.delete('maxPrice');
    } else {
      const current = params.get(filter.param);
      if (current) {
        const values = current.split(',').filter(Boolean);
        const filterValue = filter.key.split('-').slice(1).join('-');
        const updated = values.filter((v) => v !== filterValue);
        if (updated.length > 0) {
          params.set(filter.param, updated.join(','));
        } else {
          params.delete(filter.param);
        }
      }
    }
    params.set('page', '1');
    setSearchParams(params);
  };

  const handleClearAll = () => {
    const params = new URLSearchParams(searchParams);
    ['gender', 'category', 'brand', 'size', 'minPrice', 'maxPrice', 'inStock'].forEach((key) => {
      params.delete(key);
    });
    params.set('page', '1');
    setSearchParams(params);
  };

  return (
    <div className={cn('flex items-center flex-wrap gap-2', className)}>
      <span className="text-xs text-luxury-steel mr-1">Active Filters:</span>
      {filters.map((filter) => (
        <span
          key={filter.key}
          className="inline-flex items-center gap-1.5 px-3 py-1 text-xs bg-luxury-gold/10 text-luxury-gold border border-luxury-gold/20 rounded-full"
        >
          {filter.label}
          <button
            onClick={() => handleRemove(filter)}
            className="hover:text-luxury-gold-light transition-colors"
          >
            <X size={12} />
          </button>
        </span>
      ))}
      {filters.length > 1 && (
        <button
          onClick={handleClearAll}
          className="text-xs text-luxury-steel hover:text-luxury-gold transition-colors ml-1"
        >
          Clear All
        </button>
      )}
    </div>
  );
}
