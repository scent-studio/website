import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Truck, CreditCard, Award } from 'lucide-react';
import { cn } from '../../lib/utils';
import SectionTitle from '../ui/SectionTitle';

const features = [
  {
    icon: Award,
    title: 'Premium Quality',
    description: 'Every fragrance is hand-selected and tested to ensure the highest quality standards.',
  },
  {
    icon: Truck,
    title: 'Free Shipping',
    description: 'Enjoy free shipping on all orders over 2000 PKR, with express delivery available.',
  },
  {
    icon: CreditCard,
    title: 'Secure Payment',
    description: 'Shop with confidence using our encrypted payment system supporting all major cards.',
  },
  {
    icon: Shield,
    title: 'Authentic Products',
    description: '100% genuine products sourced directly from official distributors and brands.',
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-20 bg-luxury-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Why Choose Scent Studio"
          subtitle="Experience the difference of true luxury."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 48, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ delay: idx * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6 }}
              className="text-center p-8 rounded-xl bg-luxury-white border border-luxury-border hover:border-luxury-gold/40 transition-colors duration-300 group shadow-card"
            >
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-xl border border-luxury-gold/30 text-luxury-gold mb-5 group-hover:bg-luxury-gold/5 transition-colors">
                <feature.icon size={28} />
              </div>
              <h3 className="text-lg font-serif text-luxury-charcoal mb-3">{feature.title}</h3>
              <p className="text-sm text-luxury-steel leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
