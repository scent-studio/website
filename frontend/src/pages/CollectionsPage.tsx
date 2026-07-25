import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageHeader from '../components/layout/PageHeader';
import Loader from '../components/ui/Loader';
import ErrorState from '../components/ui/ErrorState';
import type { Collection } from '../types';
import { collectionService } from '../services/collectionService';

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    collectionService.getAll({ isActive: true })
      .then((res) => setCollections(res.data))
      .catch((err) => setError(err?.response?.data?.message || 'Failed to load collections'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><Loader size="lg" text="Loading collections..." /></div>;
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;

  return (
    <div>
      <PageHeader
        title="Collections"
        subtitle="Curated fragrance stories, each telling a unique tale"
        breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Collections' }]}
      />
      <section className="py-16 bg-luxury-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {collections.map((col, idx) => (
              <motion.div
                key={col._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05, duration: 0.4 }}
              >
                <Link to={`/collections/${col.slug}`} className="group block relative overflow-hidden aspect-[16/9]">
                  <img
                    src={col.image || 'https://placehold.co/1200x675/1a1a1a/d4a853?text=' + col.name}
                    alt={col.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <h3 className="text-2xl font-display text-luxury-champagne tracking-wider">{col.name}</h3>
                    {col.description && (
                      <p className="text-sm text-luxury-silver/70 mt-2 max-w-lg">{col.description}</p>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
