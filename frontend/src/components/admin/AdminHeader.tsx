import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, LogOut } from 'lucide-react';
import { cn } from '../../lib/utils';
import ThemeToggle from '../ui/ThemeToggle';

interface AdminHeaderProps {
  title: string;
  onMenuToggle?: () => void;
  className?: string;
}

export default function AdminHeader({ title, onMenuToggle, className }: AdminHeaderProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-30 bg-luxury-white/90 backdrop-blur-lg border-b border-luxury-border px-6 py-3',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuToggle}
            className="lg:hidden text-luxury-steel hover:text-luxury-gold transition-colors"
          >
            <Menu size={20} />
          </button>
          <h1 className="text-lg font-serif text-luxury-charcoal">{title}</h1>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />

          <div className="flex items-center gap-3 pl-4 border-l border-luxury-border">
            <div className="h-8 w-8 flex items-center justify-center bg-luxury-gold/15 text-luxury-gold text-sm font-medium rounded-lg border border-luxury-gold/20">
              A
            </div>
            <div className="hidden md:block">
              <p className="text-sm text-luxury-charcoal font-medium">Admin</p>
              <p className="text-xs text-luxury-steel">admin@luxe.com</p>
            </div>
            <Link to="/" className="text-luxury-steel hover:text-luxury-gold transition-colors" title="View Store">
              <LogOut size={16} className="rotate-180" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
