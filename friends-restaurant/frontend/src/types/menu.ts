export interface MenuItem {
  id: string;
  name: string;
  description?: string | null;
  price?: number | null;
  categoryId: string;
  category?: Category;
  image?: string | null;
  isAvailable: boolean;
  tags?: string | null;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  sortOrder: number;
  items?: MenuItem[];
  _count?: {
    items: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
}

export interface ServiceRequest {
  id: string;
  tableNumber: string;
  type: 'CALL_WAITER' | 'REQUEST_BILL';
  paymentMethod?: string | null;
  notes?: string | null;
  status: 'PENDING' | 'COMPLETED';
  createdAt: string;
}

