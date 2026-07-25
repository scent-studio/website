import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { cn } from '../../lib/utils';
import Button from '../ui/Button';
import Input from '../ui/Input';

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(1, 'New password is required').min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type PasswordFormData = z.infer<typeof passwordSchema>;

interface PasswordFormProps {
  onSubmit?: (data: PasswordFormData) => void;
  isLoading?: boolean;
  className?: string;
}

export default function PasswordForm({ onSubmit, isLoading, className }: PasswordFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  return (
    <form onSubmit={handleSubmit((data) => onSubmit?.(data))} className={cn('space-y-5', className)}>
      <Input
        label="Current Password"
        type="password"
        placeholder="Enter current password"
        error={errors.currentPassword?.message}
        {...register('currentPassword')}
      />
      <Input
        label="New Password"
        type="password"
        placeholder="Enter new password"
        error={errors.newPassword?.message}
        {...register('newPassword')}
      />
      <Input
        label="Confirm New Password"
        type="password"
        placeholder="Confirm new password"
        error={errors.confirmPassword?.message}
        {...register('confirmPassword')}
      />
      <Button type="submit" variant="primary" isLoading={isLoading}>
        Update Password
      </Button>
    </form>
  );
}
