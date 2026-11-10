import { MenuItem, Category, AdminUser, ServiceRequest, SiteSettings } from '../types/menu';

const API_BASE = import.meta.env.VITE_API_URL || '';

class ApiClient {
  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    return sessionStorage.getItem('friends_admin_token');
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getAuthToken();
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string> || {}),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Only set Content-Type to application/json if body is not FormData
    if (options.body && !(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`;

    const res = await fetch(url, {
      ...options,
      headers,
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      const errorMsg = data?.error || data?.message || `Request failed with status ${res.status}`;
      throw new Error(errorMsg);
    }

    return data;
  }

  // --- Auth ---
  async login(usernameOrEmail: string, password: string): Promise<{ success: boolean; token: string; admin: AdminUser }> {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username: usernameOrEmail, email: usernameOrEmail, password }),
    });
  }

  async getMe(): Promise<{ success: boolean; admin: AdminUser }> {
    return this.request('/api/auth/me');
  }

  async updateProfile(data: {
    email?: string;
    name?: string;
    currentPassword?: string;
    newPassword?: string;
  }): Promise<{ success: boolean; message: string; admin: AdminUser }> {
    return this.request('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // --- Site Settings CMS ---
  async getSettings(): Promise<{ success: boolean; data: SiteSettings }> {
    return this.request('/api/settings');
  }

  async updateSettings(data: Partial<SiteSettings>): Promise<{ success: boolean; message: string; data: SiteSettings }> {
    return this.request('/api/settings', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async resetSettings(): Promise<{ success: boolean; message: string; data: SiteSettings }> {
    return this.request('/api/settings/reset', {
      method: 'POST',
    });
  }

  // --- Menu & Items ---
  async getMenu(): Promise<{ success: boolean; data: Category[] }> {
    return this.request('/api/menu');
  }

  async getItems(search?: string, categoryId?: string): Promise<{ success: boolean; data: MenuItem[] }> {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (categoryId && categoryId !== 'all') params.append('categoryId', categoryId);
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return this.request(`/api/menu/items${queryString}`);
  }

  async createItem(formData: FormData | Record<string, any>): Promise<{ success: boolean; data: MenuItem }> {
    const isForm = formData instanceof FormData;
    return this.request('/api/menu/items', {
      method: 'POST',
      body: isForm ? formData : JSON.stringify(formData),
    });
  }

  async updateItem(id: string, formData: FormData | Record<string, any>): Promise<{ success: boolean; data: MenuItem }> {
    const isForm = formData instanceof FormData;
    return this.request(`/api/menu/items/${id}`, {
      method: 'PUT',
      body: isForm ? formData : JSON.stringify(formData),
    });
  }

  async deleteItem(id: string): Promise<{ success: boolean; message: string }> {
    return this.request(`/api/menu/items/${id}`, {
      method: 'DELETE',
    });
  }

  async toggleItemStatus(id: string, isAvailable?: boolean): Promise<{ success: boolean; data: MenuItem }> {
    return this.request(`/api/menu/items/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ isAvailable }),
    });
  }

  // --- Categories ---
  async getCategories(type?: string): Promise<{ success: boolean; data: Category[] }> {
    const q = type ? `?type=${encodeURIComponent(type)}` : '';
    return this.request(`/api/categories${q}`);
  }

  async createCategory(data: {
    name: string;
    description?: string;
    parentCategory?: string;
    icon?: string;
  }): Promise<{ success: boolean; data: Category }> {
    return this.request('/api/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCategory(
    id: string,
    data: {
      name?: string;
      description?: string;
      parentCategory?: string;
      icon?: string;
      sortOrder?: number;
    }
  ): Promise<{ success: boolean; data: Category }> {
    return this.request(`/api/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCategory(id: string): Promise<{ success: boolean; message: string }> {
    return this.request(`/api/categories/${id}`, {
      method: 'DELETE',
    });
  }

  async reorderCategories(categoryIds: string[]): Promise<{ success: boolean; message: string }> {
    return this.request('/api/categories/reorder', {
      method: 'PUT',
      body: JSON.stringify({ categoryIds }),
    });
  }

  // --- Service Requests (Call Waiter / Bill) ---
  async submitServiceCall(data: {
    tableNumber: string;
    type: 'CALL_WAITER' | 'REQUEST_BILL';
    paymentMethod?: string;
    notes?: string;
  }): Promise<{ success: boolean; message: string; data: ServiceRequest }> {
    return this.request('/api/service/call', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getServiceRequests(): Promise<{ success: boolean; data: ServiceRequest[] }> {
    return this.request('/api/service/requests');
  }

  async resolveServiceRequest(id: string): Promise<{ success: boolean; message: string }> {
    return this.request(`/api/service/requests/${id}/resolve`, {
      method: 'PATCH',
    });
  }

  // --- Menu Analytics ---
  async trackEvent(data: {
    type: 'PAGE_VIEW' | 'TABLE_SCAN' | 'ITEM_VIEW';
    tableNumber?: string;
    itemId?: string;
    itemName?: string;
  }): Promise<{ success: boolean }> {
    return this.request('/api/analytics/track', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getAnalyticsSummary(): Promise<{
    success: boolean;
    data: {
      totalPageViews: number;
      totalTableScans: number;
      totalDishViews: number;
      topDishes: Array<{
        id: string;
        name: string;
        price: number | null;
        image: string | null;
        viewsCount: number;
        category?: { name: string; parentCategory: string };
      }>;
      topTables: Array<{ tableNumber: string; count: number }>;
    };
  }> {
    return this.request('/api/analytics/summary');
  }
}

export const api = new ApiClient();
