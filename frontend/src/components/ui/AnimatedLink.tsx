import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';

interface AnimatedLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  external?: boolean;
}

export default function AnimatedLink({ to, children, className, external }: AnimatedLinkProps) {
  const classes = cn(
    'relative inline-block text-luxury-light/70 font-medium transition-colors duration-300 group',
    'hover:text-luxury-gold',
    className
  );

  const underline = (
    <span className="absolute left-0 bottom-0 h-px w-0 bg-luxury-gold transition-all duration-300 group-hover:w-full" />
  );

  if (external) {
    return (
      <a href={to} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
        {underline}
      </a>
    );
  }

  return (
    <Link to={to} className={classes}>
      {children}
      {underline}
    </Link>
  );
}
