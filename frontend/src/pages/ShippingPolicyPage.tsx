import React from 'react';
import PageHeader from '../components/layout/PageHeader';
import ScrollReveal from '../components/ui/ScrollReveal';

const sections = [
  {
    title: 'Processing Time',
    content:
      'Orders are typically processed within 1–2 business days after confirmation. Orders placed on weekends or public holidays are processed on the next business day.',
  },
  {
    title: 'Shipping Across Pakistan',
    content:
      'We deliver nationwide across Pakistan. Standard delivery usually takes 2–5 business days depending on your city. Remote areas may take a little longer.',
  },
  {
    title: 'Shipping Rates',
    content:
      'A flat shipping fee applies on orders below our free-shipping threshold. Orders that meet the free-shipping minimum qualify for free delivery. Exact charges are shown at checkout.',
  },
  {
    title: 'Cash on Delivery',
    content:
      'Cash on Delivery (COD) is available for eligible orders. Please keep the exact amount ready for a smooth handoff with the courier.',
  },
  {
    title: 'Tracking',
    content:
      'Once your order ships, we will share tracking details by email/WhatsApp when available. Tracking updates can take 24–48 hours to appear after dispatch.',
  },
  {
    title: 'Address Accuracy',
    content:
      'Please double-check your phone number and complete address at checkout. We are not responsible for delays or failed delivery caused by incorrect customer details.',
  },
  {
    title: 'Lost or Damaged Packages',
    content:
      'If your package is lost or arrives damaged, contact us immediately with your order number and photos (if damaged). We will work with the courier to resolve the issue.',
  },
];

export default function ShippingPolicyPage() {
  return (
    <div>
      <PageHeader
        title="Shipping Information"
        subtitle="Delivery details for orders across Pakistan"
        breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Shipping' }]}
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
