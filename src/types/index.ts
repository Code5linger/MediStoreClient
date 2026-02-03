export type UserRole = 'CUSTOMER' | 'SELLER' | 'ADMIN';
export type UserStatus = 'ACTIVE' | 'BANNED';
export type OrderStatus =
  | 'PLACED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  phone?: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Medicine {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  image?: string;
  categoryId: number;
  sellerId: string;
  createdAt: string;
  updatedAt: string;
  category?: Category;
  seller?: User;
}

export interface OrderItem {
  id: number;
  orderId: number;
  medicineId: number;
  quantity: number;
  price: number;
  medicine?: Medicine;
}

export interface Order {
  id: number;
  customerId: string;
  shippingAddress: string;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  customer?: User;
}

export interface Review {
  id: number;
  customerId: string;
  medicineId: number;
  rating: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
  customer?: User;
  medicine?: Medicine;
}

export interface CartItem {
  medicine: Medicine;
  quantity: number;
}
