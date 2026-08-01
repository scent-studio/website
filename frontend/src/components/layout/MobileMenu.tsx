import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { X, Heart, Package, Settings, LogOut } from 'lucide-react';
import { cn } from '../../lib/utils';

const mainLinks = [
  { label: 'Home', path: '/' },
  { label: 'Shop All', path: '/shop' },
  { label: 'New Arrivals', path: '/new-arrivals' },
  { label: 'Best Sellers', path: '/best-sellers' },
  { label: 'Women', path: '/shop?gender=female' },
  { label: 'Men', path: '/shop?gender=male' },
  { label: 'Unisex', path: '/shop?gender=unisex' },
  { label: 'Gift Sets', path: '/shop?giftSet=true' },
];

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-luxury-ink/40 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 bottom-0 w-72 bg-luxury-white border-r border-luxury-border z-50 overflow-y-auto"
          >
            <div className="flex items-center justify-between p-5 border-b border-luxury-border">
              <span className="text-xl font-serif text-luxury-charcoal tracking-[0.12em]">Scent Studio</span>
              <div className="flex items-center gap-1">
                <button onClick={onClose} className="text-luxury-steel hover:text-luxury-charcoal transition-colors p-1">
                  <X size={20} />
                </button>
              </div>
            </div>

            <nav className="p-4">
              <ul className="space-y-0.5">
                {mainLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.path}
                      onClick={onClose}
                      className="block px-4 py-3 text-sm text-luxury-charcoal/70 hover:text-luxury-charcoal hover:bg-luxury-ivory transition-colors rounded-lg"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>

              <hr className="border-luxury-border my-4" />

              <div className="space-y-0.5">
                <Link
                  to="/wishlist"
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-3 text-sm text-luxury-charcoal/70 hover:text-luxury-charcoal hover:bg-luxury-ivory transition-colors rounded-lg"
                >
                  <Heart size={16} /> Wishlist
                </Link>
                {isAuthenticated ? (
                  <>
                    <Link to="/account" onClick={onClose} className="flex items-center gap-3 px-4 py-3 text-sm text-luxury-charcoal/70 hover:text-luxury-charcoal hover:bg-luxury-ivory transition-colors rounded-lg">
                      <Package size={16} /> My Orders
                    </Link>
                    <Link to="/account/settings" onClick={onClose} className="flex items-center gap-3 px-4 py-3 text-sm text-luxury-charcoal/70 hover:text-luxury-charcoal hover:bg-luxury-ivory transition-colors rounded-lg">
                      <Settings size={16} /> Settings
                    </Link>
                    <button onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('refreshToken'); localStorage.removeItem('user'); window.location.href = '/'; }} className="flex items-center gap-3 w-full px-4 py-3 text-sm text-luxury-red hover:bg-luxury-red/5 transition-colors rounded-lg">
                      <LogOut size={16} /> Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={onClose} className="block px-4 py-3 text-sm text-luxury-charcoal/70 hover:text-luxury-charcoal hover:bg-luxury-ivory transition-colors rounded-lg">
                      Sign In
                    </Link>
                    <Link to="/register" onClick={onClose} className="block px-4 py-3 text-sm text-luxury-charcoal/70 hover:text-luxury-charcoal hover:bg-luxury-ivory transition-colors rounded-lg">
                      Create Account
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
