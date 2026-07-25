import React from 'react';
import { cn } from '../../lib/utils';

interface NotesPyramidProps {
  top?: string[];
  heart?: string[];
  base?: string[];
}

const defaultNotes = {
  top: ['Saffron', 'Black Pepper', 'Bergamot'],
  heart: ['Damask Rose', 'Jasmine', 'Cinnamon'],
  base: ['Agarwood (Oud)', 'Amber', 'Musk', 'Sandalwood'],
};

export default function NotesPyramid({ top, heart, base }: NotesPyramidProps) {
  const notes = { ...defaultNotes, top: top || defaultNotes.top, heart: heart || defaultNotes.heart, base: base || defaultNotes.base };
  const allNotes = [...notes.base, ...notes.heart, ...notes.top];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-serif text-luxury-charcoal">Fragrance Notes</h3>
      <div className="flex justify-center gap-6 md:gap-10">
        <div className="flex flex-col items-center">
          {notes.top.map((note) => (
            <span key={note} className="text-sm text-luxury-steel mb-2">{note}</span>
          ))}
        </div>
        <div className="flex flex-col items-center">
          {notes.heart.map((note) => (
            <span key={note} className="text-sm text-luxury-gold-dark mb-2">{note}</span>
          ))}
        </div>
        <div className="flex flex-col items-center">
          {notes.base.map((note) => (
            <span key={note} className="text-sm text-luxury-charcoal/70 mb-2">{note}</span>
          ))}
        </div>
      </div>

      <div className="relative flex justify-center pt-8">
        <svg width="280" height="120" viewBox="0 0 280 120" className="overflow-visible">
          <polygon
            points="140,10 260,110 20,110"
            fill="none"
            stroke="rgba(201,169,106,0.4)"
            strokeWidth="1"
          />
          <line
            x1="140" y1="10" x2="140" y2="110"
            stroke="rgba(201,169,106,0.2)"
            strokeWidth="1"
            strokeDasharray="4 3"
          />
          <line
            x1="80" y1="60" x2="200" y2="60"
            stroke="rgba(201,169,106,0.2)"
            strokeWidth="1"
            strokeDasharray="4 3"
          />
          <text x="140" y="25" textAnchor="middle" fill="rgb(var(--lux-charcoal))" fontSize="10" fontFamily="Cinzel, serif" letterSpacing="3">TOP</text>
          <text x="140" y="65" textAnchor="middle" fill="rgb(var(--lux-gold))" fontSize="10" fontFamily="Cinzel, serif" letterSpacing="3">HEART</text>
          <text x="140" y="105" textAnchor="middle" fill="rgb(var(--lux-charcoal))" fontSize="10" fontFamily="Cinzel, serif" letterSpacing="3">BASE</text>
        </svg>
      </div>

      <div className="flex justify-center gap-6">
        <div className="text-center">
          <div className="h-1 w-8 bg-luxury-steel/40 mx-auto mb-1" />
          <span className="text-[10px] text-luxury-steel/70 font-display tracking-widest uppercase">Top</span>
        </div>
        <div className="text-center">
          <div className="h-1 w-8 bg-luxury-gold mx-auto mb-1" />
          <span className="text-[10px] text-luxury-gold font-display tracking-widest uppercase">Heart</span>
        </div>
        <div className="text-center">
          <div className="h-1 w-8 bg-luxury-ink/30 mx-auto mb-1" />
          <span className="text-[10px] text-luxury-charcoal/60 font-display tracking-widest uppercase">Base</span>
        </div>
      </div>
    </div>
  );
}
