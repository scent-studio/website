import React from 'react';
import PageHeader from '../components/layout/PageHeader';
import ScrollReveal from '../components/ui/ScrollReveal';

const sections = [
  { title: 'Processing Time', content: 'Orders are processed within 1-2 business days after payment confirmation. Orders placed on weekends or holidays will be processed the next business day. During peak seasons, processing may take up to 3 business days.' },
  { title: 'Shipping Methods', content: 'We offer several shipping options: Standard Shipping (3-7 business days), Express Shipping (2-3 business days), and Overnight Shipping (1 business day). Delivery times are estimates and not guaranteed.' },
  { title: 'Shipping Rates', content: 'Free standard shipping is available on all orders over $150. Standard shipping for orders under $150 is $8.99 within the continental US. Express and overnight shipping rates are calculated at checkout based on your location.' },
  { title: 'International Shipping', content: 'We ship to over 50 countries worldwide. International shipping rates vary by destination and are calculated at checkout. Delivery typically takes 7-14 business days. Customs duties, taxes, and import fees may apply and are the responsibility of the customer.' },
  { title: 'Tracking', content: 'Once your order ships, you will receive a confirmation email with a tracking number. You can track your package through our website or the carrier\'s tracking portal. Please allow 24-48 hours for tracking information to update.' },
  { title: 'Shipping Restrictions', content: 'We currently ship to select countries only. Some fragrances may have shipping restrictions due to hazardous material regulations. We cannot ship to PO boxes for express or overnight deliveries.' },
  { title: 'Lost or Damaged Packages', content: 'If your package is lost or damaged during transit, please contact us immediately. We will work with the carrier to resolve the issue. For damaged items, please keep all original packaging for inspection.' },
  { title: 'Address Accuracy', content: 'Please ensure your shipping address is correct at checkout. We are not responsible for packages delivered to incorrect addresses provided by the customer. Address changes after order placement must be requested immediately.' },
];

export default function ShippingPolicyPage() {
  return (
    <div>
      <PageHeader
        title="Shipping Policy"
        subtitle="Everything you need to know about shipping"
        breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Shipping Policy' }]}
      />
      <section className="py-16 bg-luxury-black">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-luxury-steel mb-8">Last updated: January 1, 2025</p>
          <div className="space-y-8">
            {sections.map((s, idx) => (
              <ScrollReveal key={s.title} delay={idx * 0.05}>
                <div>
                  <h2 className="text-lg font-serif text-luxury-champagne mb-3">{s.title}</h2>
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
