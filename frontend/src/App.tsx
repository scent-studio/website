import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from './store';
import { fetchCart } from './store/slices/cartSlice';

import Layout from './components/layout/Layout';
import AdminLayout from './components/admin/AdminLayout';

import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CategoriesPage from './pages/CategoriesPage';
import CategoryProductsPage from './pages/CategoryProductsPage';
import NewArrivalsPage from './pages/NewArrivalsPage';
import BestSellersPage from './pages/BestSellersPage';
import OffersPage from './pages/OffersPage';
import CollectionsPage from './pages/CollectionsPage';
import CollectionDetailPage from './pages/CollectionDetailPage';
import WishlistPage from './pages/WishlistPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import FAQPage from './pages/FAQPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsPage from './pages/TermsPage';
import ShippingPolicyPage from './pages/ShippingPolicyPage';
import ReturnPolicyPage from './pages/ReturnPolicyPage';
import BlogPage from './pages/BlogPage';
import BlogDetailPage from './pages/BlogDetailPage';
import NotFoundPage from './pages/NotFoundPage';
import UserDashboardLayout from './pages/user/UserDashboardLayout';
import UserDashboardHome from './pages/user/UserDashboardHome';
import UserOrdersPage from './pages/user/UserOrdersPage';
import UserOrderDetailPage from './pages/user/UserOrderDetailPage';
import UserWishlistPage from './pages/user/UserWishlistPage';
import UserAddressesPage from './pages/user/UserAddressesPage';
import UserProfilePage from './pages/user/UserProfilePage';
import UserPasswordPage from './pages/user/UserPasswordPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminProductFormPage from './pages/admin/AdminProductFormPage';
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminOrderDetailPage from './pages/admin/AdminOrderDetailPage';
import AdminCustomersPage from './pages/admin/AdminCustomersPage';
import AdminReviewsPage from './pages/admin/AdminReviewsPage';
import AdminCouponsPage from './pages/admin/AdminCouponsPage';
import AdminBannersPage from './pages/admin/AdminBannersPage';
import AdminNewsletterPage from './pages/admin/AdminNewsletterPage';
import AdminMessagesPage from './pages/admin/AdminMessagesPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = !!localStorage.getItem('token');
  if (!isAuthenticated) {
    window.location.href = '/login';
    return null;
  }
  return <>{children}</>;
}

function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAdmin = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user') || '{}').role === 'admin';
  if (!localStorage.getItem('token')) {
    window.location.href = '/login';
    return null;
  }
  if (!isAdmin) {
    window.location.href = '/';
    return null;
  }
  return <>{children}</>;
}

