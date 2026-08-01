import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { ChevronDown, ChevronUp, ChevronRight, Tag, Lock, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { formatPrice } from '../lib/utils';
import {
  getLocalCart,
  clearLocalCart,
  getCartSubtotal,
  calcShipping,
  calcTax,
} from '../lib/cartStorage';
import { orderService } from '../services/orderService';
import { couponService } from '../services/couponService';
import { rememberGuestOrder } from '../lib/guestOrders';
import type { LocalCartItem, PaymentMethod } from '../types';
import toast from 'react-hot-toast';

const checkoutSchema = z.object({
  email: z.string().optional().refine((val) => !val || z.string().email().safeParse(val).success, { message: 'Invalid email' }),
  firstName: z.string().min(1, 'Required'),
  lastName: z.string().min(1, 'Required'),
  phone: z.string().min(1, 'Required'),
  shippingStreet: z.string().min(1, 'Required'),
  shippingApartment: z.string().optional(),
  shippingCity: z.string().min(1, 'Required'),
  shippingZip: z.string().optional(),
  shippingCountry: z.string().min(1, 'Required'),
  billingSame: z.boolean(),
  billingStreet: z.string().optional(),
  billingApartment: z.string().optional(),
  billingCity: z.string().optional(),
  billingZip: z.string().optional(),
  billingCountry: z.string().optional(),
  paymentMethod: z.enum(['cash_on_delivery', 'bank_transfer']),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const [items, setItems] = useState<LocalCartItem[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [discountOpen, setDiscountOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponId, setCouponId] = useState('');
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  useEffect(() => {
    const cart = getLocalCart();
    if (cart.length === 0) {
      toast.error('Your cart is empty');
      navigate('/cart');
      return;
    }
    setItems(cart);
  }, [navigate]);

  const subtotal = getCartSubtotal(items);
  const shipping = calcShipping(subtotal);
  const tax = calcTax(subtotal);
  const total = subtotal + shipping + tax - couponDiscount;

  const { register, handleSubmit, watch, formState: { errors } } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      email: user?.email || '',
      firstName: user?.name?.split(' ')[0] || '',
      lastName: user?.name?.split(' ').slice(1).join(' ') || '',
      phone: user?.phone || '',
      shippingCountry: 'Pakistan',
      billingSame: true,
      paymentMethod: 'cash_on_delivery',
    },
  });

  const billingSame = watch('billingSame');
  const paymentMethod = watch('paymentMethod');

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setApplyingCoupon(true);
    try {
      const res = await couponService.validate(couponCode, subtotal);
      if (res.success && res.data?.discountAmount) {
        setCouponDiscount(res.data.discountAmount);
        setCouponId(res.data.coupon?._id || '');
        toast.success('Coupon applied!');
      } else {
        toast.error(res.message || 'Invalid coupon');
      }
    } catch {
      toast.error('Invalid coupon code');
    } finally {
      setApplyingCoupon(false);
    }
  };

  const onSubmit = async (data: CheckoutForm) => {
    setSubmitting(true);
    try {
      const makeAddress = (prefix: 'shipping' | 'billing') => ({
        name: `${data.firstName} ${data.lastName}`.trim(),
        phone: data.phone,
        street: (data[`${prefix}Street` as keyof CheckoutForm] as string) || data.shippingStreet,
        apartment: (data[`${prefix}Apartment` as keyof CheckoutForm] as string) || '',
        city: (data[`${prefix}City` as keyof CheckoutForm] as string) || data.shippingCity,
        state: '',
        zip: (data[`${prefix}Zip` as keyof CheckoutForm] as string) || '',
        country: (data[`${prefix}Country` as keyof CheckoutForm] as string) || data.shippingCountry,
      });

      const orderData = {
        orderItems: items.map((item) => ({
          product: item.product._id,
          name: item.product.name || item.name || '',
          image: item.product.images?.[0] || item.image || '',
          size: item.size || '',
          quantity: item.quantity,
          price: item.price,
        })),
        shippingAddress: makeAddress('shipping'),
        billingAddress: data.billingSame ? makeAddress('shipping') : makeAddress('billing'),
        paymentMethod: data.paymentMethod as PaymentMethod,
        subtotal,
        tax,
        shippingCost: shipping,
        discount: couponDiscount,
        total,
        coupon: couponId || undefined,
        ...(isAuthenticated
          ? {}
          : {
              guestInfo: {
                name: `${data.firstName} ${data.lastName}`.trim(),
                ...(data.email ? { email: data.email } : {}),
                phone: data.phone,
              },
            }),
      };

      const res = await orderService.createOrder(orderData);
      clearLocalCart();
      if (!isAuthenticated) {
        rememberGuestOrder({
          _id: res.data._id,
          total: res.data.total,
          email: data.email,
          createdAt: res.data.createdAt || new Date().toISOString(),
        });
      }
      toast.success('Order placed successfully!');
      navigate(`/order-success/${res.data._id}`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to place order');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Top bar */}
      <div className="bg-luxury-white border-b border-luxury-border">
        <div className="max-w-xl mx-auto px-6 py-4 flex items-center justify-center">
          <Link to="/" className="text-xl font-serif text-luxury-charcoal tracking-[0.12em]">
            {import.meta.env.VITE_STORE_NAME || 'Elyscents'}
          </Link>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-6 py-8">
        {/* Collapsible Order Summary (mobile top) */}
        <div className="lg:hidden mb-6 border border-luxury-border rounded-lg overflow-hidden">
          <button
            type="button"
            onClick={() => setSummaryOpen(!summaryOpen)}
            className="w-full flex items-center justify-between px-5 py-4 bg-luxury-white"
          >
            <span className="text-sm text-luxury-charcoal font-medium">Order summary</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-luxury-charcoal">{formatPrice(total)}</span>
              {summaryOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
          </button>
          <AnimatePresence>
            {summaryOpen && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                className="overflow-hidden"
              >
                <div className="px-5 pb-4 space-y-3">
                  {items.map((item) => (
                    <div key={`${item.product._id}-${item.size}`} className="flex items-center gap-3">
                      <div className="relative h-12 w-12 rounded-md overflow-hidden bg-luxury-ivory shrink-0">
                        <img src={item.product.images?.[0] || item.image} alt={item.product.name} className="h-full w-full object-cover" />
                        <span className="absolute -top-1 -right-1 bg-luxury-steel text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center">{item.quantity}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-luxury-charcoal truncate">{item.product.name}</p>
                        {item.size && <p className="text-xs text-luxury-steel">{item.size}</p>}
                      </div>
                      <span className="text-sm text-luxury-charcoal">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                  <div className="border-t border-luxury-border pt-3 space-y-2">
                    <div className="flex justify-between text-sm text-luxury-steel">
                      <span>Subtotal</span><span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-luxury-steel">
                      <span>Shipping</span><span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                    </div>
                    {couponDiscount > 0 && (
                      <div className="flex justify-between text-sm text-luxury-green">
                        <span>Discount</span><span>-{formatPrice(couponDiscount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-base font-medium text-luxury-charcoal pt-2 border-t border-luxury-border">
                      <span>Total</span><span>PKR {formatPrice(total)}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Contact */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-medium text-luxury-charcoal">Contact</h2>
              {!isAuthenticated && (
                <Link to="/login?redirect=/checkout" className="text-sm text-luxury-gold-dark hover:underline flex items-center gap-1">
                  Sign in <ChevronRight size={14} />
                </Link>
              )}
            </div>
            <Input
              type="email"
              placeholder="Email or mobile phone number"
              error={errors.email?.message}
              {...register('email')}
            />
            <label className="flex items-center gap-2 mt-3 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded border-luxury-border accent-luxury-gold" defaultChecked />
              <span className="text-sm text-luxury-steel">Email me with news and offers</span>
            </label>
          </div>

          {/* Delivery */}
          <div className="mb-8">
            <h2 className="text-xl font-medium text-luxury-charcoal mb-4">Delivery</h2>

            <div className="mb-4">
              <label className="block text-sm text-luxury-steel mb-1.5">Country/Region</label>
              <select
                {...register('shippingCountry')}
                className="w-full px-4 py-3 border border-luxury-border rounded-lg text-luxury-charcoal bg-luxury-white outline-none focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold/20 transition-all"
              >
                <option value="Pakistan">Pakistan</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <Input placeholder="First name" error={errors.firstName?.message} {...register('firstName')} />
              <Input placeholder="Last name" error={errors.lastName?.message} {...register('lastName')} />
            </div>

            <div className="mb-3">
              <Input placeholder="Address" error={errors.shippingStreet?.message} {...register('shippingStreet')} />
            </div>

            <div className="mb-3">
              <Input placeholder="Apartment, suite, etc. (optional)" {...register('shippingApartment')} />
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <Input placeholder="City" error={errors.shippingCity?.message} {...register('shippingCity')} />
              <Input placeholder="Postal code (optional)" {...register('shippingZip')} />
            </div>

            <div className="mb-3">
              <Input type="tel" placeholder="Phone" error={errors.phone?.message} {...register('phone')} />
            </div>

            <label className="flex items-center gap-2 mt-3 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded border-luxury-border accent-luxury-gold" defaultChecked />
              <span className="text-sm text-luxury-steel">Save this information for next time</span>
            </label>
          </div>

          {/* Shipping method */}
          <div className="mb-8">
            <h2 className="text-xl font-medium text-luxury-charcoal mb-4">Shipping method</h2>
            <div className="flex items-center justify-between p-4 border border-luxury-charcoal rounded-lg bg-luxury-white">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full border-4 border-luxury-charcoal" />
                <span className="text-sm text-luxury-charcoal">Standard</span>
              </div>
              <span className="text-sm text-luxury-charcoal">{formatPrice(shipping)}</span>
            </div>
          </div>

          {/* Payment */}
          <div className="mb-8">
            <h2 className="text-xl font-medium text-luxury-charcoal mb-1">Payment</h2>
            <p className="text-sm text-luxury-steel mb-4">All transactions are secure and encrypted.</p>

            <div className="space-y-3">
              <label className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-all ${
                paymentMethod === 'cash_on_delivery' ? 'border-luxury-charcoal' : 'border-luxury-border hover:border-luxury-charcoal/50'
              }`}>
                <input type="radio" value="cash_on_delivery" {...register('paymentMethod')} className="accent-luxury-gold" />
                <span className="text-sm font-medium text-luxury-charcoal flex-1">Cash on Delivery (COD)</span>
              </label>

              <label className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-all ${
                paymentMethod === 'bank_transfer' ? 'border-luxury-charcoal' : 'border-luxury-border hover:border-luxury-charcoal/50'
              }`}>
                <input type="radio" value="bank_transfer" {...register('paymentMethod')} className="accent-luxury-gold" />
                <span className="text-sm font-medium text-luxury-charcoal flex-1">Bank Transfer</span>
              </label>
            </div>
          </div>

          {/* Billing address */}
          <div className="mb-8">
            <h2 className="text-xl font-medium text-luxury-charcoal mb-4">Billing address</h2>
            <div className="space-y-3">
              <label className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-all ${
                billingSame ? 'border-luxury-charcoal' : 'border-luxury-border hover:border-luxury-charcoal/50'
              }`}>
                <input type="radio" {...register('billingSame')} value="true" className="accent-luxury-gold" />
                <span className="text-sm text-luxury-charcoal">Same as shipping address</span>
              </label>

              <label className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-all ${
                !billingSame ? 'border-luxury-charcoal' : 'border-luxury-border hover:border-luxury-charcoal/50'
              }`}>
                <input type="radio" {...register('billingSame')} value="false" className="accent-luxury-gold" />
                <span className="text-sm text-luxury-charcoal">Use a different billing address</span>
              </label>

              {!billingSame && (
                <div className="mt-4 space-y-3 pl-0 border-l-0">
                  <Input placeholder="Address" {...register('billingStreet')} />
                  <Input placeholder="Apartment, suite, etc. (optional)" {...register('billingApartment')} />
                  <div className="grid grid-cols-2 gap-3">
                    <Input placeholder="City" {...register('billingCity')} />
                    <Input placeholder="Postal code (optional)" {...register('billingZip')} />
                  </div>
                  <select
                    {...register('billingCountry')}
                    className="w-full px-4 py-3 border border-luxury-border rounded-lg text-luxury-charcoal bg-luxury-white outline-none focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold/20 transition-all"
                  >
                    <option value="Pakistan">Pakistan</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Add discount */}
          <div className="mb-8">
            <button
              type="button"
              onClick={() => setDiscountOpen(!discountOpen)}
              className="flex items-center gap-2 text-sm text-luxury-charcoal hover:text-luxury-gold-dark transition-colors"
            >
              <Tag size={16} />
              <span>Add discount</span>
              {discountOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            <AnimatePresence>
              {discountOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex gap-2 mt-3">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Discount code"
                      className="flex-1 px-4 py-2.5 border border-luxury-border rounded-lg text-sm text-luxury-charcoal outline-none focus:border-luxury-gold transition-all"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      disabled={applyingCoupon || !couponCode.trim()}
                      className="px-4 py-2.5 text-sm font-medium text-luxury-charcoal border border-luxury-border rounded-lg hover:bg-luxury-ivory transition-colors disabled:opacity-40"
                    >
                      {applyingCoupon ? '...' : 'Apply'}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Desktop Order Summary */}
          <div className="hidden lg:block mb-6 border border-luxury-border rounded-lg p-5">
            <div className="space-y-3">
              {items.map((item) => (
                <div key={`${item.product._id}-${item.size}`} className="flex items-center gap-3">
                  <div className="relative h-12 w-12 rounded-md overflow-hidden bg-luxury-ivory shrink-0">
                    <img src={item.product.images?.[0] || item.image} alt={item.product.name} className="h-full w-full object-cover" />
                    <span className="absolute -top-1 -right-1 bg-luxury-steel text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center">{item.quantity}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-luxury-charcoal truncate">{item.product.name}</p>
                    {item.size && <p className="text-xs text-luxury-steel">{item.size}</p>}
                  </div>
                  <span className="text-sm text-luxury-charcoal">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-luxury-border mt-3 pt-3 space-y-2">
              <div className="flex justify-between text-sm text-luxury-steel">
                <span>Subtotal</span><span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-luxury-steel">
                <span>Shipping</span><span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-sm text-luxury-green">
                  <span>Discount</span><span>-{formatPrice(couponDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-medium text-luxury-charcoal pt-2 border-t border-luxury-border">
                <span>Total</span><span>PKR {formatPrice(total)}</span>
              </div>
            </div>
          </div>

          {/* Mobile Total + CTA */}
          <div className="lg:hidden mb-4">
            <div className="flex justify-between items-center mb-3">
              <span className="text-lg font-medium text-luxury-charcoal">Total</span>
              <span className="text-lg font-medium text-luxury-charcoal">PKR {formatPrice(total)}</span>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full rounded-lg"
            isLoading={submitting}
          >
            <Lock size={16} />
            Complete order
          </Button>

          <div className="flex items-center justify-center gap-2 mt-4 mb-8">
            <Lock size={12} className="text-luxury-steel" />
            <span className="text-xs text-luxury-steel">All transactions are secure and encrypted</span>
          </div>
        </form>
      </div>
    </div>
  );
}
