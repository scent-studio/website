import React from 'react';
import { motion } from 'framer-motion';
import { Award, Shield, Sparkles, Gem } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import ScrollReveal from '../components/ui/ScrollReveal';
import SectionTitle from '../components/ui/SectionTitle';

const values = [
  {
    icon: Sparkles,
    title: 'Craftsmanship',
    description:
      'Every fragrance is meticulously composed by master perfumers using the finest ingredients from around the world.',
  },
  {
    icon: Gem,
    title: 'Luxury',
    description:
      'We curate only the most exquisite scents that embody elegance, sophistication, and timeless beauty.',
  },
  {
    icon: Shield,
    title: 'Authenticity',
    description: '100% genuine products sourced directly from the most prestigious perfume houses.',
  },
  {
    icon: Award,
    title: 'Excellence',
    description:
      'Uncompromising quality in every aspect, from sourcing to packaging to customer experience.',
  },
];

const timeline = [
  {
    year: '2015',
    title: 'The Vision',
    description:
      "Scent Studio was founded with a mission to bring the world's finest perfumes to discerning customers.",
  },
  {
    year: '2017',
    title: 'Global Partnerships',
    description:
      'Established exclusive partnerships with renowned perfume houses across France, Italy, and the Middle East.',
  },
  {
    year: '2019',
    title: 'Digital Expansion',
    description:
      'Launched our e-commerce platform, bringing luxury fragrance shopping to customers worldwide.',
  },
  {
    year: '2021',
    title: 'Curated Collections',
    description: 'Introduced signature curated collections, each telling a unique olfactory story.',
  },
  {
    year: '2023',
    title: 'Sustainability',
    description:
      'Committed to sustainable sourcing and eco-friendly packaging across all our products.',
  },
  {
    year: '2025',
    title: 'Global Recognition',
    description:
      'Recognized as one of the top luxury fragrance retailers with a presence in 50+ countries.',
  },
];

export default function AboutPage() {
  return (
    <div>
      <PageHeader
        title="Our Story"
        subtitle="A journey of passion, craftsmanship, and the art of fine fragrances"
        breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'About' }]}
      />

      {/* Philosophy */}
      <section className="py-20 md:py-24 bg-luxury-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <ScrollReveal variant="slideInLeft">
              <div>
                <SectionTitle title="The Scent Studio Philosophy" align="left" className="mb-8" />
                <p className="text-luxury-steel leading-relaxed mb-5 text-sm md:text-base">
                  At Scent Studio, we believe that a signature scent is more than just a
                  fragrance—it&apos;s an expression of identity, a memory captured in a bottle, and a
                  journey of the senses.
                </p>
                <p className="text-luxury-steel leading-relaxed mb-5 text-sm md:text-base">
                  Founded in 2015, we have dedicated ourselves to curating the finest collection of
                  luxury perfumes from the most prestigious houses around the world. Each fragrance
                  in our collection is carefully selected for its artistry, quality, and ability to
                  evoke emotion.
                </p>
                <p className="text-luxury-steel leading-relaxed text-sm md:text-base">
                  From the sun-drenched fields of Grasse to the ancient perfume markets of the Middle
                  East, we travel the globe to bring you scents that tell stories of tradition,
                  innovation, and unparalleled craftsmanship.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal variant="slideInRight" delay={0.12}>
              <div className="relative max-w-md mx-auto lg:max-w-none">
                <div className="absolute -top-4 -left-4 w-24 h-24 border border-luxury-gold/25 rounded-2xl pointer-events-none" />
                <div className="absolute -bottom-4 -right-4 w-32 h-32 border border-luxury-gold/15 rounded-2xl pointer-events-none" />
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-luxury-border shadow-card bg-luxury-warm">
                  <img
                    src="https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=900&q=80"
                    alt="Luxury perfume craftsmanship"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-luxury-ink/35 via-transparent to-transparent" />
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 md:py-24 bg-luxury-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            title="Our Values"
            subtitle="The principles that guide every bottle we curate."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, idx) => (
              <ScrollReveal key={v.title} delay={idx * 0.1} variant="scaleIn">
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.25 }}
                  className="h-full text-center p-8 rounded-xl bg-luxury-white border border-luxury-border hover:border-luxury-gold/40 transition-colors duration-300 shadow-card"
                >
                  <div className="inline-flex items-center justify-center h-16 w-16 rounded-xl border border-luxury-gold/30 text-luxury-gold mb-5 bg-luxury-gold/5">
                    <v.icon size={28} />
                  </div>
                  <h3 className="text-lg font-serif text-luxury-charcoal mb-3">{v.title}</h3>
                  <p className="text-sm text-luxury-steel leading-relaxed">{v.description}</p>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Journey */}
      <section className="py-20 md:py-24 bg-luxury-cream">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            title="Our Journey"
            subtitle="Milestones that shaped Scent Studio."
          />
          <div className="relative mt-4">
            <div className="absolute left-[1.25rem] top-3 bottom-3 w-px bg-gradient-to-b from-luxury-gold/50 via-luxury-border to-transparent hidden sm:block" />
            <div className="space-y-6">
              {timeline.map((item, idx) => (
                <ScrollReveal key={item.year} delay={idx * 0.08}>
                  <div className="flex gap-5 sm:gap-6">
                    <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-luxury-white border border-luxury-gold/30 text-[10px] font-semibold tracking-wide text-luxury-gold-dark shadow-soft">
                      {item.year.slice(2)}
                    </div>
                    <div className="flex-1 rounded-xl border border-luxury-border bg-luxury-white p-5 shadow-card">
                      <div className="flex flex-wrap items-baseline gap-2 mb-1.5">
                        <span className="text-xs font-medium tracking-wider uppercase text-luxury-gold">
                          {item.year}
                        </span>
                        <h3 className="text-lg font-serif text-luxury-charcoal">{item.title}</h3>
                      </div>
                      <p className="text-sm text-luxury-steel leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
