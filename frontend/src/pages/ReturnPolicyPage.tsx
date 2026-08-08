import React from 'react';
import PageHeader from '../components/layout/PageHeader';
import ScrollReveal from '../components/ui/ScrollReveal';

const sections = [
  {
    title: '14-Day Easy Return Window',
    content:
      'We accept returns within 14 days of delivery for unused and unopened products in their original packaging, with seals intact.',
  },
  {
    title: 'Non-Returnable Items',
    content:
      'Opened or used fragrances cannot be returned for hygiene reasons. Final-sale / clearance items are also non-returnable unless the item is defective or incorrect.',
  },
  {
    title: 'How to Start a Return or Exchange',
    content:
      'Contact us via WhatsApp or email with your order number and reason for return/exchange. Our team will share return instructions. Please do not ship items back without confirmation.',
  },
  {
    title: 'Exchanges',
    content:
      'Exchanges are available for defective, damaged, or incorrect items. For a different fragrance, place a new order and return the original unused item for a refund where eligible.',
  },
  {
    title: 'Return Shipping',
    content:
      'If the return is due to our error (wrong/damaged item), we cover return shipping. For change-of-mind returns, shipping costs are the customer’s responsibility unless otherwise agreed.',
  },
  {
    title: 'Refunds',
    content:
      'Once we receive and inspect the returned item, refunds are processed within 5–7 business days. COD refunds may be issued via bank transfer after we verify your account details.',
  },
  {
    title: 'Cancellations',
    content:
      'You can request cancellation soon after placing the order. If the order has already been packed or handed to the courier, cancellation may not be possible.',
  },
];

export default function ReturnPolicyPage() {
  return (
    <div>
      <PageHeader
        title="Returns & Exchanges"
        subtitle="Our commitment to your satisfaction"
        breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Returns & Exchanges' }]}
      />
      <section className="py-16 bg-luxury-cream">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-luxury-steel mb-8">Last updated: August 2026</p>
          <div className="space-y-8">
            {sections.map((s, idx) => (
              <ScrollReveal key={s.title} delay={idx * 0.05}>
                <div className="bg-luxury-white border border-luxury-border rounded-xl p-6">
                  <h2 className="text-lg font-serif text-luxury-charcoal mb-3">{s.title}</h2>
                  <p className="text-sm text-luxury-steel leading-relaxed">{s.content}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
