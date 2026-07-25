import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';
import Button from '../components/ui/Button';

export default function NotFoundPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-luxury-black px-4">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 border border-luxury-gold/20 rounded-full" />
        <div className="absolute bottom-1/3 right-1/3 w-64 h-64 border border-luxury-gold/10 rounded-full" />
      </div>
      <div className="relative z-10 text-center max-w-lg">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-8xl md:text-9xl font-display text-luxury-gold/20 tracking-[0.15em]">404</h1>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h2 className="text-2xl md:text-3xl font-display text-luxury-champagne tracking-wider mt-4">
            Page Not Found
          </h2>
          <p className="text-luxury-steel mt-4 leading-relaxed">
            The page you're looking for has wandered off into the unknown. Let us guide you back.
          </p>
          <Link to="/" className="inline-block mt-8">
            <Button variant="primary" size="lg">
              <Home size={18} /> Return Home
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
