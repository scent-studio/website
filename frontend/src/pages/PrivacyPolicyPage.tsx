import React from 'react';
import PageHeader from '../components/layout/PageHeader';
import ScrollReveal from '../components/ui/ScrollReveal';

const sections = [
  { title: 'Information We Collect', content: 'We collect information you provide directly to us, including your name, email address, shipping address, billing information, and phone number when you create an account, place an order, or contact our customer service. We also automatically collect certain information when you visit our website, including your IP address, browser type, device information, and browsing behavior.' },
  { title: 'How We Use Your Information', content: 'We use your information to process and fulfill your orders, communicate with you about your purchases, send you marketing communications (with your consent), improve our website and services, prevent fraud and ensure the security of our platform, and comply with legal obligations.' },
  { title: 'Information Sharing', content: 'We do not sell your personal information to third parties. We may share your information with trusted service providers who assist us in operating our website, processing payments, shipping orders, and sending communications. These partners are contractually obligated to protect your information.' },
  { title: 'Data Security', content: 'We implement industry-standard security measures including SSL encryption, secure socket layer technology, and regular security audits to protect your personal information. All payment transactions are processed through PCI-DSS compliant gateways.' },
  { title: 'Cookies', content: 'We use cookies and similar tracking technologies to enhance your browsing experience, analyze website traffic, and understand where our visitors come from. You can control cookie preferences through your browser settings.' },
  { title: 'Your Rights', content: 'You have the right to access, correct, update, or delete your personal information at any time. You can manage your account settings or contact us directly. You may also opt out of marketing communications at any time.' },
  { title: 'Third-Party Links', content: 'Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these external sites. We encourage you to review their privacy policies before providing any personal information.' },
  { title: 'Children\'s Privacy', content: 'Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If we become aware that a child has provided us with personal information, we will delete it immediately.' },
  { title: 'Changes to This Policy', content: 'We may update this privacy policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the effective date. We encourage you to review this policy periodically.' },
  { title: 'Contact Us', content: 'If you have any questions about this privacy policy or our data practices, please contact us at privacy@luxefragrances.com or write to us at 123 Luxury Avenue, New York, NY 10001.' },
];

export default function PrivacyPolicyPage() {
  return (
    <div>
      <PageHeader
        title="Privacy Policy"
        subtitle="How we collect, use, and protect your information"
        breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Privacy Policy' }]}
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
