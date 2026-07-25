import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageHeader from '../components/layout/PageHeader';
import Loader from '../components/ui/Loader';
import ErrorState from '../components/ui/ErrorState';
import { categoryService } from '../services/categoryService';
import type { Category } from '../types';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    categoryService.getAll({ isActive: true })
      .then((res) => setCategories(res.data))
      .catch((err) => setError(err?.response?.data?.message || 'Failed to load categories'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><Loader size="lg" text="Loading categories..." /></div>;
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;

  return (
    <div>
      <PageHeader
        title="Categories"
        subtitle="Explore our fragrance families"
        breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Categories' }]}
      />
      <section className="py-16 bg-luxury-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, idx) => (
              <motion.div
                key={cat._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05, duration: 0.4 }}
              >
                <Link to={`/categories/${cat.slug}`} className="group block relative overflow-hidden aspect-[4/5]">
                  <img
                    src={cat.image || 'https://placehold.co/600x800/1a1a1a/d4a853?text=' + cat.name}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-xl font-display text-luxury-champagne tracking-wider">{cat.name}</h3>
                    {cat.description && (
                      <p className="text-sm text-luxury-silver/70 mt-1">{cat.description}</p>
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
