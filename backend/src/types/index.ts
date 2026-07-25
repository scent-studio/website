import { Request, Response, NextFunction } from 'express';

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'customer';
  avatar?: string;
  phone?: string;
  isVerified: boolean;
  verificationToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  addresses: IAddress[];
  createdAt?: Date;
  updatedAt?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateAuthToken(): string;
  generateRefreshToken(): string;
}

export interface IAddress {
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault: boolean;
}

export interface IProduct {
  _id?: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  images: string[];
  category: string;
  brand: string;
  price: number;
  discount?: number;
  discountedPrice?: number;
  sizes: IProductSize[];
  concentration: 'EDP' | 'EDT' | 'Parfum' | 'Cologne';
  topNotes: string[];
  middleNotes: string[];
  baseNotes: string[];
  ingredients?: string[];
  longevity?: string;
  projection?: string;
  sillage?: string;
  season?: string;
  occasion?: string;
  gender: 'male' | 'female' | 'unisex';
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
  lowStockThreshold: number;
  metaTitle?: string;
  metaDescription?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IProductSize {
  size: string;
  price: number;
  stock: number;
  sku: string;
}

export interface ICategory {
  _id?: string;
  name: string;
  slug: string;
  description: string;
  image?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IBrand {
  _id?: string;
  name: string;
  slug: string;
  description: string;
  logo?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IOrder {
  _id?: string;
  user: string;
  orderItems: IOrderItem[];
  shippingAddress: IAddress;
  billingAddress: IAddress;
  paymentMethod: string;
  paymentStatus: string;
  paymentResult?: any;
  subtotal: number;
  tax: number;
  shippingCost: number;
  discount: number;
  total: number;
  coupon?: string;
  status: 'pending' | 'confirmed' | 'packed' | 'shipped' | 'delivering' | 'delivered' | 'cancelled' | 'refunded';
  statusHistory: IStatusHistory[];
  trackingNumber?: string;
  isPaid: boolean;
  paidAt?: Date;
  isDelivered: boolean;
  deliveredAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IOrderItem {
  product: string;
  name: string;
  image: string;
  size: string;
  quantity: number;
  price: number;
}

export interface IStatusHistory {
  status: string;
  date: Date;
  note?: string;
}

export interface ICoupon {
  _id?: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrder?: number;
  maxDiscount?: number;
  usageLimit?: number;
  usageCount: number;
  isActive: boolean;
  expiresAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IReview {
  _id?: string;
  user: string;
  product: string;
  rating: number;
  title: string;
  comment: string;
  images: string[];
  isApproved: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IWishlist {
  _id?: string;
  user: string;
  products: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICart {
  _id?: string;
  user: string;
  items: ICartItem[];
  total: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICartItem {
  product: string;
  size: string;
  quantity: number;
  price: number;
}

export interface IBanner {
  _id?: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  link?: string;
  type: 'hero' | 'promotional' | 'collection';
  isActive: boolean;
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface INewsletter {
  _id?: string;
  email: string;
  isSubscribed: boolean;
  subscribedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IContactMessage {
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  isRead: boolean;
  reply?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ISettings {
  _id?: string;
  storeName: string;
  logo?: string;
  favicon?: string;
  smtp: ISmtpSettings;
  currency: ICurrencySettings;
  tax: ITaxSettings;
  shipping: IShippingSettings;
  socialMedia: ISocialMediaSettings;
  seo: ISeoSettings;
  analytics: IAnalyticsSettings;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ISmtpSettings {
  host: string;
  port: number;
  user: string;
  pass: string;
  fromEmail: string;
  fromName: string;
}

export interface ICurrencySettings {
  code: string;
  symbol: string;
  position: 'before' | 'after';
  decimalPlaces: number;
  thousandSeparator: string;
  decimalSeparator: string;
}

export interface ITaxSettings {
  rate: number;
  type: 'percentage' | 'fixed';
  includedInPrice: boolean;
}

export interface IShippingSettings {
  freeShippingThreshold: number;
  standardRate: number;
  expressRate: number;
  estimatedDelivery: string;
}

export interface ISocialMediaSettings {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  pinterest?: string;
  youtube?: string;
}

export interface ISeoSettings {
  metaTitle: string;
  metaDescription: string;
  ogImage?: string;
}

export interface IAnalyticsSettings {
  googleAnalyticsId?: string;
  facebookPixelId?: string;
}

export interface IAnalytics {
  _id?: string;
  date: Date;
  visitors: number;
  pageViews: number;
  pageViewsByRoute: Map<string, number>;
  uniqueVisitors: number;
  averageTimeOnSite: number;
  bounceRate: number;
  topProducts: ITopProduct[];
  topCategories: ITopCategory[];
  sales: number;
  orders: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ITopProduct {
  productId: string;
  name: string;
  views: number;
}

export interface ITopCategory {
  categoryId: string;
  name: string;
  views: number;
}

export interface IBlog {
  _id?: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  image?: string;
  author: string;
  tags: string[];
  isPublished: boolean;
  publishedAt?: Date;
  seo: IBlogSeo;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IBlogSeo {
  metaTitle: string;
  metaDescription: string;
  ogImage?: string;
}

export interface IGiftSet {
  _id?: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  products: IGiftSetProduct[];
  price: number;
  discount: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IGiftSetProduct {
  product: string;
  size: string;
}

export interface ICollection {
  _id?: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  products: string[];
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface JwtPayload {
  id: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface FilterParams {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  gender?: string;
  concentration?: string;
  season?: string;
  occasion?: string;
  tags?: string[];
  isFeatured?: boolean;
  isTrending?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  search?: string;
}

export interface SortParams {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  count?: number;
  pagination?: {
    page: number;
    limit: number;
    totalPages: number;
    totalItems: number;
  };
}

export interface ApiError {
  success: false;
  message: string;
  errors?: any;
  stack?: string;
}

export type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<any>;

export interface AuthRequest extends Request {
  user?: IUser;
}

export interface RequestWithUser extends Request {
  user: IUser;
}

export {};
