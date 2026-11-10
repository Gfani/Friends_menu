import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import {
  Utensils,
  FolderTree,
  CheckCircle2,
  EyeOff,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  useCategories,
  useItems,
  useCreateItem,
  useUpdateItem,
} from '../hooks/useMenu';
import { AdminHeader } from '../components/admin/AdminHeader';
import { CategoryManager } from '../components/admin/CategoryManager';
import { ItemListTable } from '../components/admin/ItemListTable';
import { ItemFormModal } from '../components/admin/ItemFormModal';
import { MenuItem } from '../types/menu';

export const AdminDashboard: React.FC = () => {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

  const [activeTab, setActiveTab] = useState<'items' | 'categories'>('items');
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // Queries
  const { data: categories = [] } = useCategories();
  const { data: items = [] } = useItems();

  // Mutations
  const createItemMutation = useCreateItem();
  const updateItemMutation = useUpdateItem();

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">
        <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-[#FFBD18] animate-spin" />
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

  // Live Menu Stats computation (purely for digital menu management)
  const totalItemsCount = items.length;
  const categoriesCount = categories.length;
  const activeMenuCount = items.filter((i) => i.isAvailable).length;
  const pausedMenuCount = items.filter((i) => !i.isAvailable).length;

  return (
    <div className="min-h-screen bg-[#050505] font-body text-[#A1A1AA] flex flex-col selection:bg-[#FFBD18] selection:text-black">
      {/* Header */}
      <AdminHeader />

      {/* Main Admin Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* KPI Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Dishes */}
          <div className="bg-[#121212] border border-[#222222] rounded-2xl p-5 flex items-center gap-4 shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
            <div className="w-12 h-12 rounded-xl bg-[#181818] border border-[#262626] flex items-center justify-center text-white shrink-0">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <span className="font-headline text-[11px] uppercase tracking-wider text-[#A1A1AA] font-bold block">
                Total Dishes
              </span>
              <span className="font-headline text-2xl font-bold font-mono text-white">
                {totalItemsCount}
              </span>
            </div>
          </div>

          {/* Menu Sections */}
          <div className="bg-[#121212] border border-[#222222] rounded-2xl p-5 flex items-center gap-4 shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
            <div className="w-12 h-12 rounded-xl bg-[#181818] border border-[#262626] flex items-center justify-center text-white shrink-0">
              <FolderTree className="w-5 h-5" />
            </div>
            <div>
              <span className="font-headline text-[11px] uppercase tracking-wider text-[#A1A1AA] font-bold block">
                Menu Sections
              </span>
              <span className="font-headline text-2xl font-bold font-mono text-white">
                {categoriesCount}
              </span>
            </div>
          </div>

          {/* Visible on Menu */}
          <div className="bg-[#121212] border border-[#222222] rounded-2xl p-5 flex items-center gap-4 shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
            <div className="w-12 h-12 rounded-xl bg-[#181818] border border-[#262626] flex items-center justify-center text-white shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <span className="font-headline text-[11px] uppercase tracking-wider text-[#A1A1AA] font-bold block">
                Visible on Menu
              </span>
              <span className="font-headline text-2xl font-bold font-mono text-white">
                {activeMenuCount}
              </span>
            </div>
          </div>

          {/* Paused / Hidden */}
          <div className="bg-[#121212] border border-[#222222] rounded-2xl p-5 flex items-center gap-4 shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
            <div className="w-12 h-12 rounded-xl bg-[#181818] border border-[#262626] flex items-center justify-center text-white shrink-0">
              <EyeOff className="w-5 h-5" />
            </div>
            <div>
              <span className="font-headline text-[11px] uppercase tracking-wider text-[#A1A1AA] font-bold block">
                Paused / Hidden
              </span>
              <span className="font-headline text-2xl font-bold font-mono text-white">
                {pausedMenuCount}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs (Dishes vs Categories) */}
        <div className="flex border-b border-[#222222] gap-2">
          <button
            onClick={() => setActiveTab('items')}
            className={`px-5 py-3 font-headline text-xs uppercase tracking-widest font-bold transition-all flex items-center gap-2 border-b-2 rounded-t-xl -mb-px cursor-pointer ${
              activeTab === 'items'
                ? 'border-[#FFBD18] text-white bg-white/5'
                : 'border-transparent text-[#A1A1AA] hover:text-white hover:bg-white/5'
            }`}
          >
            <Utensils className="w-4 h-4 text-white" />
            <span>Dishes &amp; Live Pricing ({items.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`px-5 py-3 font-headline text-xs uppercase tracking-widest font-bold transition-all flex items-center gap-2 border-b-2 rounded-t-xl -mb-px cursor-pointer ${
              activeTab === 'categories'
                ? 'border-[#FFBD18] text-white bg-white/5'
                : 'border-transparent text-[#A1A1AA] hover:text-white hover:bg-white/5'
            }`}
          >
            <FolderTree className="w-4 h-4 text-white" />
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
    </div>
  );
};
