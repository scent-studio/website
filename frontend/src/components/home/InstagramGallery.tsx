import React from 'react';
import { Instagram } from 'lucide-react';
import SectionTitle from '../ui/SectionTitle';

const images = [
  'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1594035910387-fea477942556?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1587017539504-67cfbddac569?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1615634260167-c8cdede054de?auto=format&fit=crop&w=400&q=80',
];

export default function InstagramGallery() {
  const renderStrip = (prefix: string, hidden?: boolean) => (
    <div
      className="flex shrink-0 items-center gap-4 sm:gap-5 md:gap-6 pr-4 sm:pr-5 md:pr-6"
      aria-hidden={hidden || undefined}
    >
      {images.map((img, idx) => (
        <a
          key={`${prefix}-${idx}`}
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative h-40 w-40 sm:h-48 sm:w-48 md:h-56 md:w-56 shrink-0 overflow-hidden rounded-2xl bg-luxury-warm"
        >
          <img
            src={img}
            alt={`Instagram ${idx + 1}`}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-luxury-ink/55 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <Instagram size={26} className="text-white" />
          </div>
        </a>
      ))}
    </div>
  );

  return (
    <section className="overflow-hidden py-20 bg-luxury-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Follow Us on Instagram"
          subtitle="@luxeperfumes"
        />
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 sm:w-16 bg-gradient-to-r from-luxury-ivory to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 sm:w-16 bg-gradient-to-l from-luxury-ivory to-transparent" />

        <div className="instagram-marquee-track flex w-max">
          {renderStrip('a')}
          {renderStrip('b', true)}
        </div>
      </div>
    </section>
  );
}
