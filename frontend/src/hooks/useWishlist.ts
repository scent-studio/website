import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import {
  fetchWishlist,
  addToWishlist,
  removeFromWishlist,
  toggleWishlistLocal,
  clearWishlist,
} from '../store/slices/wishlistSlice';
import type { Product } from '../types';

export function useWishlist() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, wishlistIds, isLoading, error } = useSelector(
    (state: RootState) => state.wishlist
  );

  const getWishlist = useCallback(() => dispatch(fetchWishlist()).unwrap(), [dispatch]);

  const addItem = useCallback(
    (productId: string) => dispatch(addToWishlist(productId)).unwrap(),
    [dispatch]
  );

  const removeItem = useCallback(
    (productId: string) => dispatch(removeFromWishlist(productId)).unwrap(),
    [dispatch]
  );

  const toggleItem = useCallback(
    (product: Product) => {
      if (wishlistIds.includes(product._id)) {
        dispatch(removeFromWishlist(product._id));
      } else {
        dispatch(addToWishlist(product._id));
      }
    },
    [dispatch, wishlistIds]
  );

  const toggleLocal = useCallback(
    (product: Product) => dispatch(toggleWishlistLocal(product)),
    [dispatch]
  );

  const isInWishlist = useCallback(
    (productId: string) => wishlistIds.includes(productId),
    [wishlistIds]
  );

  const clearAll = useCallback(() => dispatch(clearWishlist()), [dispatch]);

  return {
    items,
    wishlistIds,
    isLoading,
    error,
    getWishlist,
    addItem,
    removeItem,
    toggleItem,
    toggleLocal,
    isInWishlist,
    clearAll,
  };
}
