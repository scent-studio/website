import React from 'react';
import PageHeader from '../components/layout/PageHeader';
import ScrollReveal from '../components/ui/ScrollReveal';

const sections = [
  { title: '30-Day Return Policy', content: 'We accept returns within 30 days of delivery for unused and unopened products in their original packaging. To be eligible for a return, the item must be in the same condition as received, with all seals and packaging intact.' },
  { title: 'Non-Returnable Items', content: 'For hygiene reasons, we cannot accept returns on used or opened fragrance products. Gift cards, personalized items, and final sale items are also non-returnable. If you received a defective or incorrect item, please contact us within 48 hours.' },
  { title: 'How to Initiate a Return', content: 'To start a return, log into your account and navigate to your orders, or contact our customer service team. You will receive a return authorization and instructions. Please do not send items back without prior authorization.' },
  { title: 'Return Shipping', content: 'Customers are responsible for return shipping costs unless the return is due to our error (defective, damaged, or incorrect item). We recommend using a trackable shipping method as we cannot guarantee receipt of returned packages.' },
  { title: 'Refund Processing', content: 'Once we receive and inspect your return, we will process your refund within 5-7 business days. Refunds are issued to the original payment method and may take an additional 5-10 business days to appear on your statement depending on your bank.' },
  { title: 'Exchanges', content: 'We offer exchanges for defective or damaged items only. For size variations or different fragrances, please place a new order and return the original item for a refund following our standard return process.' },
  { title: 'Cancellation Policy', content: 'Orders can be cancelled within 1 hour of placement. After that, the order may have already entered processing and cannot be cancelled. Please contact us immediately if you need to modify or cancel your order.' },
  { title: 'Quality Guarantee', content: 'All our products are 100% authentic and sourced directly from authorized distributors. If you have concerns about product authenticity or quality, please contact our customer service team for assistance.' },
];

export default function ReturnPolicyPage() {
  return (
    <div>
      <PageHeader
        title="Return Policy"
        subtitle="Our commitment to your satisfaction"
        breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Return Policy' }]}
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
