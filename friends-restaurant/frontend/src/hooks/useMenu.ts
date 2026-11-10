import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';
import { Category, MenuItem, SiteSettings, AdminUser } from '../types/menu';

export const MENU_QUERY_KEYS = {
  menu: ['menu'] as const,
  items: (search?: string, categoryId?: string) => ['items', { search, categoryId }] as const,
  categories: (type?: string) => ['categories', { type }] as const,
  settings: ['settings'] as const,
  serviceRequests: ['service-requests'] as const,
};

// 1. Fetch full menu for customer QR view
export function useMenu() {
  return useQuery<Category[]>({
    queryKey: MENU_QUERY_KEYS.menu,
    queryFn: async () => {
      const res = await api.getMenu();
      return res.data;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchOnWindowFocus: true,
  });
}

// 2. Fetch categories with optional type filter ("FOOD" | "DRINKS")
export function useCategories(type?: string) {
  return useQuery<Category[]>({
    queryKey: MENU_QUERY_KEYS.categories(type),
    queryFn: async () => {
      const res = await api.getCategories(type);
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
  });
}

// 3. Fetch flat items list for admin
export function useItems(search?: string, categoryId?: string) {
  return useQuery<MenuItem[]>({
    queryKey: MENU_QUERY_KEYS.items(search, categoryId),
    queryFn: async () => {
      const res = await api.getItems(search, categoryId);
      return res.data;
    },
  });
}

// 4. Instant toggle dish availability (Optimistic update)
export function useToggleItemStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isAvailable }: { id: string; isAvailable?: boolean }) =>
      api.toggleItemStatus(id, isAvailable),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MENU_QUERY_KEYS.menu });
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });
}

// 5. Create dish
export function useCreateItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData | Record<string, any>) => api.createItem(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MENU_QUERY_KEYS.menu });
      queryClient.invalidateQueries({ queryKey: ['items'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}

// 6. Update dish
export function useUpdateItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData | Record<string, any> }) =>
      api.updateItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MENU_QUERY_KEYS.menu });
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });
}

// 7. Delete dish
export function useDeleteItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.deleteItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MENU_QUERY_KEYS.menu });
      queryClient.invalidateQueries({ queryKey: ['items'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}

// 8. Category mutations
export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; description?: string; parentCategory?: string; icon?: string }) =>
      api.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: MENU_QUERY_KEYS.menu });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { name?: string; description?: string; parentCategory?: string; icon?: string; sortOrder?: number };
    }) => api.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: MENU_QUERY_KEYS.menu });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: MENU_QUERY_KEYS.menu });
    },
  });
}

export function useReorderCategories() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) => api.reorderCategories(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: MENU_QUERY_KEYS.menu });
    },
  });
}

// 9. Site Settings CMS Hooks
export function useSiteSettings() {
  return useQuery<SiteSettings>({
    queryKey: MENU_QUERY_KEYS.settings,
    queryFn: async () => {
      const res = await api.getSettings();
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useUpdateSiteSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<SiteSettings>) => api.updateSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MENU_QUERY_KEYS.settings });
    },
  });
}

export function useResetSiteSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => api.resetSettings(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MENU_QUERY_KEYS.settings });
    },
  });
}

// 10. Admin Account Credentials Hook
export function useUpdateAdminProfile() {
  return useMutation({
    mutationFn: (data: { email?: string; name?: string; currentPassword?: string; newPassword?: string }) =>
      api.updateProfile(data),
    onSuccess: (res) => {
      if (res.admin) {
        localStorage.setItem('friends_admin_user', JSON.stringify(res.admin));
      }
    },
  });
}

// 11. Service Requests (Call Waiter / Bill)
export function useCallService() {
  return useMutation({
    mutationFn: (data: { tableNumber: string; type: 'CALL_WAITER' | 'REQUEST_BILL'; paymentMethod?: string; notes?: string }) =>
      api.submitServiceCall(data),
  });
}

export function useServiceRequests() {
  return useQuery({
    queryKey: MENU_QUERY_KEYS.serviceRequests,
    queryFn: async () => {
      const res = await api.getServiceRequests();
      return res.data;
    },
    refetchInterval: 10000,
  });
}

export function useResolveServiceRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.resolveServiceRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MENU_QUERY_KEYS.serviceRequests });
    },
  });
}
