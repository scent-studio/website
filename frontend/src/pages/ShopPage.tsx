import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, X } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import { fetchProducts, setPage, setSort, setFilters, clearFilters } from '../store/slices/productSlice';
import type { SortOption, FilterState } from '../types';
import PageHeader from '../components/layout/PageHeader';
import FilterSidebar, { type FilterSidebarValues } from '../components/shop/FilterSidebar';
import ActiveFilters from '../components/shop/ActiveFilters';
import ProductSort from '../components/shop/ProductSort';
import ProductCard from '../components/home/ProductCard';
import Pagination from '../components/ui/Pagination';
import Loader from '../components/ui/Loader';
import EmptyState from '../components/ui/EmptyState';
import ErrorState from '../components/ui/ErrorState';
import Button from '../components/ui/Button';
import { useDebounce } from '../hooks/useDebounce';
import { Search } from 'lucide-react';

export default function ShopPage() {
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, loading, error, pagination } = useSelector(
    (state: RootState) => state.products
  );
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
  const debouncedSearch = useDebounce(searchInput, 500);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const currentSort = (searchParams.get('sort') as SortOption) || 'newest';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const currentSearch = searchParams.get('search') || '';

  useEffect(() => {
    const params: any = { page: currentPage, sort: currentSort };
    if (currentSearch) params.search = currentSearch;
    const filters: Partial<FilterState> = {};
    const cat = searchParams.get('category');
    if (cat) filters.categories = cat.split(',').filter(Boolean);
    const gender = searchParams.get('gender');
    if (gender) filters.gender = gender.split(',').filter(Boolean);
    const brand = searchParams.get('brand');
    if (brand) filters.brands = brand.split(',').filter(Boolean);
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    if (minPrice || maxPrice) {
      filters.priceRange = [Number(minPrice) || 0, Number(maxPrice) || 100000];
    }
    const inStock = searchParams.get('inStock');
    if (inStock === 'true') filters.inStock = true;
    const size = searchParams.get('size');
    if (size) filters.sizes = size.split(',').filter(Boolean);
    if (Object.keys(filters).length) params.filters = filters;
    dispatch(fetchProducts(params));
  }, [dispatch, currentPage, currentSort, currentSearch, searchParams]);

  useEffect(() => {
    if (debouncedSearch !== currentSearch) {
      const params = new URLSearchParams(searchParams);
      if (debouncedSearch) {
        params.set('search', debouncedSearch);
      } else {
        params.delete('search');
      }
      params.set('page', '1');
      setSearchParams(params);
    }
  }, [debouncedSearch]);

  const handleSort = useCallback((sort: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('sort', sort);
    params.set('page', '1');
    setSearchParams(params);
    dispatch(setSort(sort as SortOption));
  }, [dispatch, searchParams, setSearchParams]);

  const handlePageChange = useCallback((page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', String(page));
    setSearchParams(params);
    dispatch(setPage(page));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [dispatch, searchParams, setSearchParams]);

  const handleApplyFilters = useCallback((filters: FilterSidebarValues) => {
    const params = new URLSearchParams(searchParams);
    if (filters.gender.length) {
      params.set('gender', filters.gender.join(','));
    } else {
      params.delete('gender');
    }
    if (filters.size.length) {
      params.set('size', filters.size.join(','));
    } else {
      params.delete('size');
    }
    if (filters.minPrice) {
      params.set('minPrice', filters.minPrice);
    } else {
      params.delete('minPrice');
    }
    if (filters.maxPrice) {
      params.set('maxPrice', filters.maxPrice);
    } else {
      params.delete('maxPrice');
    }
    if (filters.inStock) {
      params.set('inStock', 'true');
    } else {
      params.delete('inStock');
    }
    params.set('page', '1');
    setSearchParams(params);
  }, [searchParams, setSearchParams]);

  return (
    <div>
      <PageHeader
        title="Shop"
        subtitle="Discover your signature scent from our curated collection"
        breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Shop' }]}
      />

      <section className="py-12 bg-luxury-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            <FilterSidebar
              isMobileOpen={mobileFilterOpen}
              onMobileClose={() => setMobileFilterOpen(false)}
              onApply={handleApplyFilters}
            />

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-luxury-steel" />
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Search fragrances..."
                    className="w-full pl-10 pr-4 py-2.5 bg-luxury-white border border-luxury-border text-luxury-charcoal placeholder:text-luxury-steel/40 text-sm outline-none focus:border-luxury-gold/50 transition-colors rounded-lg"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="md:hidden flex items-center gap-2"
                  onClick={() => setMobileFilterOpen(true)}
                >
                  <SlidersHorizontal size={16} />
                  Filters
                </Button>
                <ProductSort value={currentSort} onChange={handleSort} totalResults={pagination.total} />
              </div>

              <ActiveFilters />

              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="bg-luxury-white rounded-lg border border-luxury-border p-4 animate-pulse">
                      <div className="aspect-[3/4] bg-luxury-border rounded-md mb-4" />
                      <div className="h-4 bg-luxury-border/60 w-3/4 rounded mb-2" />
                      <div className="h-3 bg-luxury-border/60 w-1/2 rounded mb-2" />
                      <div className="h-4 bg-luxury-border/60 w-1/3 rounded" />
                    </div>
                  ))}
                </div>
              ) : error ? (
                <ErrorState
                  message={error}
                  onRetry={() => dispatch(fetchProducts({ page: currentPage, sort: currentSort }))}
                />
              ) : products.length === 0 ? (
                <EmptyState
                  icon={<Search size={48} />}
                  title="No products found"
                  description="Try adjusting your search or filter criteria."
                  action={{ label: 'Clear Filters', onClick: () => { dispatch(clearFilters()); setSearchParams({}); setSearchInput(''); } }}
                />
              ) : (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8"
                  >
                    {products.map((product, idx) => (
                      <ProductCard key={product._id} product={product} index={idx} />
                    ))}
                  </motion.div>
                  <Pagination
                    currentPage={pagination.page}
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
                    className="mt-12"
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
