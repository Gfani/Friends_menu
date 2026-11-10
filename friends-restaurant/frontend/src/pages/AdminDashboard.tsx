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
      <div className="min-h-screen bg-[#0e0e11] flex items-center justify-center text-white">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#F32636] animate-bounce" />
          <span className="w-3 h-3 rounded-full bg-[#16B9E8] animate-bounce delay-100" />
          <span className="w-3 h-3 rounded-full bg-[#FFBD18] animate-bounce delay-200" />
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

  // Live Menu Stats computation (purely for digital menu management)
  const totalItemsCount = items.length;
  const categoriesCount = categories.length;
  const activeMenuCount = items.filter((i) => i.isAvailable).length;
  const pausedMenuCount = items.filter((i) => !i.isAvailable).length;

  return (
    <div className="min-h-screen bg-[#0e0e11] font-body text-[#f4f2f0] flex flex-col selection:bg-[#FFBD18] selection:text-black">
      {/* Header */}
      <AdminHeader />

      {/* Main Admin Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* KPI Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Total Dishes */}
          <div className="bg-[#16161b] border border-[#2b2b34] rounded-xl p-4 flex items-center gap-3.5 shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
            <div className="w-11 h-11 rounded-lg bg-[#FFBD18]/15 border border-[#FFBD18]/30 flex items-center justify-center text-[#FFBD18] shrink-0">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <span className="font-headline text-[11px] uppercase tracking-wider text-zinc-400 font-bold block">
                Total Dishes
              </span>
              <span className="font-headline text-2xl font-bold font-mono text-white">
                {totalItemsCount}
              </span>
            </div>
          </div>

          {/* Menu Categories */}
          <div className="bg-[#16161b] border border-[#2b2b34] rounded-xl p-4 flex items-center gap-3.5 shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
            <div className="w-11 h-11 rounded-lg bg-[#16B9E8]/15 border border-[#16B9E8]/30 flex items-center justify-center text-[#16B9E8] shrink-0">
              <FolderTree className="w-5 h-5" />
            </div>
            <div>
              <span className="font-headline text-[11px] uppercase tracking-wider text-zinc-400 font-bold block">
                Menu Sections
              </span>
              <span className="font-headline text-2xl font-bold font-mono text-[#16B9E8]">
                {categoriesCount}
              </span>
            </div>
          </div>

          {/* Visible on Menu */}
          <div className="bg-[#16161b] border border-[#2b2b34] rounded-xl p-4 flex items-center gap-3.5 shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
            <div className="w-11 h-11 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <span className="font-headline text-[11px] uppercase tracking-wider text-zinc-400 font-bold block">
                Visible on Menu
              </span>
              <span className="font-headline text-2xl font-bold font-mono text-emerald-400">
                {activeMenuCount}
              </span>
            </div>
          </div>

          {/* Temporarily Hidden / Paused */}
          <div className="bg-[#16161b] border border-[#2b2b34] rounded-xl p-4 flex items-center gap-3.5 shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
            <div className="w-11 h-11 rounded-lg bg-[#F32636]/15 border border-[#F32636]/30 flex items-center justify-center text-[#F32636] shrink-0">
              <EyeOff className="w-5 h-5" />
            </div>
            <div>
              <span className="font-headline text-[11px] uppercase tracking-wider text-zinc-400 font-bold block">
                Paused / Hidden
              </span>
              <span className="font-headline text-2xl font-bold font-mono text-[#F32636]">
                {pausedMenuCount}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs (Dishes vs Categories) */}
        <div className="flex border-b border-[#2b2b34] gap-2">
          <button
            onClick={() => setActiveTab('items')}
            className={`px-4 py-3 font-headline text-xs uppercase tracking-widest font-bold transition-all flex items-center gap-2 border-b-2 rounded-t-lg -mb-px cursor-pointer ${
              activeTab === 'items'
                ? 'border-[#FFBD18] text-[#FFBD18] bg-[#FFBD18]/10'
                : 'border-transparent text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Utensils className="w-4 h-4 text-[#FFBD18]" />
            <span>Dishes &amp; Live Pricing ({items.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-3 font-headline text-xs uppercase tracking-widest font-bold transition-all flex items-center gap-2 border-b-2 rounded-t-lg -mb-px cursor-pointer ${
              activeTab === 'categories'
                ? 'border-[#16B9E8] text-[#16B9E8] bg-[#16B9E8]/10'
                : 'border-transparent text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <FolderTree className="w-4 h-4 text-[#16B9E8]" />
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
