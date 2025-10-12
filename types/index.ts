export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'user' | 'member' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: User;
  category: 'coffee' | 'tea' | 'recipes' | 'culture' | 'lifestyle';
  tags: string[];
  publishedAt: Date;
  updatedAt: Date;
  readTime: number;
  featuredImage?: string;
  language: 'en' | 'fa';
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  category: 'digital' | 'physical' | 'course';
  type: 'ebook' | 'journal' | 'wallpaper' | 'coffee' | 'mug' | 'tea' | 'course';
  images: string[];
  digitalFile?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // in minutes
  lessons: Lesson[];
  instructor: User;
  thumbnail: string;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: number;
  order: number;
  isFree: boolean;
  courseId: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  currency: string;
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: string;
  paymentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  price: number;
}

export interface Membership {
  id: string;
  userId: string;
  type: 'monthly' | 'yearly';
  status: 'active' | 'expired' | 'cancelled';
  startDate: Date;
  endDate: Date;
  createdAt: Date;
}

