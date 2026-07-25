import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, User, Tag, ArrowLeft, ChevronRight, Home } from 'lucide-react';
import Loader from '../components/ui/Loader';
import ErrorState from '../components/ui/ErrorState';
import { blogService } from '../services/blogService';
import { formatDate } from '../lib/utils';
import type { Blog } from '../types';

export default function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError(null);
    blogService.getBySlug(slug)
      .then((res) => setBlog(res.data))
      .catch((err) => setError(err?.response?.data?.message || 'Failed to load article'))
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (blog) document.title = `${blog.title} - Scent Studio Journal`;
    return () => { document.title = 'Scent Studio'; };
  }, [blog]);

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><Loader size="lg" text="Loading article..." /></div>;
  if (error) return <ErrorState message={error} onRetry={() => slug && blogService.getBySlug(slug)} />;
  if (!blog) return <ErrorState title="Article not found" />;

  return (
    <div className="bg-luxury-black">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="flex items-center gap-1.5 text-sm mb-8">
          <Link to="/" className="text-luxury-steel hover:text-luxury-gold transition-colors"><Home size={14} /></Link>
          <ChevronRight size={12} className="text-luxury-steel/50" />
          <Link to="/blog" className="text-luxury-steel hover:text-luxury-gold transition-colors">Journal</Link>
          <ChevronRight size={12} className="text-luxury-steel/50" />
          <span className="text-luxury-gold">{blog.title}</span>
        </nav>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="aspect-[16/9] overflow-hidden border border-luxury-border mb-8">
            <img
              src={blog.image || 'https://placehold.co/1200x675/1a1a1a/d4a853?text=Blog'}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex items-center gap-4 text-xs text-luxury-steel mb-4">
            <span className="flex items-center gap-1"><Calendar size={12} /> {formatDate(blog.publishedAt || blog.createdAt)}</span>
            <span className="flex items-center gap-1">
              <User size={12} />{' '}
              {typeof blog.author === 'object' ? blog.author?.name : blog.author}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-display text-luxury-champagne tracking-wider mb-6">{blog.title}</h1>

          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-6">
              {blog.tags.map((tag) => (
                <span key={tag} className="flex items-center gap-1 text-xs text-luxury-gold bg-luxury-gold/10 px-3 py-1">
                  <Tag size={10} /> {tag}
                </span>
              ))}
            </div>
          )}

          <div
            className="prose prose-invert prose-gold max-w-none text-luxury-steel leading-relaxed"
            dangerouslySetInnerHTML={{ __html: blog.content || blog.excerpt || '' }}
          />

          <div className="mt-12 pt-8 border-t border-luxury-border">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-sm text-luxury-gold hover:text-luxury-gold-light transition-colors"
            >
              <ArrowLeft size={14} /> Back to Journal
            </Link>
          </div>
        </motion.article>
      </div>
    </div>
  );
}
