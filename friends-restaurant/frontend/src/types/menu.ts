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
  parentCategory: 'FOOD' | 'DRINKS' | string;
  icon?: string | null;
  sortOrder: number;
  items?: MenuItem[];
  _count?: {
    items: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface SiteSettings {
  id: string;
  restaurantName: string;
  tagline: string;
  heroTitle1: string;
  heroTitle2: string;
  heroDescription: string;
  primaryCtaText: string;
  secondaryCtaText: string;

  wifiSsid: string;
  wifiPassword: string;

  philosophyEyebrow: string;
  philosophyTitle: string;
  philosophyDescription: string;
  manifestoQuote: string;
  manifestoAuthor: string;

  galleryTitle: string;
  galleryDescription: string;

  addressLine1: string;
  addressLine2: string;
  openingHours: string;
  phone1: string;
  phone2: string;
  instagramHandle: string;
  instagramUrl: string;
  tiktokHandle: string;
  tiktokUrl: string;
  facebookHandle: string;
  facebookUrl: string;

  accentColor: string;
  backgroundColor: string;
  cardColor: string;
  fontFamily: string;

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
