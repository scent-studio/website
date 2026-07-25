import React from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { UserPlus } from 'lucide-react';
import { cn } from '../../lib/utils';
import Button from '../ui/Button';
import Input from '../ui/Input';

const registerSchema = z
  .object({
    name: z.string().min(1, 'Name is required').min(2, 'Name must be at least 2 characters'),
    email: z.string().min(1, 'Email is required').email('Invalid email address'),
    password: z.string().min(1, 'Password is required').min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  onSubmit?: (data: RegisterFormData) => void;
  isLoading?: boolean;
  className?: string;
}

export default function RegisterForm({ onSubmit, isLoading, className }: RegisterFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit((data) => onSubmit?.(data))}
      className={cn('space-y-5', className)}
    >
      <div className="text-center mb-6">
        <h1 className="text-2xl font-serif text-luxury-charcoal">Create Account</h1>
        <p className="text-sm text-luxury-steel mt-2">Join the Scent Studio family</p>
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
        label="Password"
        type="password"
        placeholder="Create a password"
        error={errors.password?.message}
        {...register('password')}
      />

      <Input
        label="Confirm Password"
        type="password"
        placeholder="Confirm your password"
        error={errors.confirmPassword?.message}
        {...register('confirmPassword')}
      />

      <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={isLoading}>
        <UserPlus size={18} /> Create Account
      </Button>

      <p className="text-center text-sm text-luxury-steel">
        Already have an account?{' '}
        <Link to="/login" className="text-luxury-gold-dark hover:text-luxury-gold transition-colors font-medium">
          Sign In
        </Link>
      </p>
    </motion.form>
  );
}
