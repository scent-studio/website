import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';
import SectionTitle from '../ui/SectionTitle';

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    id: 'best-perfumes-men',
    question: 'What are the best perfumes for men in Pakistan?',
    answer:
      'The best perfumes for men in Pakistan combine long-lasting performance with notes suited to warmer climates. Woody, oriental, and oud-based fragrances tend to perform exceptionally well. At Scent Studio, our top picks include Midnight Oud, Royal Amber, and Bois de Noir — each crafted to leave a memorable impression throughout the day.',
  },
  {
    id: 'best-brands',
    question: 'What are the best perfume brands in Pakistan?',
    answer:
      'Pakistan offers a growing landscape of premium perfume houses alongside international labels. Scent Studio curates the finest from both worlds — featuring masterfully blended niche fragrances and iconic designer scents. Every bottle in our collection is selected for its craftsmanship, longevity, and signature character.',
  },
  {
    id: 'affordable-perfumes',
    question: 'Where can I find affordable perfumes that last?',
    answer:
      'Affordable does not mean compromise. Scent Studio offers a curated range of long-lasting perfumes at accessible prices, with EDP concentrations that ensure 8–12 hours of wear. Look for oriental and woody compositions — they naturally project more and last longer than lighter citrus or aquatic blends.',
  },
  {
    id: 'branded-perfumes-men',
    question: 'What are the best branded perfumes for men?',
    answer:
      'For men, the most admired branded perfumes feature bold base notes like oud, leather, tobacco, and amber. Our collection includes signature masculine fragrances such as Noir Intense, Oud Royale, and Cedar & Spice — each offering distinct character, exceptional sillage, and refined elegance for the modern gentleman.',
  },
  {
    id: 'apply-perfume',
    question: 'How should I apply perfume to make it last longer?',
    answer:
      'Apply perfume to pulse points — wrists, neck, behind the ears, and the inner elbows — where body heat helps diffuse the fragrance. Avoid rubbing the wrists together, as it breaks down the molecules. Moisturize your skin beforehand, and apply on clean, hydrated skin to lock in the scent for hours.',
  },
  {
    id: 'edp-vs-edt',
    question: 'What is the difference between EDP and EDT?',
    answer:
      'EDP (Eau de Parfum) contains 15–20% perfume oil, offering richer scent and 6–8 hours of longevity. EDT (Eau de Toilette) contains 5–15% oil, giving a lighter, fresher feel lasting 3–5 hours. For Pakistan’s climate, EDPs generally perform better due to their deeper concentration and longer trail.',
  },
  {
    id: 'hot-weather',
    question: 'Do perfumes work well in Pakistan’s hot weather?',
    answer:
      'Yes — when chosen wisely. In hot weather, opt for fragrances with strong base notes like oud, amber, musk, and sandalwood, which thrive in warmth and project beautifully. Lighter citrus and aquatic scents can fade quickly. Storing your perfume away from direct sunlight also preserves its integrity.',
  },
  {
    id: 'how-long-last',
    question: 'How long do the perfumes last?',
    answer:
      'Longevity depends on the concentration and your skin chemistry. Our EDPs typically last 8–12 hours, while our exclusive extraits can endure well beyond. To maximize wear, apply on moisturized skin, layer with matching scented products, and refresh lightly on clothing for an extended scent trail.',
  },
];

const ease = [0.22, 1, 0.36, 1] as const;

interface FAQItemProps {
  faq: FAQ;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}

function FAQItem({ faq, isOpen, onToggle, index }: FAQItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, delay: index * 0.06, ease }}
      className={cn(
        'border border-luxury-border rounded-xl bg-luxury-white overflow-hidden transition-all duration-300',
        isOpen ? 'shadow-soft border-luxury-gold/40' : 'hover:border-luxury-gold/30'
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${faq.id}`}
        className="w-full flex items-center justify-between gap-4 text-left px-5 md:px-7 py-5 group"
      >
        <span
          className={cn(
            'text-base md:text-lg font-serif transition-colors duration-300',
            isOpen ? 'text-luxury-gold' : 'text-luxury-charcoal group-hover:text-luxury-gold'
          )}
        >
          {faq.question}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.35, ease }}
          className={cn(
            'flex-shrink-0 h-9 w-9 flex items-center justify-center rounded-full border transition-colors duration-300',
            isOpen
              ? 'bg-luxury-gold/10 border-luxury-gold/40 text-luxury-gold'
              : 'border-luxury-border text-luxury-steel group-hover:text-luxury-gold group-hover:border-luxury-gold/30'
          )}
        >
          <ChevronDown size={18} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`faq-answer-${faq.id}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease }}
            className="overflow-hidden"
          >
            <div className="px-5 md:px-7 pb-6 pt-1 border-t border-luxury-border/60">
              <p className="text-sm md:text-base text-luxury-steel font-sans leading-relaxed">
                {faq.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQSection() {
  const [openId, setOpenId] = useState<string | null>(faqs[0].id);

  const handleToggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="py-20 md:py-28 bg-luxury-cream">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Frequently Asked Questions"
          subtitle="Everything you need to know about choosing, wearing, and caring for your signature scent."
        />

        <div className="flex flex-col gap-3 md:gap-4">
          {faqs.map((faq, index) => (
            <FAQItem
              key={faq.id}
              faq={faq}
              isOpen={openId === faq.id}
              onToggle={() => handleToggle(faq.id)}
              index={index}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.2, ease }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-luxury-steel font-sans">
            Still have questions?{' '}
            <a
              href="/contact"
              className="text-luxury-gold font-medium hover:underline underline-offset-4"
            >
              Reach out to our fragrance concierge
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
