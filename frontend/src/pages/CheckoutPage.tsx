import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { ChevronDown, ChevronUp, ChevronRight, Tag, Lock, ShieldCheck, Plus, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PageHeader from '../components/layout/PageHeader';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { formatPrice } from '../lib/utils';
import {
  getLocalCart,
  clearLocalCart,
  addToLocalCart,
  getCartSubtotal,
  calcShipping,
  calcTax,
  onCartChange,
} from '../lib/cartStorage';
import { orderService } from '../services/orderService';
import { couponService } from '../services/couponService';
import { productService } from '../services/productService';
import { rememberGuestOrder } from '../lib/guestOrders';
import type { LocalCartItem, PaymentMethod, Product } from '../types';
import toast from 'react-hot-toast';

const checkoutSchema = z.object({
  email: z.string().optional().refine((val) => !val || z.string().email().safeParse(val).success, { message: 'Invalid email' }),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().min(1, 'Phone is required'),
  shippingStreet: z.string().min(1, 'Address is required'),
  shippingApartment: z.string().optional(),
  shippingCity: z.string().min(1, 'City is required'),
  shippingZip: z.string().optional(),
  shippingCountry: z.string().min(1, 'Country is required'),
  billingSame: z.boolean(),
  billingStreet: z.string().optional(),
  billingApartment: z.string().optional(),
  billingCity: z.string().optional(),
  billingZip: z.string().optional(),
  billingCountry: z.string().optional(),
  paymentMethod: z.enum(['cash_on_delivery', 'bank_transfer']),
  notes: z.string().optional(),
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
  const [bundles, setBundles] = useState<Product[]>([]);
  const [addedBundles, setAddedBundles] = useState<Set<string>>(new Set());

  useEffect(() => {
    const cart = getLocalCart();
    if (cart.length === 0) {
      toast.error('Your cart is empty');
      navigate('/cart');
      return;
    }
    setItems(cart);
  }, [navigate]);

  useEffect(() => {
    productService.getProducts({ isGiftSet: true, limit: 4 })
      .then((res) => setBundles(res.data || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    return onCartChange(() => setItems(getLocalCart()));
  }, []);

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

  const handleAddBundle = (product: Product) => {
    const smallest = product.sizes?.[0];
    if (!smallest) return;
    addToLocalCart(product, 1, smallest.size);
    setAddedBundles((prev) => new Set(prev).add(product._id));
    toast.success(`${product.name} added to cart`);
  };

  const onSubmit = async (data: CheckoutForm) => {
    setSubmitting(true);
    try {
      const currentCart = getLocalCart();
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
        orderItems: currentCart.map((item) => ({
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
        subtotal: getCartSubtotal(currentCart),
        tax: calcTax(getCartSubtotal(currentCart)),
        shippingCost: calcShipping(getCartSubtotal(currentCart)),
        discount: couponDiscount,
        total: getCartSubtotal(currentCart) + calcShipping(getCartSubtotal(currentCart)) + calcTax(getCartSubtotal(currentCart)) - couponDiscount,
        coupon: couponId || undefined,
        notes: data.notes || undefined,
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

  const sectionTitle = (num: string, label: string) => (
    <h3 className="text-base font-serif text-luxury-gold tracking-wider uppercase mb-5">
      <span className="text-luxury-gold-dark mr-2">{num}.</span>
      {label}
    </h3>
  );

  return (
    <div>
      <PageHeader
        title="Checkout"
        subtitle="Complete your order"
        breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Cart', path: '/cart' }, { label: 'Checkout' }]}
      />
      <section className="py-16 bg-luxury-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-2 space-y-8">
              {!isAuthenticated && (
                <div className="flex flex-wrap items-center justify-between gap-3 border border-luxury-border bg-luxury-white px-5 py-4 rounded-lg">
                  <p className="text-sm text-luxury-steel">
                    You are checking out as a guest — no account needed.
                  </p>
                  <Link
                    to="/login?redirect=/checkout"
                    className="text-sm text-luxury-gold-dark underline underline-offset-4 hover:text-luxury-gold transition-colors"
                  >
                    Sign in instead
                  </Link>
                </div>
              )}

              {/* 1. Contact */}
              <div className="bg-luxury-white border border-luxury-border p-6 rounded-lg space-y-5">
                {sectionTitle('1', 'Contact Information')}
                <Input label="Email" type="email" placeholder="you@example.com" error={errors.email?.message} {...register('email')} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="First Name" placeholder="Ayesha" error={errors.firstName?.message} {...register('firstName')} />
                  <Input label="Last Name" placeholder="Khan" error={errors.lastName?.message} {...register('lastName')} />
                </div>
                <Input label="Phone" type="tel" placeholder="+92 300 1234567" error={errors.phone?.message} {...register('phone')} />
              </div>

              {/* 2. Shipping Address */}
              <div className="bg-luxury-white border border-luxury-border p-6 rounded-lg space-y-5">
                {sectionTitle('2', 'Shipping Address')}
                <div className="mb-3">
                  <label className="block text-sm font-medium text-luxury-charcoal mb-1.5">Country/Region</label>
                  <select
                    {...register('shippingCountry')}
                    className="w-full px-4 py-3 bg-luxury-white border border-luxury-border rounded-lg text-luxury-charcoal outline-none focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold/20 transition-all"
                  >
                    <option value="Pakistan">Pakistan</option>
                  </select>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="Street Address" placeholder="House 12, Street 5" error={errors.shippingStreet?.message} {...register('shippingStreet')} />
                  <Input label="Apartment (optional)" placeholder="Apt, suite, etc." {...register('shippingApartment')} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Input label="City" placeholder="Lahore" error={errors.shippingCity?.message} {...register('shippingCity')} />
                  <Input label="Postal Code (optional)" placeholder="54000" {...register('shippingZip')} />
                  <Input label="Phone" type="tel" placeholder="+92 300 1234567" error={errors.phone?.message} {...register('phone')} />
                </div>
              </div>

              {/* 3. Payment Method */}
              <div className="bg-luxury-white border border-luxury-border p-6 rounded-lg space-y-5">
                {sectionTitle('3', 'Payment Method')}
                <div className="space-y-3">
                  <label className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-all ${
                    paymentMethod === 'cash_on_delivery' ? 'border-luxury-charcoal bg-luxury-ivory/50' : 'border-luxury-border hover:border-luxury-charcoal/40'
                  }`}>
                    <input type="radio" value="cash_on_delivery" {...register('paymentMethod')} className="accent-luxury-gold" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-luxury-charcoal">Cash on Delivery (COD)</p>
                      <p className="text-xs text-luxury-steel">Pay when your order arrives</p>
                    </div>
                  </label>
                  <label className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-all ${
                    paymentMethod === 'bank_transfer' ? 'border-luxury-charcoal bg-luxury-ivory/50' : 'border-luxury-border hover:border-luxury-charcoal/40'
                  }`}>
                    <input type="radio" value="bank_transfer" {...register('paymentMethod')} className="accent-luxury-gold" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-luxury-charcoal">Bank Transfer</p>
                      <p className="text-xs text-luxury-steel">We will share account details after order</p>
                    </div>
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-luxury-charcoal mb-1.5">Order Notes (optional)</label>
                  <textarea
                    {...register('notes')}
                    placeholder="Delivery instructions, special requests..."
                    rows={3}
                    className="w-full px-4 py-3 bg-luxury-white border border-luxury-border rounded-lg text-luxury-charcoal placeholder:text-luxury-steel/50 outline-none focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold/20 transition-all resize-none"
                  />
                </div>
              </div>

              {/* 4. Billing Address */}
              <div className="bg-luxury-white border border-luxury-border p-6 rounded-lg space-y-5">
                {sectionTitle('4', 'Billing Address')}
                <div className="space-y-3">
                  <label className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-all ${
                    billingSame ? 'border-luxury-charcoal bg-luxury-ivory/50' : 'border-luxury-border hover:border-luxury-charcoal/40'
                  }`}>
                    <input type="radio" {...register('billingSame')} value="true" className="accent-luxury-gold" />
                    <span className="text-sm text-luxury-charcoal">Same as shipping address</span>
                  </label>
                  <label className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-all ${
                    !billingSame ? 'border-luxury-charcoal bg-luxury-ivory/50' : 'border-luxury-border hover:border-luxury-charcoal/40'
                  }`}>
                    <input type="radio" {...register('billingSame')} value="false" className="accent-luxury-gold" />
                    <span className="text-sm text-luxury-charcoal">Use a different billing address</span>
                  </label>
                </div>

                {!billingSame && (
                  <div className="space-y-4 mt-4">
                    <Input label="Street Address" {...register('billingStreet')} />
                    <Input label="Apartment (optional)" {...register('billingApartment')} />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input label="City" {...register('billingCity')} />
                      <Input label="Postal Code" {...register('billingZip')} />
                    </div>
                    <select
                      {...register('billingCountry')}
                      className="w-full px-4 py-3 bg-luxury-white border border-luxury-border rounded-lg text-luxury-charcoal outline-none focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold/20 transition-all"
                    >
                      <option value="Pakistan">Pakistan</option>
                    </select>
                  </div>
                )}
              </div>

              {/* 5. Add Discount */}
              <div className="bg-luxury-white border border-luxury-border p-6 rounded-lg">
                <button
                  type="button"
                  onClick={() => setDiscountOpen(!discountOpen)}
                  className="flex items-center gap-2 text-sm font-serif text-luxury-gold-dark hover:text-luxury-gold transition-colors"
                >
                  <Tag size={16} />
                  <span className="tracking-wider uppercase">Add Discount Code</span>
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
                      <div className="flex gap-2 mt-4">
                        <input
                          type="text"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                          placeholder="Enter code"
                          className="flex-1 px-4 py-2.5 border border-luxury-border rounded-lg text-sm text-luxury-charcoal outline-none focus:border-luxury-gold transition-all"
                        />
                        <button
                          type="button"
                          onClick={handleApplyCoupon}
                          disabled={applyingCoupon || !couponCode.trim()}
                          className="px-5 py-2.5 text-sm font-medium text-luxury-charcoal border border-luxury-border rounded-lg hover:bg-luxury-ivory transition-colors disabled:opacity-40"
                        >
                          {applyingCoupon ? '...' : 'Apply'}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile Order Summary */}
              <div className="lg:hidden bg-luxury-white border border-luxury-border p-6 rounded-lg space-y-4">
                {sectionTitle('5', 'Order Summary')}
                {items.map((item) => (
                  <div key={`${item.product._id}-${item.size}`} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3">
                      <div className="relative h-14 w-14 rounded-lg overflow-hidden bg-luxury-ivory shrink-0">
                        <img src={item.product.images?.[0] || item.image} alt={item.product.name} className="h-full w-full object-cover" />
                        <span className="absolute -top-1 -right-1 bg-luxury-gold text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center">{item.quantity}</span>
                      </div>
                      <div>
                        <p className="text-sm text-luxury-charcoal font-medium">{item.product.name}</p>
                        <p className="text-xs text-luxury-steel">{item.size}</p>
                      </div>
                    </div>
                    <p className="text-sm text-luxury-charcoal font-medium">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
                <div className="h-px bg-luxury-border" />
                <div className="flex justify-between text-sm text-luxury-steel"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
                <div className="flex justify-between text-sm text-luxury-steel"><span>Shipping</span><span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span></div>
                {couponDiscount > 0 && <div className="flex justify-between text-sm text-luxury-green"><span>Discount</span><span>-{formatPrice(couponDiscount)}</span></div>}
                <div className="h-px bg-luxury-border" />
                <div className="flex justify-between text-lg font-serif text-luxury-charcoal"><span>Total</span><span>{formatPrice(total)}</span></div>
              </div>

              <div className="pt-4">
                <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={submitting}>
                  <Lock size={16} />
                  Place Order — {formatPrice(total)}
                </Button>
                <p className="flex items-center justify-center gap-1.5 text-xs text-luxury-steel mt-3">
                  <ShieldCheck size={12} /> Secure checkout · We never share your details
                </p>
              </div>
            </form>

            {/* Right sidebar */}
            <div className="hidden lg:block space-y-6">
              {/* Order Summary */}
              <div className="sticky top-28 bg-luxury-white border border-luxury-border p-6 rounded-lg space-y-4 shadow-soft">
                <h3 className="text-base font-serif text-luxury-gold tracking-wider uppercase">Order Summary</h3>
                {items.map((item) => (
                  <div key={`${item.product._id}-${item.size}`} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3">
                      <div className="relative h-14 w-14 rounded-lg overflow-hidden bg-luxury-ivory shrink-0">
                        <img src={item.product.images?.[0] || item.image} alt={item.product.name} className="h-full w-full object-cover" />
                        <span className="absolute -top-1 -right-1 bg-luxury-gold text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center">{item.quantity}</span>
                      </div>
                      <div>
                        <p className="text-sm text-luxury-charcoal font-medium">{item.product.name}</p>
                        <p className="text-xs text-luxury-steel">{item.size}</p>
                      </div>
                    </div>
                    <p className="text-sm text-luxury-charcoal font-medium">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
                <div className="h-px bg-luxury-border" />
                <div className="flex justify-between text-sm text-luxury-steel"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
                <div className="flex justify-between text-sm text-luxury-steel"><span>Shipping</span><span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span></div>
                {couponDiscount > 0 && <div className="flex justify-between text-sm text-luxury-green"><span>Discount</span><span>-{formatPrice(couponDiscount)}</span></div>}
                <div className="h-px bg-luxury-border" />
                <div className="flex justify-between text-lg font-serif text-luxury-charcoal"><span>Total</span><span>{formatPrice(total)}</span></div>
                <div className="flex items-start gap-2 pt-3 text-xs text-luxury-steel">
                  <ShieldCheck size={14} className="text-luxury-gold-dark shrink-0 mt-0.5" />
                  <span>14 Days Easy Refund. Secure payment. Delivery across Pakistan.</span>
                </div>
              </div>

              {/* Bundles / Upsell */}
              {bundles.length > 0 && (
                <div className="bg-luxury-white border border-luxury-border p-6 rounded-lg shadow-soft">
                  <h3 className="text-base font-serif text-luxury-gold tracking-wider uppercase mb-4">Complete Your Order</h3>
                  <p className="text-xs text-luxury-steel mb-4">Add a gift set to your order</p>
                  <div className="space-y-4">
                    {bundles.map((bundle) => {
                      const added = addedBundles.has(bundle._id);
                      const price = bundle.sizes?.[0]?.price || 0;
                      return (
                        <div key={bundle._id} className="flex items-center gap-3 p-3 border border-luxury-border rounded-lg hover:border-luxury-gold/30 transition-colors">
                          <Link to={`/product/${bundle.slug}`} className="shrink-0">
                            <img
                              src={bundle.images?.[0] || ''}
                              alt={bundle.name}
                              className="h-16 w-16 rounded-lg object-cover bg-luxury-ivory"
                            />
                          </Link>
                          <div className="flex-1 min-w-0">
                            <Link to={`/product/${bundle.slug}`}>
                              <p className="text-sm font-medium text-luxury-charcoal truncate hover:text-luxury-gold-dark transition-colors">{bundle.name}</p>
                            </Link>
                            <p className="text-sm text-luxury-gold-dark font-medium mt-0.5">{formatPrice(price)}</p>
                            {bundle.sizes?.[0]?.size && (
                              <p className="text-[11px] text-luxury-steel mt-0.5">{bundle.sizes[0].size}</p>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => !added && handleAddBundle(bundle)}
                            disabled={added}
                            className={`shrink-0 h-8 w-8 rounded-full flex items-center justify-center transition-all ${
                              added
                                ? 'bg-luxury-green text-white'
                                : 'bg-luxury-gold/10 text-luxury-gold-dark hover:bg-luxury-gold hover:text-white'
                            }`}
                          >
                            {added ? <Check size={14} /> : <Plus size={14} />}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
