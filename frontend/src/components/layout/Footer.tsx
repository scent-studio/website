import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Instagram, Facebook, Send } from 'lucide-react';
import { cn } from '../../lib/utils';
import Button from '../ui/Button';

function TikTokIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  );
}

function WhatsAppIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

const quickLinks = [
  { label: 'Shop All', path: '/shop' },
  { label: 'New Arrivals', path: '/new-arrivals' },
  { label: 'Best Sellers', path: '/best-sellers' },
  { label: 'Women', path: '/shop?gender=women' },
  { label: 'Men', path: '/shop?gender=men' },
  { label: 'Gift Sets', path: '/shop?category=gift-sets' },
];

const customerLinks = [
  { label: 'Shipping Information', path: '/shipping' },
  { label: 'Returns & Exchanges', path: '/returns' },
  { label: 'Privacy Policy', path: '/privacy' },
  { label: 'Terms of Service', path: '/terms' },
  { label: 'FAQ', path: '/faq' },
  { label: 'Contact Us', path: '/contact' },
];

const companyLinks = [
  { label: 'About Us', path: '/about' },
  { label: 'Our Story', path: '/our-story' },
  { label: 'Craftsmanship', path: '/craftsmanship' },
  { label: 'Careers', path: '/careers' },
  { label: 'Press', path: '/press' },
];

const socialLinks = [
  { icon: Instagram, href: 'https://www.instagram.com/scentstudio6/', label: 'Instagram' },
  { icon: Facebook, href: 'https://www.facebook.com/scentstudio/', label: 'Facebook' },
  { icon: TikTokIcon, href: 'https://www.tiktok.com/@scentstudio40', label: 'TikTok' },
  { icon: WhatsAppIcon, href: 'https://wa.me/+923208348754', label: 'WhatsApp' },
];

const paymentMethods = ['Visa', 'Mastercard', 'Amex', 'PayPal', 'Apple Pay'];

export default function Footer() {
  return (
    <footer className="bg-luxury-ivory border-t border-luxury-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <Link to="/" className="inline-block">
              <span className="text-2xl font-serif text-luxury-charcoal tracking-[0.12em]">Scent Studio</span>
            </Link>
            <p className="mt-4 text-sm text-luxury-steel leading-relaxed max-w-xs">
              Discover the world's finest fragrances, crafted with passion and precision. 
              Each scent tells a unique story of elegance and sophistication.
            </p>
            <div className="flex items-center gap-3 mt-6">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="h-9 w-9 flex items-center justify-center border border-luxury-border text-luxury-steel hover:text-luxury-gold hover:border-luxury-gold/40 transition-all duration-300 rounded-lg"
                >
                  <social.icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-luxury-charcoal tracking-wider uppercase mb-6">Quick Links</h4>
            <ul className="space-y-3.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.path} className="text-sm text-luxury-steel hover:text-luxury-charcoal transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-luxury-charcoal tracking-wider uppercase mb-6">Customer Service</h4>
            <ul className="space-y-3.5">
              {customerLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.path} className="text-sm text-luxury-steel hover:text-luxury-charcoal transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-luxury-charcoal tracking-wider uppercase mb-6">Newsletter</h4>
            <p className="text-sm text-luxury-steel mb-5">
              Subscribe to receive exclusive offers, new launches, and insider access.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-4 py-3 bg-luxury-white border border-luxury-border text-luxury-charcoal placeholder:text-luxury-steel/50 text-sm outline-none focus:border-luxury-gold transition-colors rounded-lg"
              />
              <Button variant="primary" size="md">
                <Send size={16} />
              </Button>
            </div>
            <div className="mt-8">
              <h5 className="text-xs font-semibold text-luxury-charcoal tracking-wider uppercase mb-3">We Accept</h5>
              <div className="flex flex-wrap gap-2">
                {paymentMethods.map((method) => (
                  <span key={method} className="px-3 py-1.5 text-xs bg-luxury-white border border-luxury-border text-luxury-steel rounded-md">
                    {method}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="py-8 border-t border-luxury-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-luxury-steel">
            &copy; {new Date().getFullYear()} Scent Studio. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="text-xs text-luxury-steel hover:text-luxury-charcoal transition-colors">Privacy</Link>
            <Link to="/terms" className="text-xs text-luxury-steel hover:text-luxury-charcoal transition-colors">Terms</Link>
            <Link to="/sitemap" className="text-xs text-luxury-steel hover:text-luxury-charcoal transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
