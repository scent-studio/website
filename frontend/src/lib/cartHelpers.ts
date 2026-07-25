import type { LocalCartItem } from '../types';
import {
  getLocalCart,
  saveLocalCart,
  clearLocalCart,
  getCartSubtotal,
  calcShipping,
  calcTax,
  onCartChange,
  removeFromLocalCart,
  updateLocalCartQuantity,
} from '../lib/cartStorage';
import { formatPrice } from '../lib/utils';
import { couponService } from '../services/couponService';

export {
  getLocalCart,
  saveLocalCart,
  clearLocalCart,
  getCartSubtotal,
  calcShipping,
  calcTax,
  onCartChange,
  removeFromLocalCart,
  updateLocalCartQuantity,
  formatPrice,
};

export async function validateCouponCode(code: string, subtotal: number) {
  const res = await couponService.validate(code, subtotal);
  return res.data;
}

export function buildOrderTotals(items: LocalCartItem[], discount = 0) {
  const subtotal = getCartSubtotal(items);
  const shippingCost = calcShipping(subtotal);
  const tax = calcTax(subtotal);
  const total = Math.max(0, subtotal + shippingCost + tax - discount);
  return { subtotal, shippingCost, tax, discount, total };
}
