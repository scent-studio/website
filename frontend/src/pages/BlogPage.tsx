import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, User, Tag, ArrowRight } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import Loader from '../components/ui/Loader';
import ErrorState from '../components/ui/ErrorState';
import EmptyState from '../components/ui/EmptyState';
import { blogService } from '../services/blogService';
import { formatDate, truncate } from '../lib/utils';
import type { Blog } from '../types';

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    blogService.getAll({ limit: 20 })
      .then((res) => setBlogs(res.data.filter((b: Blog) => b.isPublished)))
      .catch((err) => setError(err?.response?.data?.message || 'Failed to load blog'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><Loader size="lg" text="Loading articles..." /></div>;
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;

  return (
    <div>
      <PageHeader
        title="Journal"
        subtitle="Stories, guides, and insights from the world of luxury fragrances"
        breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Blog' }]}
      />
      <section className="py-16 bg-luxury-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {blogs.length === 0 ? (
            <EmptyState title="No articles yet" description="Check back soon for new content." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog, idx) => (
                <motion.article
                  key={blog._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05, duration: 0.4 }}
                >
                  <Link to={`/blog/${blog.slug}`} className="group block">
                    <div className="relative overflow-hidden aspect-[16/10] border border-luxury-border group-hover:border-luxury-gold/20 transition-all duration-500">
                      <img
                        src={blog.image || 'https://placehold.co/800x500/1a1a1a/d4a853?text=Blog'}
                        alt={blog.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                    <div className="mt-5">
                      <div className="flex items-center gap-4 text-xs text-luxury-steel mb-3">
                        <span className="flex items-center gap-1"><Calendar size={12} /> {formatDate(blog.publishedAt || blog.createdAt)}</span>
                        <span className="flex items-center gap-1">
                          <User size={12} />{' '}
                          {typeof blog.author === 'object' ? blog.author?.name : blog.author}
                        </span>
                      </div>
                      <h3 className="text-lg font-serif text-luxury-champagne group-hover:text-luxury-gold transition-colors mb-2">
                        {blog.title}
                      </h3>
                      <p className="text-sm text-luxury-steel leading-relaxed">{truncate(blog.excerpt || '', 120)}</p>
                      {blog.tags && blog.tags.length > 0 && (
                        <div className="flex items-center gap-2 mt-3">
                          {blog.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="flex items-center gap-1 text-[10px] text-luxury-gold bg-luxury-gold/10 px-2 py-0.5">
                              <Tag size={10} /> {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <span className="inline-flex items-center gap-1 text-sm text-luxury-gold mt-4 group-hover:gap-2 transition-all">
                        Read More <ArrowRight size={14} />
                      </span>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
