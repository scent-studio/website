import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import {
  fetchCart,
  addItem,
  updateItem,
  removeItem,
  clearCartItems,
  applyCoupon,
  removeCoupon,
  setShipping,
} from '../store/slices/cartSlice';

export function useCart() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, totalQuantity, totalPrice, coupon, discount, shipping, isLoading, error } =
    useSelector((state: RootState) => state.cart);

  const getCart = useCallback(() => dispatch(fetchCart()).unwrap(), [dispatch]);

  const addToCart = useCallback(
    (data: { product: string; quantity: number; size?: string }) =>
      dispatch(addItem(data)).unwrap(),
    [dispatch]
  );

  const updateCartItem = useCallback(
    (itemId: string, data: { quantity: number; size?: string }) =>
      dispatch(updateItem({ itemId, data })).unwrap(),
    [dispatch]
  );

  const removeFromCart = useCallback(
    (itemId: string) => dispatch(removeItem(itemId)).unwrap(),
    [dispatch]
  );

  const clearCart = useCallback(() => dispatch(clearCartItems()).unwrap(), [dispatch]);

  const applyCouponToCart = useCallback(
    (code: string, discountValue: number, discountType: 'percentage' | 'fixed') =>
      dispatch(applyCoupon({ code, discount: discountValue, discountType })),
    [dispatch]
  );

  const removeCouponFromCart = useCallback(
    () => dispatch(removeCoupon()),
    [dispatch]
  );

  const updateShipping = useCallback(
    (cost: number) => dispatch(setShipping(cost)),
    [dispatch]
  );

  const subtotal = totalPrice;
  const grandTotal = subtotal - discount + shipping;

  return {
    items,
    totalQuantity,
    totalPrice,
    subtotal,
    discount,
    shipping,
    grandTotal,
    coupon,
    isLoading,
    error,
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    applyCouponToCart,
    removeCouponFromCart,
    updateShipping,
  };
}
