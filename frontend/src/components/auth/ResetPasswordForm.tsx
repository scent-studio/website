import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Lock, ArrowLeft } from 'lucide-react';
import { cn } from '../../lib/utils';
import Button from '../ui/Button';
import Input from '../ui/Input';

const resetSchema = z
  .object({
    password: z.string().min(1, 'Password is required').min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type ResetFormData = z.infer<typeof resetSchema>;

interface ResetPasswordFormProps {
  onSubmit?: (data: ResetFormData & { token: string }) => void;
  isLoading?: boolean;
  className?: string;
}

export default function ResetPasswordForm({ onSubmit, isLoading, className }: ResetPasswordFormProps) {
  const { token: routeToken } = useParams<{ token: string }>();
  const token = routeToken || '';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),
  });

  const handleFormSubmit = (data: ResetFormData) => {
    onSubmit?.({ ...data, token });
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit(handleFormSubmit)}
      className={cn('max-w-md mx-auto space-y-5', className)}
    >
      <div className="text-center mb-6">
        <h1 className="text-2xl font-serif text-luxury-charcoal">Set New Password</h1>
        <p className="text-sm text-luxury-steel mt-2">Enter your new password below.</p>
      </div>

      <Input
        label="New Password"
        type="password"
        placeholder="Enter new password"
        error={errors.password?.message}
        {...register('password')}
      />

      <Input
        label="Confirm New Password"
        type="password"
        placeholder="Confirm new password"
        error={errors.confirmPassword?.message}
        {...register('confirmPassword')}
      />

      <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={isLoading}>
        <Lock size={18} /> Reset Password
      </Button>

      <p className="text-center">
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-sm text-luxury-steel hover:text-luxury-charcoal transition-colors"
        >
          <ArrowLeft size={14} /> Back to Sign In
        </Link>
      </p>
    </motion.form>
  );
}
