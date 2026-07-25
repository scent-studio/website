import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '../../lib/utils';

interface Breadcrumb {
  label: string;
  path?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: Breadcrumb[];
  backgroundImage?: string;
  className?: string;
}

const ease = [0.22, 1, 0.36, 1] as const;

export default function PageHeader({
  title,
  subtitle,
  breadcrumbs,
  backgroundImage,
  className,
}: PageHeaderProps) {
  return (
    <section
      className={cn(
        'relative py-20 md:py-28 overflow-hidden',
        backgroundImage
          ? 'bg-cover bg-center'
          : 'bg-gradient-to-b from-luxury-warm to-luxury-cream',
        className
      )}
      style={backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : undefined}
    >
      {backgroundImage && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      )}

      {!backgroundImage && (
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-10 left-10 w-64 h-64 border border-luxury-gold/20 rounded-full" />
          <div className="absolute -bottom-20 right-10 w-96 h-96 border border-luxury-gold/10 rounded-full" />
        </div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <motion.nav
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            className="flex items-center justify-center gap-1.5 mb-6 text-sm"
          >
            <Link to="/" className="text-luxury-steel hover:text-luxury-gold transition-colors">
              <Home size={14} />
            </Link>
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                <ChevronRight size={12} className="text-luxury-steel/50" />
                {crumb.path ? (
                  <Link
                    to={crumb.path}
                    className="text-luxury-steel hover:text-luxury-gold transition-colors"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-luxury-gold">{crumb.label}</span>
                )}
              </React.Fragment>
            ))}
          </motion.nav>
        )}

        <motion.h1
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.65, ease }}
          className="text-3xl md:text-5xl lg:text-6xl font-display text-luxury-charcoal tracking-wider uppercase"
        >
          {title}
        </motion.h1>

        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.6, ease }}
            className="mt-4 text-luxury-steel max-w-xl mx-auto font-sans text-sm md:text-base leading-relaxed"
          >
            {subtitle}
          </motion.p>
        )}

        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.3, duration: 0.7, ease }}
          className="h-px w-20 bg-luxury-gold mx-auto mt-6 origin-center"
        />
      </div>
    </section>
  );
}
