import React from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { cn } from '../../lib/utils';
import Button from '../ui/Button';
import Input from '../ui/Input';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(1, 'Password is required').min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSubmit?: (data: LoginFormData) => void;
  isLoading?: boolean;
  className?: string;
}

export default function LoginForm({ onSubmit, isLoading, className }: LoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit((data) => onSubmit?.(data))}
      className={cn('space-y-5', className)}
    >
      <div className="text-center mb-6">
        <h1 className="text-2xl font-serif text-luxury-charcoal">Welcome Back</h1>
        <p className="text-sm text-luxury-steel mt-2">Sign in to your Scent Studio account</p>
      </div>

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
        placeholder="Enter your password"
        error={errors.password?.message}
        {...register('password')}
      />

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            {...register('rememberMe')}
            className="w-4 h-4 border border-luxury-border rounded checked:bg-luxury-gold checked:border-luxury-gold accent-luxury-gold"
          />
          <span className="text-sm text-luxury-steel">Remember me</span>
        </label>
        <Link
          to="/forgot-password"
          className="text-sm text-luxury-gold-dark hover:text-luxury-gold transition-colors"
        >
          Forgot Password?
        </Link>
      </div>

      <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={isLoading}>
        <LogIn size={18} /> Sign In
      </Button>

      <p className="text-center text-sm text-luxury-steel">
        Don&apos;t have an account?{' '}
        <Link to="/register" className="text-luxury-gold-dark hover:text-luxury-gold transition-colors font-medium">
          Create one
        </Link>
      </p>
    </motion.form>
  );
}
