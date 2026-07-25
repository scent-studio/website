import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import PageHeader from '../components/layout/PageHeader';
import ProductCard from '../components/home/ProductCard';
import Pagination from '../components/ui/Pagination';
import Loader from '../components/ui/Loader';
import ErrorState from '../components/ui/ErrorState';
import EmptyState from '../components/ui/EmptyState';
import { productService } from '../services/productService';
import type { Product } from '../types';

export default function BestSellersPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    setError(null);
    productService.getBestSellers()
      .then((res) => {
        setProducts(res.data);
        setTotalPages(1);
      })
      .catch((err) => setError(err?.response?.data?.message || 'Failed to load best sellers'))
      .finally(() => setLoading(false));
  }, [page]);

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><Loader size="lg" text="Loading best sellers..." /></div>;
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;

  return (
    <div>
      <PageHeader
        title="Best Sellers"
        subtitle="Our most beloved fragrances, chosen by connoisseurs worldwide"
        breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Best Sellers' }]}
      />
      <section className="py-16 bg-luxury-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {products.length === 0 ? (
            <EmptyState title="No best sellers yet" />
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {products.map((product, idx) => (
                  <ProductCard key={product._id} product={product} index={idx} />
                ))}
              </motion.div>
              <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} className="mt-12" />
            </>
          )}
        </div>
      </section>
    </div>
  );
}
