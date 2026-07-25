import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import RegisterForm from '../components/auth/RegisterForm';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, isLoading, error } = useAuth();

  useEffect(() => {
    if (localStorage.getItem('token')) navigate('/');
  }, [navigate]);

  const handleRegister = async (data: { name: string; email: string; password: string; confirmPassword: string }) => {
    try {
      await register({ name: data.name, email: data.email, password: data.password, passwordConfirm: data.confirmPassword });
      toast.success('Account created successfully!');
      navigate('/');
    } catch (err: any) {
      toast.error(err?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-luxury-cream px-4 py-16 relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-16 w-[28rem] h-[28rem] bg-gradient-to-br from-luxury-gold/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-0 w-72 h-72 bg-gradient-to-tl from-luxury-gold/3 to-transparent rounded-full blur-2xl" />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="text-center mb-10">
          <h1 className="text-3xl font-serif text-luxury-gold-dark tracking-[0.15em]">Scent Studio</h1>
          <p className="text-xs text-luxury-steel tracking-[0.25em] uppercase mt-2 font-sans">Luxury Fragrances</p>
        </div>
        <div className="bg-luxury-white rounded-xl shadow-card p-8 md:p-10 border border-luxury-border">
          <RegisterForm onSubmit={handleRegister} isLoading={isLoading} />
        </div>
      </motion.div>
    </div>
  );
}
