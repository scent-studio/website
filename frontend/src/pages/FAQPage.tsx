import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import ScrollReveal from '../components/ui/ScrollReveal';
import { cn } from '../lib/utils';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQItem[] = [
  { category: 'Shipping', question: 'How long does shipping take?', answer: 'Domestic orders typically arrive within 3-7 business days. International shipping takes 7-14 business days depending on the destination. Express shipping options are available at checkout for faster delivery.' },
  { category: 'Shipping', question: 'Do you offer free shipping?', answer: 'Yes, we offer free standard shipping on all orders over $150. For orders under $150, a flat rate of $8.99 applies within the continental US.' },
  { category: 'Shipping', question: 'Do you ship internationally?', answer: 'Yes, we ship to over 50 countries worldwide. International shipping rates are calculated at checkout and vary by destination. Please note that customs duties and taxes may apply.' },
  { category: 'Shipping', question: 'How can I track my order?', answer: 'Once your order ships, you will receive a confirmation email with a tracking number. You can also track your order from your account dashboard under "My Orders".' },
  { category: 'Returns', question: 'What is your return policy?', answer: 'We accept returns within 30 days of delivery for unused and unopened products in their original packaging. Please visit our Return Policy page for detailed instructions.' },
  { category: 'Returns', question: 'Can I return a used fragrance?', answer: 'For hygiene reasons, we can only accept returns of unopened products. If you received a defective or incorrect item, please contact our customer service team within 48 hours of delivery.' },
  { category: 'Returns', question: 'How long do refunds take?', answer: 'Once we receive your return, refunds are processed within 5-7 business days. The amount will be credited to your original payment method within 10-14 business days.' },
  { category: 'Products', question: 'Are your fragrances authentic?', answer: 'Absolutely. We source all our products directly from authorized distributors and official brand houses. Every product is 100% genuine and comes with our authenticity guarantee.' },
  { category: 'Products', question: 'How should I store my perfume?', answer: 'Store your fragrances in a cool, dark place away from direct sunlight and extreme temperatures. The ideal storage temperature is between 15-20°C (59-68°F). Avoid storing in bathrooms due to humidity.' },
  { category: 'Orders', question: 'Can I modify or cancel my order?', answer: 'Orders can be modified or cancelled within 1 hour of placement. Please contact our customer service team immediately with your order number for assistance.' },
  { category: 'Orders', question: 'What payment methods do you accept?', answer: 'We accept Visa, Mastercard, American Express, PayPal, Apple Pay, and Google Pay. All transactions are processed securely.' },
  { category: 'Orders', question: 'Is my payment information secure?', answer: 'Yes, we use industry-standard SSL encryption to protect your personal and payment information. We are PCI-DSS compliant and never store your full credit card details.' },
  { category: 'Payment', question: 'Do you offer gift cards?', answer: 'Yes, we offer digital gift cards in various denominations. They can be purchased on our website and delivered instantly via email.' },
  { category: 'Payment', question: 'Can I use multiple coupons?', answer: 'Only one coupon code can be applied per order. Coupons cannot be combined with other promotional offers unless explicitly stated.' },
];

const categories = [...new Set(faqs.map((f) => f.category))];

export default function FAQPage() {
  const [openId, setOpenId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = faqs.filter(
    (f) =>
      f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <PageHeader
        title="Frequently Asked Questions"
        subtitle="Find answers to common questions about our products, shipping, and more"
        breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'FAQ' }]}
      />
      <section className="py-16 md:py-20 bg-luxury-cream">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="relative mb-10">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-luxury-steel" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search FAQs..."
                className="w-full pl-12 pr-4 py-3.5 bg-luxury-white border border-luxury-border text-luxury-charcoal outline-none focus:border-luxury-gold/50 transition-colors placeholder:text-luxury-steel/40 rounded-xl shadow-soft"
              />
            </div>
          </ScrollReveal>

          {categories.map((cat, catIdx) => {
            const catFaqs = filtered.filter((f) => f.category === cat);
            if (catFaqs.length === 0) return null;
            return (
              <ScrollReveal key={cat} delay={catIdx * 0.08}>
                <div className="mb-10">
                  <h3 className="text-sm font-semibold text-luxury-gold tracking-[0.18em] uppercase mb-4">
                    {cat}
                  </h3>
                  <div className="space-y-3">
                    {catFaqs.map((faq) => {
                      const globalIdx = faqs.indexOf(faq);
                      const isOpen = openId === globalIdx;
                      return (
                        <div
                          key={globalIdx}
                          className="rounded-xl border border-luxury-border bg-luxury-white overflow-hidden shadow-soft"
                        >
                          <button
                            onClick={() => setOpenId(isOpen ? null : globalIdx)}
                            className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left text-sm text-luxury-charcoal hover:text-luxury-gold-dark transition-colors"
                          >
                            <span className="font-medium">{faq.question}</span>
                            <ChevronDown
                              size={16}
                              className={cn(
                                'transition-transform flex-shrink-0 text-luxury-steel',
                                isOpen && 'rotate-180 text-luxury-gold'
                              )}
                            />
                          </button>
                          <AnimatePresence>
                            {isOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                              >
                                <p className="px-5 pb-4 text-sm text-luxury-steel leading-relaxed border-t border-luxury-border/70 pt-3">
                                  {faq.answer}
                                </p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </ScrollReveal>
            );
          })}

          {filtered.length === 0 && (
            <p className="text-center text-luxury-steel py-12">No FAQs match your search.</p>
          )}
        </div>
      </section>
    </div>
  );
}
