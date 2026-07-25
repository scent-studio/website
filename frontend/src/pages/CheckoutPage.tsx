import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { ChevronRight, ChevronLeft, CreditCard, Check, Banknote } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
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
import { rememberGuestOrder } from '../lib/guestOrders';
import type { LocalCartItem, PaymentMethod } from '../types';
import toast from 'react-hot-toast';

const checkoutSchema = z.object({
  email: z.string().optional().refine((val) => !val || z.string().email().safeParse(val).success, { message: 'Invalid email' }),
  firstName: z.string().min(1, 'Required'),
  lastName: z.string().min(1, 'Required'),
  phone: z.string().min(1, 'Required'),
  shippingStreet: z.string().min(1, 'Required'),
  shippingCity: z.string().min(1, 'Required'),
  shippingState: z.string().min(1, 'Required'),
  shippingZip: z.string().min(1, 'Required'),
  shippingCountry: z.string().min(1, 'Required'),
  sameAsBilling: z.boolean(),
  billingStreet: z.string().optional(),
  billingCity: z.string().optional(),
  billingState: z.string().optional(),
  billingZip: z.string().optional(),
  billingCountry: z.string().optional(),
  paymentMethod: z.enum(['cash_on_delivery', 'bank_transfer']),
  notes: z.string().optional(),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

const steps = ['Information', 'Shipping', 'Billing', 'Payment', 'Review'];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const [items, setItems] = useState<LocalCartItem[]>([]);
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const cart = getLocalCart();
    if (cart.length === 0) {
      toast.error('Your cart is empty');
      navigate('/cart');
      return;
    }
    setItems(cart);
  }, [navigate]);

  const totalPrice = getCartSubtotal(items);
  const shipping = calcShipping(totalPrice);
  const tax = calcTax(totalPrice);
  const discount = 0;
  const total = totalPrice + shipping + tax - discount;

  const { register, handleSubmit, watch, formState: { errors }, trigger, setValue } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      email: user?.email || '',
      firstName: user?.name?.split(' ')[0] || '',
      lastName: user?.name?.split(' ').slice(1).join(' ') || '',
      phone: user?.phone || '',
      shippingCountry: 'Pakistan',
      sameAsBilling: true,
      paymentMethod: 'cash_on_delivery',
    },
  });

  useEffect(() => {
    if (user?.email) setValue('email', user.email);
    if (user?.phone) setValue('phone', user.phone);
  }, [user, setValue]);

  const sameAsBilling = watch('sameAsBilling');
  const paymentMethod = watch('paymentMethod');

  const validateStep = async () => {
    let fields: (keyof CheckoutForm)[] = [];
    if (step === 0) fields = ['firstName', 'lastName', 'phone'];
    else if (step === 1) {
      fields = ['shippingStreet', 'shippingCity', 'shippingState', 'shippingZip', 'shippingCountry'];
    } else if (step === 2 && !sameAsBilling) {
      fields = ['billingStreet', 'billingCity', 'billingState', 'billingZip', 'billingCountry'];
    } else if (step === 3) fields = ['paymentMethod'];
    const valid = await trigger(fields);
    if (valid) setStep((s) => Math.min(s + 1, steps.length - 1));
  };

  const onSubmit = async (data: CheckoutForm) => {
    if (step < steps.length - 1) {
      await validateStep();
      return;
    }
    setSubmitting(true);
    try {
      const makeAddress = (prefix: 'shipping' | 'billing') => ({
        name: `${data.firstName} ${data.lastName}`.trim(),
        phone: data.phone,
        street: (data[`${prefix}Street` as keyof CheckoutForm] as string) || data.shippingStreet,
        city: (data[`${prefix}City` as keyof CheckoutForm] as string) || data.shippingCity,
        state: (data[`${prefix}State` as keyof CheckoutForm] as string) || data.shippingState,
        zip: (data[`${prefix}Zip` as keyof CheckoutForm] as string) || data.shippingZip,
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
        billingAddress: data.sameAsBilling ? makeAddress('shipping') : makeAddress('billing'),
        paymentMethod: data.paymentMethod as PaymentMethod,
        subtotal: totalPrice,
        tax,
        shippingCost: shipping,
        discount,
        total,
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

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="bg-luxury-white border border-luxury-border p-6 space-y-5">
            <h3 className="text-lg font-serif text-luxury-charcoal">Customer Information</h3>
            <Input label="Email" type="email" placeholder="you@example.com" error={errors.email?.message} {...register('email')} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="First Name" placeholder="Ayesha" error={errors.firstName?.message} {...register('firstName')} />
              <Input label="Last Name" placeholder="Khan" error={errors.lastName?.message} {...register('lastName')} />
            </div>
            <Input label="Phone" type="tel" placeholder="+92 300 1234567" error={errors.phone?.message} {...register('phone')} />
          </div>
        );
      case 1:
        return (
          <div className="bg-luxury-white border border-luxury-border p-6 space-y-5">
            <h3 className="text-lg font-serif text-luxury-charcoal">Shipping Address</h3>
            <Input label="Street Address" placeholder="House 12, Street 5" error={errors.shippingStreet?.message} {...register('shippingStreet')} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="City" placeholder="Lahore" error={errors.shippingCity?.message} {...register('shippingCity')} />
              <Input label="Province" placeholder="Punjab" error={errors.shippingState?.message} {...register('shippingState')} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Postal Code" placeholder="54000" error={errors.shippingZip?.message} {...register('shippingZip')} />
              <Input label="Country" placeholder="Pakistan" error={errors.shippingCountry?.message} {...register('shippingCountry')} />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="bg-luxury-white border border-luxury-border p-6 space-y-5">
            <h3 className="text-lg font-serif text-luxury-charcoal">Billing Address</h3>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" {...register('sameAsBilling')} className="w-4 h-4 accent-luxury-gold" />
              <span className="text-sm text-luxury-charcoal">Same as shipping address</span>
            </label>
            {!sameAsBilling && (
              <div className="space-y-4 mt-4">
                <Input label="Street Address" {...register('billingStreet')} />
                <div className="grid grid-cols-2 gap-4">
                  <Input label="City" {...register('billingCity')} />
                  <Input label="Province" {...register('billingState')} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Postal Code" {...register('billingZip')} />
                  <Input label="Country" {...register('billingCountry')} />
                </div>
              </div>
            )}
          </div>
        );
      case 3:
        return (
          <div className="bg-luxury-white border border-luxury-border p-6 space-y-5">
            <h3 className="text-lg font-serif text-luxury-charcoal">Payment Method</h3>
            <label className={`flex items-center gap-4 p-4 border cursor-pointer transition-colors ${paymentMethod === 'cash_on_delivery' ? 'border-luxury-charcoal bg-luxury-warm' : 'border-luxury-border hover:border-luxury-charcoal/40'}`}>
              <input type="radio" value="cash_on_delivery" {...register('paymentMethod')} className="accent-luxury-gold" />
              <Banknote size={20} className="text-luxury-gold-dark" />
              <div>
                <p className="text-sm font-medium text-luxury-charcoal">Cash on Delivery</p>
                <p className="text-xs text-luxury-steel">Pay when your order arrives</p>
              </div>
            </label>
            <label className={`flex items-center gap-4 p-4 border cursor-pointer transition-colors ${paymentMethod === 'bank_transfer' ? 'border-luxury-charcoal bg-luxury-warm' : 'border-luxury-border hover:border-luxury-charcoal/40'}`}>
              <input type="radio" value="bank_transfer" {...register('paymentMethod')} className="accent-luxury-gold" />
              <CreditCard size={20} className="text-luxury-gold-dark" />
              <div>
                <p className="text-sm font-medium text-luxury-charcoal">Bank Transfer</p>
                <p className="text-xs text-luxury-steel">We will share account details after order</p>
              </div>
            </label>
            <Textarea label="Order Notes (optional)" placeholder="Delivery instructions..." {...register('notes')} />
          </div>
        );
      case 4:
        return (
          <div className="space-y-5">
            <h3 className="text-lg font-serif text-luxury-charcoal">Order Review</h3>
            <div className="bg-luxury-white border border-luxury-border p-4 space-y-3">
              {items.map((item) => (
                <div key={`${item.product._id}-${item.size}`} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <img src={item.product.images?.[0] || item.image} alt={item.product.name} className="h-12 w-12 object-cover" />
                    <div>
                      <p className="text-luxury-charcoal">{item.product.name}</p>
                      <p className="text-xs text-luxury-steel">{item.size} · Qty {item.quantity}</p>
                    </div>
                  </div>
                  <p className="text-luxury-charcoal font-medium">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
            <div className="bg-luxury-white border border-luxury-border p-4 space-y-2 text-sm">
              <div className="flex justify-between text-luxury-steel"><span>Subtotal</span><span>{formatPrice(totalPrice)}</span></div>
              <div className="flex justify-between text-luxury-steel"><span>Shipping</span><span>{shipping === 0 ? 'Complimentary' : formatPrice(shipping)}</span></div>
              {tax > 0 && <div className="flex justify-between text-luxury-steel"><span>Tax</span><span>{formatPrice(tax)}</span></div>}
              <div className="h-px bg-luxury-border my-2" />
              <div className="flex justify-between text-lg font-serif text-luxury-charcoal"><span>Total</span><span>{formatPrice(total)}</span></div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <PageHeader
        title="Checkout"
        subtitle="Complete your order"
        breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Cart', path: '/cart' }, { label: 'Checkout' }]}
      />
      <section className="py-16 bg-luxury-cream">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center mb-10 flex-wrap gap-y-2">
            {steps.map((s, idx) => (
              <div key={s} className="flex items-center">
                <div className={`flex items-center gap-2 ${idx <= step ? 'text-luxury-charcoal' : 'text-luxury-steel'}`}>
                  <div className={`h-8 w-8 flex items-center justify-center text-xs font-medium border ${idx <= step ? 'bg-luxury-ink text-white border-luxury-ink' : 'bg-luxury-white text-luxury-steel border-luxury-border'}`}>
                    {idx < step ? <Check size={14} /> : idx + 1}
                  </div>
                  <span className="text-xs hidden md:inline tracking-wide">{s}</span>
                </div>
                {idx < steps.length - 1 && <div className={`h-px w-6 sm:w-8 mx-1 sm:mx-2 ${idx < step ? 'bg-luxury-ink' : 'bg-luxury-border'}`} />}
              </div>
            ))}
          </div>

          {!isAuthenticated && step === 0 && (
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border border-luxury-border bg-luxury-white px-5 py-4">
              <p className="text-sm text-luxury-steel">
                You are checking out as a guest — no account needed.
              </p>
              <Link
                to="/login?redirect=/checkout"
                className="text-sm text-luxury-charcoal underline underline-offset-4 hover:text-luxury-gold-dark transition-colors"
              >
                Sign in instead
              </Link>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.25 }}
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center justify-between mt-8 pt-6 border-t border-luxury-border">
              <Button type="button" variant="ghost" size="md" onClick={() => setStep((s) => Math.max(s - 1, 0))} disabled={step === 0}>
                <ChevronLeft size={16} /> Back
              </Button>
              {step === steps.length - 1 ? (
                <Button type="submit" variant="primary" size="lg" isLoading={submitting}>
                  Place Order — {formatPrice(total)}
                </Button>
              ) : (
                <Button type="button" variant="primary" size="lg" onClick={validateStep}>
                  Next <ChevronRight size={16} />
                </Button>
              )}
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
