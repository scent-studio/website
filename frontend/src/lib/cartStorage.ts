import type { LocalCartItem, Product } from '../types';

const CART_KEY = 'cart';
const CART_EVENT = 'cart-updated';

export function getLocalCart(): LocalCartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveLocalCart(items: LocalCartItem[]): void {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(CART_EVENT));
  window.dispatchEvent(new Event('storage'));
}

export function clearLocalCart(): void {
  saveLocalCart([]);
}

export function getCartItemCount(items: LocalCartItem[] = getLocalCart()): number {
  return items.reduce((sum, item) => sum + (item.quantity || 0), 0);
}

export function getCartSubtotal(items: LocalCartItem[] = getLocalCart()): number {
  return items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0);
}

export function getProductUnitPrice(product: Partial<Product>, size?: string): number {
  if (size && product.sizes?.length) {
    const match = product.sizes.find((s) => s.size === size);
    if (match) return match.price;
  }
  if (product.discount && product.discount > 0 && product.discountedPrice) {
    return product.discountedPrice;
  }
  return product.price || 0;
}

export function addToLocalCart(
  product: Product,
  quantity: number,
  size: string
): LocalCartItem[] {
  const cart = getLocalCart();
  const price = getProductUnitPrice(product, size);
  const existing = cart.find(
    (item) => item.product?._id === product._id && item.size === size
  );

  if (existing) {
    existing.quantity += quantity;
    existing.price = price;
  } else {
    cart.push({
      product: {
        _id: product._id,
        name: product.name,
        images: product.images || [],
        price: product.price,
        slug: product.slug,
        discount: product.discount,
        discountedPrice: product.discountedPrice,
      },
      quantity,
      size,
      price,
      name: product.name,
      image: product.images?.[0] || '',
    });
  }

  saveLocalCart(cart);
  return cart;
}

export function updateLocalCartQuantity(
  productId: string,
  size: string,
  quantity: number
): LocalCartItem[] {
  let cart = getLocalCart();
  if (quantity < 1) {
    cart = cart.filter(
      (item) => !(item.product?._id === productId && item.size === size)
    );
  } else {
    cart = cart.map((item) =>
      item.product?._id === productId && item.size === size
        ? { ...item, quantity }
        : item
    );
  }
  saveLocalCart(cart);
  return cart;
}

export function removeFromLocalCart(productId: string, size?: string): LocalCartItem[] {
  const cart = getLocalCart().filter((item) => {
    if (item.product?._id !== productId) return true;
    if (size === undefined) return false;
    return item.size !== size;
  });
  saveLocalCart(cart);
  return cart;
}

export function onCartChange(callback: () => void): () => void {
  const handler = () => callback();
  window.addEventListener(CART_EVENT, handler);
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener(CART_EVENT, handler);
    window.removeEventListener('storage', handler);
  };
}

/** Free shipping threshold and flat rate in PKR */
export const SHIPPING = {
  freeThreshold: 15000,
  flatRate: 299,
  taxRate: 0,
} as const;

export function calcShipping(subtotal: number): number {
  return subtotal >= SHIPPING.freeThreshold ? 0 : SHIPPING.flatRate;
}

export function calcTax(subtotal: number): number {
  return Math.round(subtotal * SHIPPING.taxRate);
}