function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function AppContent() {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();

  useEffect(() => {
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      if (Array.isArray(cart) && cart.some((i: any) => i.product?._id?.startsWith?.('demo'))) {
        localStorage.setItem('cart', '[]');
      }
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      if (Array.isArray(wishlist) && wishlist.some((i: any) => i._id?.startsWith?.('demo'))) {
        localStorage.setItem('wishlist', '[]');
      }
    } catch {}
    if (localStorage.getItem('token')) {
      dispatch(fetchCart());
    }
  }, [dispatch]);

  const isAdminRoute = location.pathname.startsWith('/admin');

  if (isAdminRoute) {
    return (
      <Routes>
        <Route path="/admin" element={<AdminProtectedRoute><AdminLayout><PageTransition><AdminDashboardPage /></PageTransition></AdminLayout></AdminProtectedRoute>} />
        <Route path="/admin/products" element={<AdminProtectedRoute><AdminLayout><PageTransition><AdminProductsPage /></PageTransition></AdminLayout></AdminProtectedRoute>} />
        <Route path="/admin/products/new" element={<AdminProtectedRoute><AdminLayout><PageTransition><AdminProductFormPage /></PageTransition></AdminLayout></AdminProtectedRoute>} />
        <Route path="/admin/products/edit/:id" element={<AdminProtectedRoute><AdminLayout><PageTransition><AdminProductFormPage /></PageTransition></AdminLayout></AdminProtectedRoute>} />
        <Route path="/admin/categories" element={<AdminProtectedRoute><AdminLayout><PageTransition><AdminCategoriesPage /></PageTransition></AdminLayout></AdminProtectedRoute>} />
        <Route path="/admin/orders" element={<AdminProtectedRoute><AdminLayout><PageTransition><AdminOrdersPage /></PageTransition></AdminLayout></AdminProtectedRoute>} />
        <Route path="/admin/orders/:id" element={<AdminProtectedRoute><AdminLayout><PageTransition><AdminOrderDetailPage /></PageTransition></AdminLayout></AdminProtectedRoute>} />
        <Route path="/admin/customers" element={<AdminProtectedRoute><AdminLayout><PageTransition><AdminCustomersPage /></PageTransition></AdminLayout></AdminProtectedRoute>} />
        <Route path="/admin/reviews" element={<AdminProtectedRoute><AdminLayout><PageTransition><AdminReviewsPage /></PageTransition></AdminLayout></AdminProtectedRoute>} />
        <Route path="/admin/coupons" element={<AdminProtectedRoute><AdminLayout><PageTransition><AdminCouponsPage /></PageTransition></AdminLayout></AdminProtectedRoute>} />
        <Route path="/admin/banners" element={<AdminProtectedRoute><AdminLayout><PageTransition><AdminBannersPage /></PageTransition></AdminLayout></AdminProtectedRoute>} />
        <Route path="/admin/newsletter" element={<AdminProtectedRoute><AdminLayout><PageTransition><AdminNewsletterPage /></PageTransition></AdminLayout></AdminProtectedRoute>} />
        <Route path="/admin/messages" element={<AdminProtectedRoute><AdminLayout><PageTransition><AdminMessagesPage /></PageTransition></AdminLayout></AdminProtectedRoute>} />
        <Route path="/admin/settings" element={<AdminProtectedRoute><AdminLayout><PageTransition><AdminSettingsPage /></PageTransition></AdminLayout></AdminProtectedRoute>} />
      </Routes>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Layout><PageTransition><HomePage /></PageTransition></Layout>} />
        <Route path="/shop" element={<Layout><PageTransition><ShopPage /></PageTransition></Layout>} />
        <Route path="/shop/:slug" element={<Layout><PageTransition><ProductDetailPage /></PageTransition></Layout>} />
        <Route path="/product/:slug" element={<Layout><PageTransition><ProductDetailPage /></PageTransition></Layout>} />
        <Route path="/categories" element={<Layout><PageTransition><CategoriesPage /></PageTransition></Layout>} />
        <Route path="/categories/:slug" element={<Layout><PageTransition><CategoryProductsPage /></PageTransition></Layout>} />
        <Route path="/new-arrivals" element={<Layout><PageTransition><NewArrivalsPage /></PageTransition></Layout>} />
        <Route path="/best-sellers" element={<Layout><PageTransition><BestSellersPage /></PageTransition></Layout>} />
        <Route path="/offers" element={<Layout><PageTransition><OffersPage /></PageTransition></Layout>} />
        <Route path="/collections" element={<Layout><PageTransition><CollectionsPage /></PageTransition></Layout>} />
        <Route path="/collections/:slug" element={<Layout><PageTransition><CollectionDetailPage /></PageTransition></Layout>} />
        <Route path="/wishlist" element={<Layout><PageTransition><WishlistPage /></PageTransition></Layout>} />
        <Route path="/cart" element={<Layout><PageTransition><CartPage /></PageTransition></Layout>} />
        <Route path="/checkout" element={<Layout><PageTransition><CheckoutPage /></PageTransition></Layout>} />
        <Route path="/order-success/:id" element={<Layout><PageTransition><OrderSuccessPage /></PageTransition></Layout>} />
        <Route path="/login" element={<Layout><PageTransition><LoginPage /></PageTransition></Layout>} />
        <Route path="/register" element={<Layout><PageTransition><RegisterPage /></PageTransition></Layout>} />
        <Route path="/forgot-password" element={<Layout><PageTransition><ForgotPasswordPage /></PageTransition></Layout>} />
        <Route path="/reset-password/:token" element={<Layout><PageTransition><ResetPasswordPage /></PageTransition></Layout>} />
        <Route path="/about" element={<Layout><PageTransition><AboutPage /></PageTransition></Layout>} />
        <Route path="/contact" element={<Layout><PageTransition><ContactPage /></PageTransition></Layout>} />
        <Route path="/faq" element={<Layout><PageTransition><FAQPage /></PageTransition></Layout>} />
        <Route path="/privacy-policy" element={<Layout><PageTransition><PrivacyPolicyPage /></PageTransition></Layout>} />
        <Route path="/privacy" element={<Layout><PageTransition><PrivacyPolicyPage /></PageTransition></Layout>} />
        <Route path="/terms" element={<Layout><PageTransition><TermsPage /></PageTransition></Layout>} />
        <Route path="/shipping-policy" element={<Layout><PageTransition><ShippingPolicyPage /></PageTransition></Layout>} />
        <Route path="/shipping" element={<Layout><PageTransition><ShippingPolicyPage /></PageTransition></Layout>} />
        <Route path="/return-policy" element={<Layout><PageTransition><ReturnPolicyPage /></PageTransition></Layout>} />
        <Route path="/returns" element={<Layout><PageTransition><ReturnPolicyPage /></PageTransition></Layout>} />
        <Route path="/returns-exchanges" element={<Layout><PageTransition><ReturnPolicyPage /></PageTransition></Layout>} />
        <Route path="/blog" element={<Layout><PageTransition><BlogPage /></PageTransition></Layout>} />
        <Route path="/blog/:slug" element={<Layout><PageTransition><BlogDetailPage /></PageTransition></Layout>} />
        <Route path="/account" element={<ProtectedRoute><UserDashboardLayout><PageTransition><UserDashboardHome /></PageTransition></UserDashboardLayout></ProtectedRoute>} />
        <Route path="/account/orders" element={<ProtectedRoute><UserDashboardLayout><PageTransition><UserOrdersPage /></PageTransition></UserDashboardLayout></ProtectedRoute>} />
        <Route path="/account/order/:id" element={<ProtectedRoute><UserDashboardLayout><PageTransition><UserOrderDetailPage /></PageTransition></UserDashboardLayout></ProtectedRoute>} />
        <Route path="/account/wishlist" element={<ProtectedRoute><UserDashboardLayout><PageTransition><UserWishlistPage /></PageTransition></UserDashboardLayout></ProtectedRoute>} />
        <Route path="/account/addresses" element={<ProtectedRoute><UserDashboardLayout><PageTransition><UserAddressesPage /></PageTransition></UserDashboardLayout></ProtectedRoute>} />
        <Route path="/account/profile" element={<ProtectedRoute><UserDashboardLayout><PageTransition><UserProfilePage /></PageTransition></UserDashboardLayout></ProtectedRoute>} />
        <Route path="/account/password" element={<ProtectedRoute><UserDashboardLayout><PageTransition><UserPasswordPage /></PageTransition></UserDashboardLayout></ProtectedRoute>} />
        <Route path="*" element={<Layout><PageTransition><NotFoundPage /></PageTransition></Layout>} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppContent />
    </BrowserRouter>
  );
}

