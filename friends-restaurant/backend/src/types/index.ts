export interface JwtPayload {
  id: string;
  email: string;
  name: string;
}

export interface CreateMenuItemInput {
  name: string;
  description?: string;
  price?: number | null;
  categoryId: string;
  image?: string;
  isAvailable?: boolean;
  tags?: string;
  sortOrder?: number;
}

export interface UpdateMenuItemInput {
  name?: string;
  description?: string;
  price?: number | null;
  categoryId?: string;
  image?: string;
  isAvailable?: boolean;
  tags?: string;
  sortOrder?: number;
}

export interface CreateCategoryInput {
  name: string;
  slug?: string;
  description?: string;
  parentCategory?: string; // "FOOD" | "DRINKS"
  icon?: string;
  sortOrder?: number;
}

export interface UpdateCategoryInput {
  name?: string;
  slug?: string;
  description?: string;
  parentCategory?: string; // "FOOD" | "DRINKS"
  icon?: string;
  sortOrder?: number;
}

export interface ServiceRequestInput {
  tableNumber: string;
  type: 'CALL_WAITER' | 'REQUEST_BILL';
  paymentMethod?: string;
  notes?: string;
}

