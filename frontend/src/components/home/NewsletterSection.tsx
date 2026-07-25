import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle, Mail } from 'lucide-react';
import { cn } from '../../lib/utils';
import { newsletterService } from '../../services/newsletterService';
import toast from 'react-hot-toast';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    try {
      await newsletterService.subscribe(email);
      setStatus('success');
      setEmail('');
      toast.success('Subscribed successfully!');
    } catch (err: any) {
      setStatus('error');
      toast.error(err?.response?.data?.message || 'Subscription failed. Please try again.');
    }
  };

  return (
    <section className="relative overflow-hidden py-20 md:py-28 bg-luxury-ivory">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(201,169,106,0.06)_0%,_transparent_70%)]" />

      <div className="relative z-10 max-w-2xl mx-auto px-4 text-center">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-xs font-serif text-luxury-gold tracking-[0.3em] uppercase"
        >
          Stay Connected
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mt-4 text-3xl md:text-4xl font-serif text-luxury-charcoal"
        >
          Join the Scent Studio Circle
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-4 text-luxury-steel max-w-lg mx-auto"
        >
          Subscribe for exclusive access to new launches, limited editions, and 15% off your first order.
        </motion.p>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          onSubmit={handleSubmit}
          className="mt-8 max-w-md mx-auto"
        >
          <div className="flex items-center gap-3 bg-luxury-white border border-luxury-border rounded-xl p-1.5 shadow-soft">
            <div className="flex items-center gap-2 flex-1 pl-3">
              <Mail size={18} className="text-luxury-steel flex-shrink-0" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                disabled={status === 'loading' || status === 'success'}
                className="flex-1 bg-transparent text-sm text-luxury-charcoal placeholder:text-luxury-steel/50 outline-none py-2"
              />
            </div>
            <button
              type="submit"
              disabled={status === 'loading' || status === 'success' || !email}
              className={cn(
                'px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 flex items-center gap-2',
                status === 'success'
                  ? 'bg-luxury-green text-white'
                  : 'bg-luxury-ink text-white hover:bg-luxury-gold hover:text-luxury-charcoal'
              )}
            >
              {status === 'loading' ? (
                <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : status === 'success' ? (
                <CheckCircle size={16} />
              ) : (
                <Send size={16} />
              )}
              {status === 'loading' ? 'Subscribing...' : status === 'success' ? 'Subscribed!' : 'Subscribe'}
            </button>
          </div>
        </motion.form>
      </div>

      <div className="absolute -top-20 -right-20 w-64 h-64 border border-luxury-gold/10 rounded-full" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 border border-luxury-gold/5 rounded-full" />
    </section>
  );
}
