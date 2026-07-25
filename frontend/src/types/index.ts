export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'packed'
  | 'shipped'
  | 'delivering'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export const ORDER_STATUSES: OrderStatus[] = [
  'pending',
  'confirmed',
  'packed',
  'shipped',
  'delivering',
  'delivered',
  'cancelled',
  'refunded',
];

export type PaymentMethod =
  | 'credit_card'
  | 'debit_card'
  | 'paypal'
  | 'stripe'
  | 'bank_transfer'
  | 'cash_on_delivery';

export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';

export type Gender = 'male' | 'female' | 'unisex';

export type PerformanceLevel =
  | 'Very Poor'
  | 'Poor'
  | 'Moderate'
  | 'Good'
  | 'Very Good'
  | 'Excellent';

export interface Address {
  _id?: string;
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault?: boolean;
}

export interface ProductSize {
  size: string;
  price: number;
  stock: number;
  sku: string;
  _id?: string;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  images: string[];
  category: Category | string;
  brand: Brand | string;
  price: number;
  discount: number;
  discountedPrice: number;
  sizes: ProductSize[];
  topNotes: string[];
  middleNotes: string[];
  baseNotes: string[];
  ingredients?: string[];
  longevity?: PerformanceLevel;
  projection?: PerformanceLevel;
  sillage?: PerformanceLevel;
  season?: string;
  occasion?: string;
  gender: Gender;
  tags: string[];
  isFeatured: boolean;
  isTrending: boolean;
  isBestSeller: boolean;
  isNewArrival: boolean;
  isLimitedEdition: boolean;
  isGiftSet: boolean;
  isVisible: boolean;
  rating: number;
  numReviews: number;
  totalSales: number;
  stock: number;
  lowStockThreshold?: number;
  metaTitle?: string;
  metaDescription?: string;
  /** Virtuals from API */
  inStock?: boolean;
  isOutOfStock?: boolean;
  isLowStock?: boolean;
  stockQuantity?: number;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Brand {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  website?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Review {
  _id: string;
  product: Product | string;
  user: User | string;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'customer';
  avatar?: string;
  phone?: string;
  addresses: Address[];
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  product: Product | string;
  name: string;
  image: string;
  size: string;
  quantity: number;
  price: number;
}

export interface GuestInfo {
  name?: string;
  email?: string;
  phone?: string;
}

export interface Order {
  _id: string;
  user?: User | string | null;
  guestInfo?: GuestInfo;
  isGuestOrder?: boolean;
  orderItems: OrderItem[];
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  /** Virtual alias for status */
  orderStatus?: OrderStatus;
  subtotal: number;
  shippingCost: number;
  tax: number;
  discount: number;
  coupon?: Coupon | string;
  total: number;
  trackingNumber?: string;
  statusHistory?: { status: string; date: string; note?: string }[];
  isPaid?: boolean;
  paidAt?: string;
  isDelivered?: boolean;
  deliveredAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LocalCartItem {
  product: {
    _id: string;
    name: string;
    images: string[];
    price: number;
    slug?: string;
    discount?: number;
    discountedPrice?: number;
  };
  quantity: number;
  size: string;
  price: number;
  name?: string;
  image?: string;
}

export interface CartItem {
  _id?: string;
  product: Product | string;
  quantity: number;
  size: string;
  price?: number;
}

export interface Wishlist {
  _id: string;
  user: User | string;
  products: Product[];
  createdAt: string;
  updatedAt: string;
}

export interface Banner {
  _id: string;
  title: string;
  subtitle?: string;
  description?: string;
  image: string;
  link?: string;
  type?: 'hero' | 'promotional' | 'collection';
  order?: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Coupon {
  _id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrder: number;
  maxDiscount: number;
  usageLimit: number;
  usageCount: number;
  isActive: boolean;
  expiresAt: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  image?: string;
  author?: string | User;
  tags?: string[];
  isPublished: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Collection {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  products: Product[] | string[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Settings {
  _id: string;
  storeName: string;
  logo?: string;
  favicon?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  currency: string;
  taxRate?: number;
  shipping?: {
    freeShippingThreshold?: number;
    flatRate?: number;
  };
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
  };
  seo?: {
    title?: string;
    description?: string;
    keywords?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  isRead: boolean;
  reply?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Newsletter {
  _id: string;
  email: string;
  isSubscribed: boolean;
  subscribedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    totalItems?: number;
    hasNextPage?: boolean;
    hasPrevPage?: boolean;
  };
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
  statusCode: number;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

export interface CreateOrderPayload {
  orderItems: {
    product: string;
    name: string;
    image: string;
    size: string;
    quantity: number;
    price: number;
  }[];
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: PaymentMethod;
  subtotal: number;
  tax: number;
  shippingCost: number;
  discount: number;
  total: number;
  coupon?: string;
  guestInfo?: GuestInfo;
}

export interface FilterState {
  categories: string[];
  brands: string[];
  priceRange: [number, number];
  sizes: string[];
  gender: string[];
  rating: number | null;
  search: string;
  tags: string[];
  inStock: boolean | null;
}

export type SortOption =
  | 'price-asc'
  | 'price-desc'
  | 'name-asc'
  | 'name-desc'
  | 'rating'
  | 'newest'
  | 'popular';

export interface PaginationState {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
