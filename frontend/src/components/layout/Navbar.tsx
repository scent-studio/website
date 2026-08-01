import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import {
  Search, Heart, ShoppingBag, User, ChevronDown, Menu, LogOut, Package, Settings,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import ThemeToggle from '../ui/ThemeToggle';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Shop', path: '/shop', hasDropdown: true },
  { label: 'New Arrivals', path: '/new-arrivals' },
  { label: 'Best Sellers', path: '/best-sellers' },
  { label: 'About', path: '/about' },
];

const categories = [
  { name: 'Women', path: '/shop?gender=female' },
  { name: 'Men', path: '/shop?gender=male' },
  { name: 'Unisex', path: '/shop?gender=unisex' },
  { name: 'Gift Sets', path: '/shop?giftSet=true' },
];

interface NavbarProps {
  onSearchOpen?: () => void;
  onCartOpen?: () => void;
  onMobileMenuOpen?: () => void;
}

export default function Navbar({ onSearchOpen, onCartOpen, onMobileMenuOpen }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const updateCounts = () => {
    try {
      const w = JSON.parse(localStorage.getItem('wishlist') || '[]');
      setWishlistCount(Array.isArray(w) ? w.length : 0);
      const c = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartCount(
        Array.isArray(c) ? c.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0) : 0
      );
    } catch {
      setWishlistCount(0);
      setCartCount(0);
    }
  };

  useEffect(() => {
    updateCounts();
    window.addEventListener('storage', updateCounts);
    window.addEventListener('wishlist-updated', updateCounts);
    window.addEventListener('cart-updated', updateCounts);
    return () => {
      window.removeEventListener('storage', updateCounts);
      window.removeEventListener('wishlist-updated', updateCounts);
      window.removeEventListener('cart-updated', updateCounts);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'w-full transition-all duration-500',
        scrolled
          ? 'glass-nav shadow-sm'
          : 'bg-luxury-cream/85 backdrop-blur-md border-b border-luxury-border/50'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[4.25rem] md:h-[5.25rem]">
          <button
            className="md:hidden text-luxury-charcoal/70 hover:text-luxury-charcoal transition-colors"
            onClick={onMobileMenuOpen}
          >
            <Menu size={22} />
          </button>

          <Link to="/" className="flex-shrink-0">
            {/* <img
              src="public/uploads/logo/logo.jpeg"
              alt="Scent Studio"
              className="h-10 md:h-12 w-auto"
            /> */}
                          <span className="text-2xl font-serif text-luxury-charcoal tracking-[0.12em]">Scent Studio</span>

          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <div
                key={link.label}
                className="relative"
                onMouseEnter={() => link.hasDropdown && setDropdownOpen(true)}
                onMouseLeave={() => link.hasDropdown && setDropdownOpen(false)}
              >
                <Link
                  to={link.path}
                  className="flex items-center gap-1 px-4 py-2 text-sm text-luxury-charcoal/70 hover:text-luxury-charcoal transition-colors tracking-wide font-sans"
                >
                  {link.label}
                  {link.hasDropdown && (
                    <ChevronDown
                      size={14}
                      className={cn(
                        'transition-transform duration-200',
                        dropdownOpen && 'rotate-180'
                      )}
                    />
                  )}
                </Link>
                {link.hasDropdown && (
                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 w-56 bg-luxury-white border border-luxury-border shadow-card rounded-xl overflow-hidden"
                      >
                        <div className="py-2">
                          {categories.map((cat) => (
                            <Link
                              key={cat.name}
                              to={cat.path}
                              className="block px-5 py-2.5 text-sm text-luxury-charcoal/70 hover:text-luxury-charcoal hover:bg-luxury-ivory transition-colors"
                            >
                              {cat.name}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <ThemeToggle />

            <button
              onClick={onSearchOpen}
              className={cn(
                'transition-colors p-2 rounded-lg',
                'text-luxury-charcoal/70 hover:text-luxury-charcoal hover:bg-luxury-ivory'
              )}
            >
              <Search size={20} />
            </button>

            <Link
              to="/wishlist"
              className={cn(
                'relative transition-colors p-2 rounded-lg hidden md:inline-flex',
                'text-luxury-charcoal/70 hover:text-luxury-charcoal hover:bg-luxury-ivory'
              )}
            >
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-luxury-ink text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <button
              onClick={onCartOpen}
              className={cn(
                'relative transition-colors p-2 rounded-lg',
                'text-luxury-charcoal/70 hover:text-luxury-charcoal hover:bg-luxury-ivory'
              )}
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-luxury-ink text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </button>

            <div className="relative hidden md:block">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className={cn(
                  'transition-colors p-2 rounded-lg',
                  scrolled ? 'text-luxury-charcoal/70 hover:text-luxury-charcoal hover:bg-luxury-ivory' : 'text-luxury-charcoal/70 hover:text-luxury-charcoal hover:bg-luxury-ivory'
                )}
              >
                <User size={20} />
              </button>
              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 top-full w-56 bg-luxury-white border border-luxury-border shadow-card rounded-xl overflow-hidden"
                  >
                    <div className="py-2">
                      {isAuthenticated ? (
                        <>
                          <div className="px-5 py-2.5 border-b border-luxury-border mb-1">
                            <p className="text-sm font-medium text-luxury-charcoal">{user?.name || 'User'}</p>
                            <p className="text-xs text-luxury-steel">{user?.email}</p>
                          </div>
                          <Link to="/account" className="flex items-center gap-3 px-5 py-2.5 text-sm text-luxury-charcoal/70 hover:text-luxury-charcoal hover:bg-luxury-ivory">
                            <Package size={16} /> My Orders
                          </Link>
                          <Link to="/account/profile" className="flex items-center gap-3 px-5 py-2.5 text-sm text-luxury-charcoal/70 hover:text-luxury-charcoal hover:bg-luxury-ivory">
                            <Settings size={16} /> Profile
                          </Link>
                          {user?.role === 'admin' && (
                            <Link to="/admin" className="flex items-center gap-3 px-5 py-2.5 text-sm text-luxury-gold-dark hover:bg-luxury-gold/5">
                              <Settings size={16} /> Admin Panel
                            </Link>
                          )}
                          <hr className="border-luxury-border my-1" />
                          <button onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('refreshToken'); localStorage.removeItem('user'); window.location.href = '/'; }} className="flex items-center gap-3 px-5 py-2.5 text-sm text-luxury-red hover:bg-luxury-red/5 w-full text-left">
                            <LogOut size={16} /> Sign Out
                          </button>
                        </>
                      ) : (
                        <>
                          <Link to="/login" className="block px-5 py-2.5 text-sm text-luxury-charcoal/70 hover:text-luxury-charcoal hover:bg-luxury-ivory">Sign In</Link>
                          <Link to="/register" className="block px-5 py-2.5 text-sm text-luxury-charcoal/70 hover:text-luxury-charcoal hover:bg-luxury-ivory">Create Account</Link>
                        </>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
