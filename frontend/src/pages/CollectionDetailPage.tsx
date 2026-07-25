import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageHeader from '../components/layout/PageHeader';
import ProductCard from '../components/home/ProductCard';
import Loader from '../components/ui/Loader';
import ErrorState from '../components/ui/ErrorState';
import EmptyState from '../components/ui/EmptyState';
import type { Collection } from '../types';
import api from '../services/api';
import type { ApiResponse } from '../types';

export default function CollectionDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [collection, setCollection] = useState<Collection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError(null);
    api.get<ApiResponse<Collection>>(`/collections/slug/${slug}`)
      .then((res: any) => setCollection(res.data.data))
      .catch((err: any) => setError(err?.response?.data?.message || 'Failed to load collection'))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><Loader size="lg" text="Loading collection..." /></div>;
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;
  if (!collection) return <ErrorState title="Collection not found" />;

  const products = Array.isArray(collection.products)
    ? collection.products.filter((p): p is any => typeof p === 'object' && p !== null)
    : [];

  return (
    <div>
      <PageHeader
        title={collection.name}
        subtitle={collection.description}
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Collections', path: '/collections' },
          { label: collection.name },
        ]}
      />
      <section className="py-16 bg-luxury-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {products.length === 0 ? (
            <EmptyState title="Collection is empty" description="This collection has no products yet." />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
            >
              {products.map((product: any, idx: number) => (
                <ProductCard key={product._id} product={product} index={idx} />
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
