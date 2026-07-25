import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import Button from '../ui/Button';

interface FilterSection {
  id: string;
  label: string;
  options: { value: string; label: string; count?: number }[];
}

const filterSections: FilterSection[] = [
  {
    id: 'gender',
    label: 'Gender',
    options: [
      { value: 'female', label: 'Women' },
      { value: 'male', label: 'Men' },
      { value: 'unisex', label: 'Unisex' },
    ],
  },
  {
    id: 'size',
    label: 'Size',
    options: [
      { value: '30ml', label: '30 ml' },
      { value: '50ml', label: '50 ml' },
      { value: '100ml', label: '100 ml' },
    ],
  },
];

export interface FilterSidebarValues {
  gender: string[];
  size: string[];
  minPrice: string;
  maxPrice: string;
  inStock: boolean;
}

interface FilterSidebarProps {
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
  onApply?: (filters: FilterSidebarValues) => void;
  className?: string;
}

export default function FilterSidebar({ isMobileOpen, onMobileClose, onApply, className }: FilterSidebarProps) {
  const [expanded, setExpanded] = useState<string[]>(filterSections.map((s) => s.id));
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [inStock, setInStock] = useState(false);

  const toggleSection = (id: string) => {
    setExpanded((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const toggleFilter = (sectionId: string, value: string) => {
    setSelectedFilters((prev) => {
      const current = prev[sectionId] || [];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [sectionId]: updated };
    });
  };

  const clearAll = () => {
    setSelectedFilters({});
    setMinPrice('');
    setMaxPrice('');
    setInStock(false);
  };

  const handleApply = () => {
    onApply?.({
      gender: selectedFilters.gender || [],
      size: selectedFilters.size || [],
      minPrice,
      maxPrice,
      inStock,
    });
    onMobileClose?.();
  };

  const sidebarContent = (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-display text-luxury-charcoal tracking-wider uppercase">Filters</h3>
        <button onClick={clearAll} className="text-xs text-luxury-steel hover:text-luxury-gold transition-colors">
          Clear All
        </button>
      </div>

      <div>
        <h4 className="text-xs text-luxury-steel font-medium uppercase tracking-wider mb-3">Price Range</h4>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full px-3 py-2 bg-luxury-white border border-luxury-border text-luxury-charcoal text-sm outline-none focus:border-luxury-gold/50 transition-colors rounded-lg"
          />
          <span className="text-luxury-steel">to</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full px-3 py-2 bg-luxury-white border border-luxury-border text-luxury-charcoal text-sm outline-none focus:border-luxury-gold/50 transition-colors rounded-lg"
          />
        </div>
      </div>

      {filterSections.map((section) => (
        <div key={section.id}>
          <button
            onClick={() => toggleSection(section.id)}
            className="flex items-center justify-between w-full py-2 text-sm text-luxury-charcoal font-medium"
          >
            {section.label}
            <ChevronDown
              size={14}
              className={cn(
                'transition-transform duration-200',
                expanded.includes(section.id) && 'rotate-180'
              )}
            />
          </button>
          <AnimatePresence>
            {expanded.includes(section.id) && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-2 pb-1 space-y-2">
                  {section.options.map((option) => (
                    <label key={option.value} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={(selectedFilters[section.id] || []).includes(option.value)}
                        onChange={() => toggleFilter(section.id, option.value)}
                        className="w-4 h-4 bg-luxury-white border border-luxury-border checked:bg-luxury-gold checked:border-luxury-gold accent-luxury-gold rounded"
                      />
                      <span className="text-sm text-luxury-steel group-hover:text-luxury-charcoal transition-colors">
                        {option.label}
                      </span>
                      {option.count !== undefined && (
                        <span className="text-xs text-luxury-steel/50 ml-auto">({option.count})</span>
                      )}
                    </label>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}

      <div>
        <h4 className="text-xs text-luxury-steel font-medium uppercase tracking-wider mb-3">Availability</h4>
        <label className="flex items-center gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={inStock}
            onChange={(e) => setInStock(e.target.checked)}
            className="w-4 h-4 bg-luxury-white border border-luxury-border checked:bg-luxury-gold checked:border-luxury-gold accent-luxury-gold rounded"
          />
          <span className="text-sm text-luxury-steel group-hover:text-luxury-charcoal transition-colors">In Stock Only</span>
        </label>
      </div>

      <Button variant="primary" size="lg" className="w-full" onClick={handleApply}>
        Apply Filters
      </Button>
    </div>
  );

  return (
    <>
      <div className={cn('hidden md:block w-64 flex-shrink-0', className)}>
        <div className="bg-luxury-white rounded-xl border border-luxury-border p-6 shadow-soft">
          {sidebarContent}
        </div>
      </div>

      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
              onClick={onMobileClose}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-72 bg-luxury-cream border-r border-luxury-border z-50 overflow-y-auto p-5 md:hidden"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-display text-luxury-charcoal tracking-wider uppercase">Filters</h3>
                <button onClick={onMobileClose} className="text-luxury-steel hover:text-luxury-gold">
                  <X size={18} />
                </button>
              </div>
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
