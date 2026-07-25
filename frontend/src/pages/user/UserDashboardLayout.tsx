import React, { useEffect } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Package, Heart, MapPin, Lock, ShoppingBag, ChevronRight, LogOut } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../hooks/useAuth';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../store';
import { fetchWishlist } from '../../store/slices/wishlistSlice';
import toast from 'react-hot-toast';

const navItems = [
  { label: 'Dashboard', icon: User, path: '/account' },
  { label: 'My Orders', icon: Package, path: '/account/orders' },
  { label: 'My Wishlist', icon: Heart, path: '/account/wishlist' },
  { label: 'Addresses', icon: MapPin, path: '/account/addresses' },
  { label: 'Profile', icon: User, path: '/account/profile' },
  { label: 'Password', icon: Lock, path: '/account/password' },
];

export default function UserDashboardLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { user, logout } = useAuth();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-luxury-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-8">
          <ShoppingBag size={20} className="text-luxury-gold" />
          <h1 className="text-xl font-serif text-luxury-charcoal tracking-wider">My Account</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
          <aside>
            <div className="bg-luxury-white rounded-xl shadow-card border border-luxury-border p-5 mb-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 flex items-center justify-center bg-luxury-gold/10 border border-luxury-gold/20 text-luxury-gold text-lg font-medium rounded-lg">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div>
                  <p className="text-sm font-medium text-luxury-charcoal">{user?.name || 'User'}</p>
                  <p className="text-xs text-luxury-steel">{user?.email}</p>
                </div>
              </div>
            </div>

            <nav className="bg-luxury-white rounded-xl shadow-card border border-luxury-border overflow-hidden">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      'flex items-center gap-3 px-5 py-3 text-sm transition-all duration-200 border-b border-luxury-border last:border-b-0',
                      isActive
                        ? 'text-luxury-gold bg-luxury-gold/5 border-l-2 border-luxury-gold'
                        : 'text-luxury-steel hover:text-luxury-charcoal hover:bg-luxury-cream'
                    )}
                  >
                    <item.icon size={16} />
                    <span>{item.label}</span>
                    <ChevronRight size={14} className="ml-auto opacity-30" />
                  </Link>
                );
              })}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-5 py-3 text-sm text-luxury-steel hover:text-red-500 hover:bg-red-50 transition-all duration-200"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </nav>
          </aside>

          <main>
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
}
