import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Instagram, Facebook, Twitter, Globe, Send } from 'lucide-react';
import { cn } from '../../lib/utils';
import Button from '../ui/Button';

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
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Globe, href: '#', label: 'Pinterest' },
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
