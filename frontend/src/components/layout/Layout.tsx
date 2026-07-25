import React, { useState } from 'react';
import { cn } from '../../lib/utils';
import Navbar from './Navbar';
import Footer from './Footer';
import MobileMenu from './MobileMenu';
import CartDrawer from './CartDrawer';
import SearchOverlay from './SearchOverlay';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
  showAnnouncement?: boolean;
}

export default function Layout({ children, className, showAnnouncement = true }: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="min-h-screen bg-luxury-cream text-luxury-charcoal flex flex-col">
      <div className="fixed top-0 left-0 right-0 z-40">
        {showAnnouncement && (
          <div
            className="bg-luxury-ink overflow-hidden py-2.5 border-b border-white/10"
            role="marquee"
            aria-label="Free shipping on orders over Rs. 15,000. 15% off your first order with code SCENT15"
          >
            <div className="announcement-marquee-track flex w-max">
              {[0, 1].map((copy) => (
                <p
                  key={copy}
                  className="flex shrink-0 items-center whitespace-nowrap text-xs text-white/80 tracking-wider font-sans"
                  aria-hidden={copy === 1 ? true : undefined}
                >
                  {Array.from({ length: 4 }).map((_, i) => (
                    <span key={i} className="inline-flex items-center px-8">
                      Free shipping on orders over Rs. 15,000 &middot; 15% off your first order with code SCENT15
                      <span className="mx-8 text-white/35" aria-hidden="true">
                        •
                      </span>
                    </span>
                  ))}
                </p>
              ))}
            </div>
          </div>
        )}

        <Navbar
          onSearchOpen={() => setSearchOpen(true)}
          onCartOpen={() => setCartOpen(true)}
          onMobileMenuOpen={() => setMobileMenuOpen(true)}
        />
      </div>

      {/* Reserves space for the fixed announcement + navbar stack */}
      <div
        className={cn(
          'shrink-0',
          showAnnouncement ? 'h-[6.75rem] md:h-[7.75rem]' : 'h-[4.25rem] md:h-[5.25rem]'
        )}
        aria-hidden="true"
      />

      <main className={cn('flex-1', className)}>
        {children}
      </main>

      <Footer />

      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
