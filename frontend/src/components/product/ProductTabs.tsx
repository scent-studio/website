import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';
import NotesPyramid from './NotesPyramid';
import ReviewCard from './ReviewCard';

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface ProductTabsProps {
  description?: string;
  ingredients?: string[];
  className?: string;
}

const defaultDescription = `Midnight Oud is a captivating fragrance that embodies the essence of luxury and mystery. 
Created by master perfumers at Maison Luxe, this scent opens with a burst of exotic saffron and black pepper, 
leading into a heart of rare damask rose and jasmine. The base is a rich, velvety blend of agarwood, 
amber, and musk that lingers on the skin for hours.`;

const defaultIngredients = [
  'Alcohol Denat.', 'Parfum (Fragrance)', 'Aqua (Water)', 'Limonene', 'Linalool',
  'Citronellol', 'Geraniol', 'Coumarin', 'Eugenol', 'Benzyl Alcohol',
  'Benzyl Benzoate', 'Farnesol', 'Citral',
];

export default function ProductTabs({
  description = defaultDescription,
  ingredients = defaultIngredients,
  className,
}: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState('description');

  const tabs: Tab[] = [
    { id: 'description', label: 'Description', content: <p className="text-luxury-steel leading-relaxed whitespace-pre-line">{description}</p> },
    { id: 'notes', label: 'Notes', content: <NotesPyramid /> },
    { id: 'ingredients', label: 'Ingredients', content: (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {ingredients.map((ing) => (
          <span key={ing} className="text-sm text-luxury-steel px-3 py-1.5 border border-luxury-border rounded-lg">{ing}</span>
        ))}
      </div>
    )},
    { id: 'reviews', label: 'Reviews', content: (
      <div className="space-y-4">
        <ReviewCard
          name="Isabella R."
          rating={5}
          date="March 15, 2024"
          comment="Absolutely divine! The longevity is incredible and the scent evolves beautifully throughout the day."
          avatar="IR"
          isVerified
        />
        <ReviewCard
          name="James M."
          rating={4}
          date="February 28, 2024"
          comment="Sophisticated and unique. The oud note is perfectly balanced - not too overpowering."
          avatar="JM"
        />
      </div>
    )},
  ];

  return (
    <div className={cn('', className)}>
      <div className="flex border-b border-luxury-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'px-5 md:px-8 py-3 text-sm font-sans tracking-wider transition-all duration-200 border-b-2 -mb-px',
              activeTab === tab.id
                ? 'border-luxury-gold text-luxury-gold'
                : 'border-transparent text-luxury-steel hover:text-luxury-charcoal'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-luxury-white rounded-xl shadow-soft p-6 md:p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {tabs.find((t) => t.id === activeTab)?.content}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
