import type { Product } from '../types';

const WISHLIST_KEY = 'wishlist';
const WISHLIST_EVENT = 'wishlist-updated';

export type WishlistItem = {
  _id: string;
  name: string;
  slug: string;
  images: string[];
  price: number;
  discount?: number;
  discountedPrice?: number;
  rating?: number;
  numReviews?: number;
  brand?: { name: string } | string;
};

function toWishlistItem(product: Product | WishlistItem): WishlistItem {
  const brand =
    typeof product.brand === 'object' && product.brand
      ? { name: product.brand.name }
      : product.brand;

  return {
    _id: product._id,
    name: product.name,
    slug: product.slug,
    images: product.images || [],
    price: product.price,
    discount: product.discount,
    discountedPrice: product.discountedPrice,
    rating: product.rating,
    numReviews: (product as Product).numReviews,
    brand,
  };
}

export function getLocalWishlist(): WishlistItem[] {
  try {
    const raw = localStorage.getItem(WISHLIST_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveLocalWishlist(items: WishlistItem[]): void {
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(WISHLIST_EVENT));
  window.dispatchEvent(new Event('storage'));
}

export function isInLocalWishlist(productId: string): boolean {
  return getLocalWishlist().some((item) => item._id === productId);
}

export function addToLocalWishlist(product: Product | WishlistItem): WishlistItem[] {
  const items = getLocalWishlist();
  if (items.some((item) => item._id === product._id)) return items;
  items.push(toWishlistItem(product));
  saveLocalWishlist(items);
  return items;
}

export function removeFromLocalWishlist(productId: string): WishlistItem[] {
  const items = getLocalWishlist().filter((item) => item._id !== productId);
  saveLocalWishlist(items);
  return items;
}

/** Returns true if the product is now in the wishlist. */
export function toggleLocalWishlist(product: Product | WishlistItem): boolean {
  if (isInLocalWishlist(product._id)) {
    removeFromLocalWishlist(product._id);
    return false;
  }
  addToLocalWishlist(product);
  return true;
}

export function onWishlistChange(callback: () => void): () => void {
  const handler = () => callback();
  window.addEventListener(WISHLIST_EVENT, handler);
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener(WISHLIST_EVENT, handler);
    window.removeEventListener('storage', handler);
  };
}
