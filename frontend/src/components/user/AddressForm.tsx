import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { cn } from '../../lib/utils';
import Button from '../ui/Button';
import Input from '../ui/Input';
import type { Address } from '../../types';

const addressSchema = z.object({
  street: z.string().min(1, 'Street address is required'),
  apartment: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zip: z.string().min(1, 'ZIP code is required'),
  country: z.string().min(1, 'Country is required'),
});

export type AddressFormData = z.infer<typeof addressSchema>;

interface AddressFormProps {
  initialData?: Address;
  onSubmit?: (data: AddressFormData) => void;
  isLoading?: boolean;
  className?: string;
}

export default function AddressForm({ initialData, onSubmit, isLoading, className }: AddressFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: initialData,
  });

  return (
    <form onSubmit={handleSubmit((data) => onSubmit?.(data))} className={cn('space-y-4', className)}>
      <Input
        label="Street Address"
        placeholder="123 Main Street"
        error={errors.street?.message}
        {...register('street')}
      />
      <Input
        label="Apartment / Suite (optional)"
        placeholder="Apt 4B"
        error={errors.apartment?.message}
        {...register('apartment')}
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="City"
          placeholder="New York"
          error={errors.city?.message}
          {...register('city')}
        />
        <Input
          label="State"
          placeholder="NY"
          error={errors.state?.message}
          {...register('state')}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="ZIP Code"
          placeholder="10001"
          error={errors.zip?.message}
          {...register('zip')}
        />
        <Input
          label="Country"
          placeholder="United States"
          error={errors.country?.message}
          {...register('country')}
        />
      </div>
      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" variant="primary" isLoading={isLoading}>
          Save Address
        </Button>
      </div>
    </form>
  );
}
