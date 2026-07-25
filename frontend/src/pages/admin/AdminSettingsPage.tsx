import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, Upload } from 'lucide-react';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Button from '../../components/ui/Button';
import Loader from '../../components/ui/Loader';
import { settingsService } from '../../services/settingsService';
import toast from 'react-hot-toast';

const settingsSchema = z.object({
  storeName: z.string().min(1, 'Required'),
  contactEmail: z.string().email('Invalid email'),
  contactPhone: z.string().optional(),
  address: z.string().optional(),
  socialMedia_facebook: z.string().optional(),
  socialMedia_instagram: z.string().optional(),
  socialMedia_twitter: z.string().optional(),
  socialMedia_youtube: z.string().optional(),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
  seo_keywords: z.string().optional(),
  shipping_freeShippingThreshold: z.string().optional(),
  shipping_flatRate: z.string().optional(),
  taxRate: z.string().optional(),
  currency: z.string().optional(),
});

type SettingsForm = z.infer<typeof settingsSchema>;

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<SettingsForm>({
    resolver: zodResolver(settingsSchema),
  });

  useEffect(() => {
    settingsService.get()
      .then((res) => {
        const s = res.data;
        reset({
          storeName: s.storeName || '',
          contactEmail: s.contactEmail || '',
          contactPhone: s.contactPhone || '',
          address: s.address || '',
          socialMedia_facebook: s.socialMedia?.facebook || '',
          socialMedia_instagram: s.socialMedia?.instagram || '',
          socialMedia_twitter: s.socialMedia?.twitter || '',
          socialMedia_youtube: s.socialMedia?.youtube || '',
          seo_title: s.seo?.title || '',
          seo_description: s.seo?.description || '',
          seo_keywords: s.seo?.keywords || '',
          shipping_freeShippingThreshold: String(s.shipping?.freeShippingThreshold || ''),
          shipping_flatRate: String(s.shipping?.flatRate || ''),
          taxRate: String(s.taxRate || ''),
          currency: s.currency || 'USD',
        });
      })
      .catch(() => toast.error('Failed to load settings'))
      .finally(() => setLoading(false));
  }, [reset]);

  const onSubmit = async (data: SettingsForm) => {
    setSaving(true);
    try {
      const payload = {
        storeName: data.storeName,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone,
        address: data.address,
        socialMedia: {
          facebook: data.socialMedia_facebook,
          instagram: data.socialMedia_instagram,
          twitter: data.socialMedia_twitter,
          youtube: data.socialMedia_youtube,
        },
        seo: {
          title: data.seo_title,
          description: data.seo_description,
          keywords: data.seo_keywords,
        },
        shipping: {
          freeShippingThreshold: parseFloat(data.shipping_freeShippingThreshold || '0'),
          flatRate: parseFloat(data.shipping_flatRate || '0'),
        },
        taxRate: parseFloat(data.taxRate || '0'),
        currency: data.currency || 'USD',
      };
      await settingsService.update(payload);
      toast.success('Settings saved!');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader size="lg" text="Loading settings..." />;

  return (
    <div>
      <h2 className="text-xl font-serif text-luxury-charcoal tracking-wide mb-6">Store Settings</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl space-y-6">
        <div className="bg-luxury-white border border-luxury-border rounded-xl p-6 space-y-5 shadow-sm">
          <h3 className="text-sm font-serif text-luxury-gold tracking-wider uppercase">General</h3>
          <Input label="Store Name" error={errors.storeName?.message} {...register('storeName')} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Contact Email" type="email" error={errors.contactEmail?.message} {...register('contactEmail')} />
            <Input label="Contact Phone" {...register('contactPhone')} />
          </div>
          <Input label="Address" {...register('address')} />
          <div className="border-2 border-dashed border-luxury-border rounded-xl p-8 text-center hover:border-luxury-gold/30 transition-colors cursor-pointer">
            <Upload size={24} className="mx-auto text-luxury-steel mb-2" />
            <p className="text-sm text-luxury-steel">Upload Logo</p>
            <p className="text-xs text-luxury-steel/50 mt-1">PNG, SVG, JPG (max 2MB)</p>
          </div>
        </div>

        <div className="bg-luxury-white border border-luxury-border rounded-xl p-6 space-y-5 shadow-sm">
          <h3 className="text-sm font-serif text-luxury-gold tracking-wider uppercase">Social Media</h3>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Facebook URL" placeholder="https://facebook.com/..." {...register('socialMedia_facebook')} />
            <Input label="Instagram URL" placeholder="https://instagram.com/..." {...register('socialMedia_instagram')} />
            <Input label="Twitter URL" placeholder="https://twitter.com/..." {...register('socialMedia_twitter')} />
            <Input label="YouTube URL" placeholder="https://youtube.com/..." {...register('socialMedia_youtube')} />
          </div>
        </div>

        <div className="bg-luxury-white border border-luxury-border rounded-xl p-6 space-y-5 shadow-sm">
          <h3 className="text-sm font-serif text-luxury-gold tracking-wider uppercase">SEO</h3>
          <Input label="Meta Title" {...register('seo_title')} />
          <Textarea label="Meta Description" {...register('seo_description')} />
          <Input label="Meta Keywords (comma separated)" {...register('seo_keywords')} />
        </div>

        <div className="bg-luxury-white border border-luxury-border rounded-xl p-6 space-y-5 shadow-sm">
          <h3 className="text-sm font-serif text-luxury-gold tracking-wider uppercase">Shipping & Tax</h3>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Free Shipping Threshold ($)" type="number" {...register('shipping_freeShippingThreshold')} />
            <Input label="Flat Rate ($)" type="number" {...register('shipping_flatRate')} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Tax Rate (%)" type="number" step="0.01" {...register('taxRate')} />
            <Input label="Currency" {...register('currency')} />
          </div>
        </div>

        <div className="flex items-center gap-4 pt-4">
          <Button type="submit" variant="primary" size="lg" isLoading={saving}>
            <Save size={16} /> Save Settings
          </Button>
        </div>
      </form>
    </div>
  );
}
