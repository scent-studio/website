import React from 'react';
import { motion } from 'framer-motion';
import ForgotPasswordForm from '../components/auth/ForgotPasswordForm';

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-luxury-cream px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif text-luxury-charcoal tracking-[0.12em]">Scent Studio</h1>
        </div>
        <div className="bg-luxury-white border border-luxury-border rounded-xl shadow-card p-8 md:p-10">
          <ForgotPasswordForm />
        </div>
      </motion.div>
    </div>
  );
}
