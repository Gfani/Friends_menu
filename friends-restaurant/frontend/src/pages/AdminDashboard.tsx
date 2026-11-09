import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import {
  Utensils,
  FolderTree,
  Bell,
  CheckCircle2,
  Clock,
  Check,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  useCategories,
  useItems,
  useCreateItem,
  useUpdateItem,
  useServiceRequests,
  useResolveServiceRequest,
} from '../hooks/useMenu';
import { AdminHeader } from '../components/admin/AdminHeader';
import { CategoryManager } from '../components/admin/CategoryManager';
import { ItemListTable } from '../components/admin/ItemListTable';
import { ItemFormModal } from '../components/admin/ItemFormModal';
import { Modal } from '../components/ui/Modal';
import { MenuItem } from '../types/menu';

export const AdminDashboard: React.FC = () => {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

  const [activeTab, setActiveTab] = useState<'items' | 'categories'>('items');
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);

  // Queries
  const { data: categories = [] } = useCategories();
  const { data: items = [] } = useItems();
  const { data: serviceRequests = [] } = useServiceRequests();

  // Mutations
  const createItemMutation = useCreateItem();
  const updateItemMutation = useUpdateItem();
  const resolveServiceMutation = useResolveServiceRequest();

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center text-white">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-secondary-container animate-bounce" />
          <span className="w-3 h-3 rounded-full bg-tertiary-container animate-bounce delay-100" />
          <span className="w-3 h-3 rounded-full bg-primary-container animate-bounce delay-200" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleOpenAdd = () => {
    setEditingItem(null);
    setIsItemModalOpen(true);
  };

  const handleOpenEdit = (item: MenuItem) => {
    setEditingItem(item);
    setIsItemModalOpen(true);
  };

  const handleSaveItem = async (formData: FormData) => {
    if (editingItem) {
      await updateItemMutation.mutateAsync({
        id: editingItem.id,
        data: formData,
      });
    } else {
      await createItemMutation.mutateAsync(formData);
    }
    setIsItemModalOpen(false);
    setEditingItem(null);
  };

  // Stats computation
  const totalItemsCount = items.length;
  const inStockCount = items.filter((i) => i.isAvailable).length;
  const soldOutCount = items.filter((i) => !i.isAvailable).length;
  const pendingRequests = serviceRequests.filter((r) => r.status === 'PENDING');

  return (
    <div className="min-h-screen bg-surface font-body text-on-surface flex flex-col selection:bg-primary-container selection:text-on-primary-container">
      {/* Header */}
      <AdminHeader onOpenServiceRequests={() => setIsServiceModalOpen(true)} />

      {/* Main Admin Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* KPI Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Total Dishes */}
          <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary-container shrink-0">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <span className="font-headline text-[10px] uppercase tracking-wider text-outline font-semibold block">
                Total Dishes
              </span>
              <span className="font-headline text-2xl font-bold font-mono text-primary">
                {totalItemsCount}
              </span>
            </div>
          </div>

          {/* In Stock */}
          <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-container/15 flex items-center justify-center text-primary-container shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <span className="font-headline text-[10px] uppercase tracking-wider text-outline font-semibold block">
                In Stock (Active)
              </span>
              <span className="font-headline text-2xl font-bold font-mono text-primary-container">
                {inStockCount}
              </span>
            </div>
          </div>

          {/* Sold Out */}
          <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-secondary-container/15 flex items-center justify-center text-secondary shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="font-headline text-[10px] uppercase tracking-wider text-outline font-semibold block">
                Sold Out
              </span>
              <span className="font-headline text-2xl font-bold font-mono text-secondary">
                {soldOutCount}
              </span>
            </div>
          </div>

          {/* Active Calls */}
          <div
            onClick={() => setIsServiceModalOpen(true)}
            className="bg-surface-container-low border border-outline-variant/30 hover:border-primary-container/60 rounded-xl p-4 flex items-center gap-3 cursor-pointer transition-all group"
          >
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                pendingRequests.length > 0
                  ? 'bg-secondary-container/20 text-secondary animate-pulse'
                  : 'bg-tertiary-container/15 text-tertiary'
              }`}
            >
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <span className="font-headline text-[10px] uppercase tracking-wider text-outline font-semibold block">
                Table Requests
              </span>
              <span className="font-headline text-2xl font-bold font-mono text-on-surface group-hover:text-primary transition-colors">
                {pendingRequests.length} pending
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs (Dishes vs Categories) */}
        <div className="flex border-b border-outline-variant/20 gap-4">
          <button
            onClick={() => setActiveTab('items')}
            className={`pb-3 font-headline text-xs uppercase tracking-widest font-bold transition-all flex items-center gap-2 border-b-2 -mb-px ${
              activeTab === 'items'
                ? 'border-primary-container text-primary'
                : 'border-transparent text-outline hover:text-on-surface'
            }`}
          >
            <Utensils className="w-4 h-4 text-primary-container" />
            <span>Dishes &amp; Live Pricing ({items.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`pb-3 font-headline text-xs uppercase tracking-widest font-bold transition-all flex items-center gap-2 border-b-2 -mb-px ${
              activeTab === 'categories'
                ? 'border-primary-container text-primary'
                : 'border-transparent text-outline hover:text-on-surface'
            }`}
          >
            <FolderTree className="w-4 h-4 text-tertiary" />
            <span>Category Manager ({categories.length})</span>
          </button>
        </div>

        {/* Tab View 1: Dishes Table */}
        {activeTab === 'items' && (
          <ItemListTable
            items={items}
            categories={categories}
            onEditItem={handleOpenEdit}
            onAddNew={handleOpenAdd}
          />
        )}

        {/* Tab View 2: Categories Manager */}
        {activeTab === 'categories' && <CategoryManager categories={categories} />}
      </main>

      {/* Modal: Item Create / Edit */}
      <ItemFormModal
        isOpen={isItemModalOpen}
        onClose={() => {
          setIsItemModalOpen(false);
          setEditingItem(null);
        }}
        itemToEdit={editingItem}
        categories={categories}
        onSave={handleSaveItem}
        isSaving={createItemMutation.isPending || updateItemMutation.isPending}
      />

      {/* Modal: Table Service Alerts */}
      <Modal
        isOpen={isServiceModalOpen}
        onClose={() => setIsServiceModalOpen(false)}
        title="Garden Table Service Alerts"
        subtitle="Live customer requests submitted via the mobile QR menu"
        maxWidth="lg"
      >
        <div className="space-y-3">
          {pendingRequests.length === 0 ? (
            <div className="py-8 text-center text-outline text-body-sm">
              <CheckCircle2 className="w-8 h-8 text-primary-container mx-auto mb-2 opacity-80" />
              <p>All garden tables are currently satisfied. No pending requests!</p>
            </div>
          ) : (
            <div className="divide-y divide-outline-variant/20 max-h-96 overflow-y-auto">
              {pendingRequests.map((req) => (
                <div key={req.id} className="py-3 flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-headline font-bold text-primary text-base">
                        Table #{req.tableNumber}
                      </span>
                      <span
                        className={`font-headline text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                          req.type === 'CALL_WAITER'
                            ? 'bg-secondary-container/20 text-secondary'
                            : 'bg-primary-container/20 text-primary-container'
                        }`}
                      >
                        {req.type === 'CALL_WAITER' ? 'Call Waiter' : 'Bill Requested'}
                      </span>
                    </div>
                    {req.paymentMethod && (
                      <p className="text-body-sm text-on-surface-variant mt-0.5">
                        Payment: <strong className="text-primary">{req.paymentMethod}</strong>
                      </p>
                    )}
                    {req.notes && (
                      <p className="text-body-sm text-on-surface-variant italic mt-0.5">&ldquo;{req.notes}&rdquo;</p>
                    )}
                    <span className="text-[10px] text-outline block mt-0.5 font-mono">
                      {new Date(req.createdAt).toLocaleTimeString()}
                    </span>
                  </div>

                  <button
                    onClick={() => resolveServiceMutation.mutate(req.id)}
                    disabled={resolveServiceMutation.isPending}
                    className="px-3 py-1.5 bg-primary-container/20 hover:bg-primary-container/30 text-primary-container text-xs font-headline uppercase font-semibold rounded border border-primary-container/40 flex items-center gap-1.5 transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Done</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};
