import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Mail, CheckCircle, ArrowLeft } from 'lucide-react';
import { cn } from '../../lib/utils';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { authService } from '../../services/authService';
import toast from 'react-hot-toast';

const forgotSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
});

type ForgotFormData = z.infer<typeof forgotSchema>;

interface ForgotPasswordFormProps {
  className?: string;
}

export default function ForgotPasswordForm({ className }: ForgotPasswordFormProps) {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotFormData>({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (data: ForgotFormData) => {
    setIsLoading(true);
    try {
      await authService.forgotPassword(data.email);
      setIsSuccess(true);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('max-w-md mx-auto', className)}
    >
      {isSuccess ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-8"
        >
          <CheckCircle size={48} className="text-luxury-green mx-auto mb-4" />
          <h2 className="text-xl font-serif text-luxury-charcoal mb-2">Check Your Email</h2>
          <p className="text-sm text-luxury-steel mb-6">
            If an account exists with that email, we've sent password reset instructions.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm text-luxury-gold-dark hover:text-luxury-gold transition-colors"
          >
            <ArrowLeft size={16} /> Back to Sign In
          </Link>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-serif text-luxury-charcoal">Reset Password</h1>
            <p className="text-sm text-luxury-steel mt-2">
              Enter your email and we'll send you a reset link.
            </p>
          </div>

          <Input
            label="Email"
            type="email"
            placeholder="your@email.com"
            error={errors.email?.message}
            {...register('email')}
          />

          <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={isLoading}>
            <Mail size={18} /> Send Reset Link
          </Button>

          <p className="text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm text-luxury-steel hover:text-luxury-charcoal transition-colors"
            >
              <ArrowLeft size={14} /> Back to Sign In
            </Link>
          </p>
        </form>
      )}
    </motion.div>
  );
}
