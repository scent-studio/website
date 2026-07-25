import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageHeader from '../components/layout/PageHeader';
import ProductCard from '../components/home/ProductCard';
import Pagination from '../components/ui/Pagination';
import Loader from '../components/ui/Loader';
import ErrorState from '../components/ui/ErrorState';
import EmptyState from '../components/ui/EmptyState';
import { categoryService } from '../services/categoryService';
import { productService } from '../services/productService';
import type { Category, Product } from '../types';

export default function CategoryProductsPage() {
  const { slug } = useParams<{ slug: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError(null);
    Promise.all([
      categoryService.getBySlug(slug),
      productService.getProducts({ category: slug, page, limit: 12 }),
    ])
      .then(([catRes, prodRes]) => {
        setCategory(catRes.data as Category);
        setProducts(prodRes.data);
        setTotalPages(prodRes.pagination?.totalPages ?? 1);
      })
      .catch((err) => setError(err?.response?.data?.message || 'Failed to load category'))
      .finally(() => setLoading(false));
  }, [slug, page]);

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><Loader size="lg" text="Loading..." /></div>;
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;
  if (!category) return <ErrorState title="Category not found" />;

  return (
    <div>
      <PageHeader
        title={category.name}
        subtitle={category.description}
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Categories', path: '/categories' },
          { label: category.name },
        ]}
      />
      <section className="py-16 bg-luxury-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {products.length === 0 ? (
            <EmptyState title="No products found" description="This category has no products yet." />
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
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
