// import React, { useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
// import { cn } from '../../lib/utils';
// import SectionTitle from '../ui/SectionTitle';
// import ScrollReveal from '../ui/ScrollReveal';

// const testimonials = [
//   {
//     name: 'Isabella R.',
//     location: 'New York, NY',
//     avatar: 'IR',
//     rating: 5,
//     text: 'Absolutely exquisite! The Midnight Oud is unlike anything I have ever worn. The compliments I receive are endless. This is true luxury.',
//   },
//   {
//     name: 'James M.',
//     location: 'London, UK',
//     avatar: 'JM',
//     rating: 5,
//     text: 'Exceptional quality and service. The fragrance lasted all day and the packaging was stunning. Will definitely be a returning customer.',
//   },
//   {
//     name: 'Sophie L.',
//     location: 'Paris, FR',
//     avatar: 'SL',
//     rating: 5,
//     text: 'I discovered my new signature scent. Rosé Velvet is pure elegance in a bottle. The attention to detail in every aspect is remarkable.',
//   },
//   {
//     name: 'Alexander K.',
//     location: 'Dubai, UAE',
//     avatar: 'AK',
//     rating: 4,
//     text: 'Impressive collection of rare and unique fragrances. The Oud Royale is masterfully crafted. Shipping was fast and secure.',
//   },
// ];

// export default function Testimonials() {
//   const [current, setCurrent] = useState(0);

//   const next = () => setCurrent((prev) => (prev + 1) % testimonials.length);
//   const prev = () => setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);

//   return (
//     <section className="py-20 bg-luxury-cream">
//       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
//         <SectionTitle
//           title="What Our Customers Say"
//           subtitle="Hear from those who have experienced the Scent Studio difference."
//         />
//         <ScrollReveal variant="scaleIn">
//           <div className="relative rounded-2xl border border-luxury-border bg-luxury-white p-8 md:p-12 shadow-card">
//             <button
//               onClick={prev}
//               aria-label="Previous testimonial"
//               className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 flex items-center justify-center border border-luxury-border text-luxury-steel hover:text-luxury-gold hover:border-luxury-gold/40 transition-all z-10 hidden md:flex rounded-xl bg-luxury-white shadow-soft"
//             >
//               <ChevronLeft size={18} />
//             </button>
//             <button
//               onClick={next}
//               aria-label="Next testimonial"
//               className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 flex items-center justify-center border border-luxury-border text-luxury-steel hover:text-luxury-gold hover:border-luxury-gold/40 transition-all z-10 hidden md:flex rounded-xl bg-luxury-white shadow-soft"
//             >
//               <ChevronRight size={18} />
//             </button>

//             <div className="overflow-hidden px-2 md:px-10">
//               <AnimatePresence mode="wait">
//                 <motion.div
//                   key={current}
//                   initial={{ opacity: 0, y: 28 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -20 }}
//                   transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
//                   className="text-center"
//                 >
//                   <div className="flex items-center justify-center gap-1 mb-6">
//                     {Array.from({ length: testimonials[current].rating }).map((_, i) => (
//                       <Star key={`f-${i}`} size={18} className="text-luxury-gold fill-luxury-gold" />
//                     ))}
//                     {Array.from({ length: 5 - testimonials[current].rating }).map((_, i) => (
//                       <Star key={`e-${i}`} size={18} className="text-luxury-steel/30" />
//                     ))}
//                   </div>
//                   <p className="text-lg md:text-xl text-luxury-charcoal/80 font-serif italic leading-relaxed max-w-2xl mx-auto">
//                     &ldquo;{testimonials[current].text}&rdquo;
//                   </p>
//                   <div className="mt-8 flex items-center justify-center gap-3">
//                     <div className="h-10 w-10 flex items-center justify-center bg-luxury-gold/10 text-luxury-gold text-sm font-medium rounded-xl border border-luxury-gold/20">
//                       {testimonials[current].avatar}
//                     </div>
//                     <div className="text-left">
//                       <p className="text-sm font-medium text-luxury-charcoal">
//                         {testimonials[current].name}
//                       </p>
//                       <p className="text-xs text-luxury-steel">{testimonials[current].location}</p>
//                     </div>
//                   </div>
//                 </motion.div>
//               </AnimatePresence>
//             </div>

//             <div className="flex items-center justify-center gap-2 mt-8">
//               {testimonials.map((_, idx) => (
//                 <button
//                   key={idx}
//                   onClick={() => setCurrent(idx)}
//                   aria-label={`Go to testimonial ${idx + 1}`}
//                   className={cn(
//                     'h-1.5 transition-all duration-300 rounded-full',
//                     idx === current ? 'w-8 bg-luxury-gold' : 'w-4 bg-luxury-border hover:bg-luxury-gold/40'
//                   )}
//                 />
//               ))}
//             </div>
//           </div>
//         </ScrollReveal>
//       </div>
//     </section>
//   );
// }
