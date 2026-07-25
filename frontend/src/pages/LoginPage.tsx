import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import LoginForm from '../components/auth/LoginForm';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, isLoading } = useAuth();

  const redirectTo = searchParams.get('redirect');
  const safeRedirect = redirectTo?.startsWith('/') ? redirectTo : null;

  useEffect(() => {
    if (localStorage.getItem('token')) navigate(safeRedirect || '/');
  }, [navigate, safeRedirect]);

  const handleLogin = async (data: { email: string; password: string; rememberMe?: boolean }) => {
    try {
      await login({ email: data.email, password: data.password });
      toast.success('Welcome back!');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (safeRedirect) navigate(safeRedirect);
      else if (user.role === 'admin') navigate('/admin');
      else navigate('/');
    } catch (err: any) {
      toast.error(err?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-luxury-cream px-4 py-16 relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 right-0 w-[32rem] h-[32rem] bg-gradient-to-bl from-luxury-gold/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -left-32 w-80 h-80 bg-gradient-to-tr from-luxury-gold/3 to-transparent rounded-full blur-2xl" />
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
          <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
        </div>
      </motion.div>
    </div>
  );
}
