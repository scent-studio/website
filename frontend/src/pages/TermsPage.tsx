import React from 'react';
import PageHeader from '../components/layout/PageHeader';
import ScrollReveal from '../components/ui/ScrollReveal';

const sections = [
  { title: 'Acceptance of Terms', content: 'By accessing and using the Scent Studio website, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you may not use our services.' },
  { title: 'Account Registration', content: 'When creating an account, you must provide accurate and complete information. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. Notify us immediately of any unauthorized use.' },
  { title: 'Product Information', content: 'We strive to display accurate product descriptions, images, and pricing. However, we do not guarantee that product descriptions or other content are error-free. We reserve the right to correct any errors and update information at any time.' },
  { title: 'Pricing and Payment', content: 'All prices are listed in USD and are subject to change without notice. We reserve the right to modify prices at any time. Payment is required at the time of purchase. We accept major credit cards and other payment methods as indicated on our website.' },
  { title: 'Orders and Acceptance', content: 'Placing an item in your cart does not guarantee its availability. We reserve the right to limit quantities and refuse or cancel orders at our discretion. We will notify you if we cannot fulfill your order.' },
  { title: 'Shipping and Delivery', content: 'Shipping times are estimates and not guaranteed. We are not responsible for delays caused by carriers, customs, or force majeure events. Risk of loss passes to you upon delivery to the carrier.' },
  { title: 'Returns and Refunds', content: 'Our return policy is outlined separately. Please refer to our Return Policy page for detailed information about returns, exchanges, and refunds.' },
  { title: 'Intellectual Property', content: 'All content on this website, including text, images, logos, and designs, is the property of Scent Studio or its licensors and is protected by intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written consent.' },
  { title: 'Limitation of Liability', content: 'Scent Studio shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our website or products. Our total liability is limited to the amount you paid for the product in question.' },
  { title: 'Governing Law', content: 'These terms shall be governed by and construed in accordance with the laws of the State of New York, without regard to its conflict of law provisions. Any disputes shall be resolved in the courts of New York County.' },
  { title: 'Changes to Terms', content: 'We reserve the right to update these terms at any time. Changes will be effective immediately upon posting. Your continued use of our website after changes constitutes acceptance of the new terms.' },
  { title: 'Contact Information', content: 'For questions about these terms, please contact us at legal@scentstudio.pk or write to Scent Studio, 123 Luxury Avenue, New York, NY 10001.' },
];

export default function TermsPage() {
  return (
    <div>
      <PageHeader
        title="Terms & Conditions"
        subtitle="Please read these terms carefully before using our services"
        breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Terms & Conditions' }]}
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
