import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import {
  LayoutDashboard, Package, FolderTree, ShoppingCart, Users,
  Star, Ticket, Image, Mail, MessageSquare, Settings,
} from 'lucide-react';
import { cn } from '../../lib/utils';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
  { label: 'Products', icon: Package, path: '/admin/products' },
  { label: 'Categories', icon: FolderTree, path: '/admin/categories' },
  { label: 'Orders', icon: ShoppingCart, path: '/admin/orders' },
  { label: 'Customers', icon: Users, path: '/admin/customers' },
  { label: 'Reviews', icon: Star, path: '/admin/reviews' },
  { label: 'Coupons', icon: Ticket, path: '/admin/coupons' },
  { label: 'Banners', icon: Image, path: '/admin/banners' },
  { label: 'Newsletter', icon: Mail, path: '/admin/newsletter' },
  { label: 'Messages', icon: MessageSquare, path: '/admin/messages' },
  { label: 'Settings', icon: Settings, path: '/admin/settings' },
];

interface AdminSidebarProps {
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function AdminSidebar({ isMobileOpen, onMobileClose }: AdminSidebarProps) {
  const location = useLocation();

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b border-luxury-border flex items-center justify-between">
        <Link to="/admin" className="text-xl font-serif text-luxury-gold tracking-[0.15em]">Scent Studio</Link>
        <button onClick={onMobileClose} className="lg:hidden text-luxury-steel hover:text-luxury-gold">
          <X size={18} />
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onMobileClose}
              className={cn(
                'flex items-center gap-3 px-4 py-2.5 text-sm transition-all duration-200 rounded-lg',
                isActive
                  ? 'text-luxury-gold bg-luxury-gold/10 border-l-2 border-luxury-gold'
                  : 'text-luxury-steel hover:text-luxury-charcoal hover:bg-luxury-ivory'
              )}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:flex w-60 flex-shrink-0 bg-luxury-white border-r border-luxury-border h-screen sticky top-0 shadow-sm">
        {sidebarContent}
      </aside>

      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 lg:hidden"
              onClick={onMobileClose}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-60 bg-luxury-white border-r border-luxury-border z-50 lg:hidden shadow-xl"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
