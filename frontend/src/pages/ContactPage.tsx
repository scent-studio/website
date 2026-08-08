import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import ScrollReveal from '../components/ui/ScrollReveal';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import Button from '../components/ui/Button';
import { contactService } from '../services/contactService';
import toast from 'react-hot-toast';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  phone: z.string().optional(),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactForm = z.infer<typeof contactSchema>;

const contactInfo = [
  { icon: MapPin, label: 'For Business Queries', value: 'Garden East ADVI Co-Working' },
  { icon: MapPin, label: 'In Store Perfume Counter', value: 'The Wella Men Salon DHA Phase 5 Badar Commercial' },
  { icon: Phone, label: 'Phone', value: '+923208348754' },
  { icon: Mail, label: 'Email', value: 'scentstudio2@gmail.com' },
  { icon: Clock, label: 'Hours', value: '24/7 Service' },
];

export default function ContactPage() {
  useEffect(() => {
    document.title = 'Contact Us | Scent Studio';
    return () => { document.title = 'Scent Studio | Premium Fragrances in Pakistan'; };
  }, []);

  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactForm) => {
    setSubmitting(true);
    try {
      await contactService.submit(data);
      toast.success("Message sent successfully! We'll get back to you soon.");
      reset();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to send message');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Contact Us"
        subtitle="We'd love to hear from you"
        breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Contact' }]}
      />

      <section className="py-16 md:py-5 bg-luxury-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
            <ScrollReveal variant="slideInLeft">
              <div className="rounded-2xl border border-luxury-border bg-luxury-white p-6 sm:p-8 shadow-card">
                <h2 className="text-2xl font-serif text-luxury-charcoal tracking-wide mb-6">
                  Get in Touch
                </h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input label="Name" placeholder="Your name" error={errors.name?.message} {...register('name')} />
                    <Input label="Email" type="email" placeholder="your@email.com" error={errors.email?.message} {...register('email')} />
                  </div>
                  <Input label="Phone (optional)" type="tel" placeholder="+92 300 1234567" error={errors.phone?.message} {...register('phone')} />
                  <Input label="Subject" placeholder="How can we help?" error={errors.subject?.message} {...register('subject')} />
                  <Textarea label="Message" placeholder="Tell us more..." error={errors.message?.message} {...register('message')} showCount maxLength={1000} />
                  <Button type="submit" variant="primary" size="lg" className="w-full sm:w-auto" isLoading={submitting} disabled={submitting}>
                    <Send size={16} /> Send Message
                  </Button>
                </form>
              </div>
            </ScrollReveal>

            <ScrollReveal variant="slideInRight" delay={0.12}>
              <div className="space-y-6">
                <div className="rounded-2xl border border-luxury-border bg-luxury-white p-6 sm:p-8 shadow-card">
                  <h2 className="text-2xl font-serif text-luxury-charcoal tracking-wide mb-6">
                    Visit Us
                  </h2>
                  <div className="space-y-5">
                    {contactInfo.map((info, idx) => (
                      <motion.div
                        key={info.label}
                        initial={{ opacity: 0, x: 24 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.15 + idx * 0.08, duration: 0.5 }}
                        className="flex items-start gap-4"
                      >
                        <div className="h-11 w-11 flex items-center justify-center rounded-xl bg-luxury-gold/10 border border-luxury-gold/20 text-luxury-gold flex-shrink-0">
                          <info.icon size={18} />
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wider text-luxury-steel mb-0.5">
                            {info.label}
                          </p>
                          <p className="text-sm text-luxury-charcoal">{info.value}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* <div className="overflow-hidden rounded-2xl border border-luxury-border bg-luxury-ivory shadow-card">
                  <div className="aspect-[16/9] flex items-center justify-center">
                    <div className="text-center px-4">
                      <MapPin size={32} className="text-luxury-gold/50 mx-auto mb-2" />
                      <p className="text-sm text-luxury-charcoal font-medium">Interactive Map</p>
                      <p className="text-xs text-luxury-steel mt-1">123 Luxury Avenue, New York</p>
                    </div>
                  </div>
                </div> */}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  );
}
