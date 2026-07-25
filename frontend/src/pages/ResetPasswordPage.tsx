import React from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import ResetPasswordForm from '../components/auth/ResetPasswordForm';
import toast from 'react-hot-toast';

export default function ResetPasswordPage() {
  const { token } = useParams<{ token: string }>();
  const { resetPassword, isLoading } = useAuth();

  const handleResetPassword = async (data: { password: string; confirmPassword: string; token: string }) => {
    if (!token) {
      toast.error('Invalid reset link');
      return;
    }
    try {
      await resetPassword({ token, password: data.password, passwordConfirm: data.confirmPassword });
      toast.success('Password reset successfully!');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to reset password');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-luxury-cream px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-luxury-white border border-luxury-border rounded-xl shadow-card p-8 md:p-10">
          <ResetPasswordForm onSubmit={handleResetPassword} isLoading={isLoading} />
        </div>
      </motion.div>
    </div>
  );
}
