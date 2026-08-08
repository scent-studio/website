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

type SizeLike = { size?: string; price?: number };

function normalizeSizeLabel(size: string): string {
  return String(size || '')
    .toLowerCase()
    .replace(/\s+/g, '');
}

/** Find a size row; prefers an exact/contains match for preferredSize (e.g. 100ml). */
export function findProductSize<T extends SizeLike>(
  sizes: T[] | undefined,
  preferredSize?: string
): T | undefined {
  if (!sizes?.length) return undefined;
  if (preferredSize) {
    const needle = normalizeSizeLabel(preferredSize);
    const needleNum = needle.replace(/ml$/, '');
    const match = sizes.find((s) => {
      const n = normalizeSizeLabel(s.size || '');
      return n === needle || n.includes(needle) || (needleNum && n.includes(needleNum));
    });
    if (match) return match;
  }
  return sizes[0];
}

export function getDisplayPrice(
  product: {
    price: number;
    discount?: number;
    discountedPrice?: number;
    sizes?: SizeLike[];
  },
  preferredSize?: string
): { price: number; original?: number; hasDiscount: boolean; percent: number; sizeLabel?: string } {
  const hasDiscount = !!(product.discount && product.discount > 0);
  const size = findProductSize(product.sizes, preferredSize);
  const sizePrice = size?.price != null ? Number(size.price) : 0;

  // Prefer the concrete size price (e.g. 100ml) when present
  if (size && sizePrice > 0) {
    const mrp = Number(product.price) || sizePrice;
    const sale = Number(product.discountedPrice) || 0;

    // Single size: product-level sale price is the source of truth when discounted
    if (hasDiscount && sale > 0 && (product.sizes?.length || 0) <= 1) {
      return {
        price: sale,
        original: Math.max(mrp, sizePrice),
        hasDiscount: true,
        percent: product.discount || 0,
        sizeLabel: size.size,
      };
    }

    // Multi-size: if this size's price matches MRP, apply product discount
    if (hasDiscount && sale > 0 && Math.abs(sizePrice - mrp) < 1) {
      return {
        price: sale,
        original: sizePrice,
        hasDiscount: true,
        percent: product.discount || 0,
        sizeLabel: size.size,
      };
    }

    // Otherwise show the size's own price
    if (hasDiscount && sale > 0 && sale < sizePrice && (product.sizes?.length || 0) <= 1) {
      return {
        price: sale,
        original: sizePrice,
        hasDiscount: true,
        percent: product.discount || 0,
        sizeLabel: size.size,
      };
    }

    return {
      price: sizePrice,
      original: hasDiscount && mrp > sizePrice ? mrp : undefined,
      hasDiscount: !!(hasDiscount && mrp > sizePrice),
      percent: product.discount || 0,
      sizeLabel: size.size,
    };
  }

  const price =
    hasDiscount && product.discountedPrice ? product.discountedPrice : product.price;
  return {
    price: Number(price) || 0,
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
