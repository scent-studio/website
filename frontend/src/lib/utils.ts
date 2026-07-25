import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function cnx(...inputs: ClassValue[]) {
  return cn(inputs);
}

/** Prices in the database are stored in PKR. */
export function formatPrice(price: number, currency: string = 'PKR'): string {
  const amount = Math.round(Number(price) || 0);
  if (currency === 'PKR') {
    return `Rs. ${amount.toLocaleString('en-PK')}`;
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getDisplayPrice(product: {
  price: number;
  discount?: number;
  discountedPrice?: number;
}): { price: number; original?: number; hasDiscount: boolean; percent: number } {
  const hasDiscount = !!(product.discount && product.discount > 0);
  const price = hasDiscount && product.discountedPrice
    ? product.discountedPrice
    : product.price;
  return {
    price,
    original: hasDiscount ? product.price : undefined,
    hasDiscount,
    percent: product.discount || 0,
  };
}

export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return new Intl.DateTimeFormat('en-US', options || defaultOptions).format(
    typeof date === 'string' ? new Date(date) : date
  );
}

export function truncate(str: string, length: number = 100): string {
  if (!str) return '';
  if (str.length <= length) return str;
  return str.slice(0, length).trimEnd() + '...';
}

export function generateSlug(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function getInitials(name: string): string {
  if (!name) return '';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function calculateDiscount(originalPrice: number, discountedPrice: number): number {
  if (originalPrice <= 0) return 0;
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
}
