import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Camera } from 'lucide-react';
import { cn } from '../../lib/utils';
import Button from '../ui/Button';
import Input from '../ui/Input';

const profileSchema = z.object({
  name: z.string().min(1, 'Name is required').min(2, 'Name must be at least 2 characters'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  phone: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  initialData?: { name: string; email: string; phone?: string; avatar?: string };
  onSubmit?: (data: ProfileFormData) => void;
  isLoading?: boolean;
  className?: string;
}

export default function ProfileForm({ initialData, onSubmit, isLoading, className }: ProfileFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: initialData,
  });

  return (
    <form onSubmit={handleSubmit((data) => onSubmit?.(data))} className={cn('space-y-6', className)}>
      <div className="flex items-center gap-5">
        <div className="relative group">
          <div className="h-20 w-20 flex items-center justify-center bg-luxury-ink border border-luxury-gold/20 text-luxury-gold text-2xl font-medium overflow-hidden">
            {initialData?.avatar ? (
              <img src={initialData.avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              initialData?.name?.charAt(0)?.toUpperCase() || 'U'
            )}
          </div>
          <button className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera size={18} className="text-white" />
          </button>
        </div>
        <div>
          <p className="text-sm text-luxury-charcoal font-medium">{initialData?.name}</p>
          <p className="text-xs text-luxury-steel">Click to change photo</p>
        </div>
      </div>

      <Input
        label="Full Name"
        placeholder="John Doe"
        error={errors.name?.message}
        {...register('name')}
      />
      <Input
        label="Email"
        type="email"
        placeholder="your@email.com"
        error={errors.email?.message}
        {...register('email')}
      />
      <Input
        label="Phone (optional)"
        type="tel"
        placeholder="+1 (555) 123-4567"
        error={errors.phone?.message}
        {...register('phone')}
      />

      <Button type="submit" variant="primary" isLoading={isLoading}>
        Save Changes
      </Button>
    </form>
  );
}
